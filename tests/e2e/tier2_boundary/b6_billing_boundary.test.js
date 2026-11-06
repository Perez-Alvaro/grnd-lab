/**
 * tests/e2e/tier2_boundary/b6_billing_boundary.test.js
 * Tier 2 — Boundary & Corner Cases: Webhook Attacks & Freemium Limits [T-01]
 */

import { assertEqual } from '../helpers/assertions.js';
import { generateMPSignature } from '../helpers/cryptoUtils.js';
import { simulateWebhookProcessing, checkFreemiumRoutineCreationQuota } from '../helpers/contracts.js';

export const tests = [
  {
    id: 'B6-01',
    name: 'Malformed x-signature header (missing ts or v1) returns HTTP 401',
    feature: 'F6',
    tier: 2,
    fn: async () => {
      const secret = 'test-secret';
      const dataId = 'pay-malformed-001';
      const requestId = 'req-1';

      // Header without ts
      const resNoTs = simulateWebhookProcessing({
        headers: { 'x-signature': 'v1=abcdef', 'x-request-id': requestId },
        dataId,
        secret,
      });
      assertEqual(resNoTs.status, 401, 'Must reject header missing ts=');

      // Header without v1
      const resNoV1 = simulateWebhookProcessing({
        headers: { 'x-signature': 'ts=1700000000', 'x-request-id': requestId },
        dataId,
        secret,
      });
      assertEqual(resNoV1.status, 401, 'Must reject header missing v1=');

      // Garbage header
      const resGarbage = simulateWebhookProcessing({
        headers: { 'x-signature': 'invalid_garbage_header', 'x-request-id': requestId },
        dataId,
        secret,
      });
      assertEqual(resGarbage.status, 401, 'Must reject malformed syntax');
    },
  },
  {
    id: 'B6-02',
    name: 'Tampered HMAC signature (timing attack / hash mismatch) returns HTTP 401',
    feature: 'F6',
    tier: 2,
    fn: async () => {
      const secret = 'valid-secret-key';
      const dataId = 'pay-tampered-123';
      const requestId = 'req-tampered-123';
      const sig = generateMPSignature({ dataId, requestId, secret });

      // Modify single character of hash
      const tamperedHash = sig.hash.slice(0, -1) + (sig.hash.slice(-1) === 'a' ? 'b' : 'a');
      const tamperedHeader = `ts=${sig.ts},v1=${tamperedHash}`;

      const res = simulateWebhookProcessing({
        headers: {
          'x-signature': tamperedHeader,
          'x-request-id': requestId,
        },
        dataId,
        secret,
      });
      assertEqual(res.status, 401, 'Must reject tampered HMAC signature');
      assertEqual(res.updated, false);
    },
  },
  {
    id: 'B6-03',
    name: 'Replay attack: Duplicate event ID acknowledged with HTTP 200 without double-crediting days',
    feature: 'F6',
    tier: 2,
    fn: async () => {
      const secret = 'secret-replay';
      const dataId = 'pay-replay-event-001';
      const requestId = 'req-replay-001';
      const sig = generateMPSignature({ dataId, requestId, secret });
      const processedEvents = new Set();

      const initialSub = {
        userId: 'coach-1',
        plan: 'pro_monthly',
        currentPeriodEnd: new Date('2026-12-01T00:00:00Z').toISOString(),
      };

      // Initial execution
      const res1 = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'coach-1:pro_monthly',
        processedEvents,
        currentSubscription: initialSub,
        secret,
      });
      assertEqual(res1.status, 200);
      assertEqual(res1.updated, true);
      const creditedEnd = res1.subscription.currentPeriodEnd;
      assertEqual(typeof creditedEnd, 'string');

      // Duplicate execution (replay)
      const res2 = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'coach-1:pro_monthly',
        processedEvents,
        currentSubscription: res1.subscription,
        secret,
      });
      assertEqual(res2.status, 200);
      assertEqual(res2.updated, false);
      assertEqual(res2.replayed, true);
      // Subscription was not modified on replay
      assertEqual(res2.subscription, undefined);
    },
  },
  {
    id: 'B6-04',
    name: 'Non-approved payment statuses (rejected, pending, refunded) do not activate subscription',
    feature: 'F6',
    tier: 2,
    fn: async () => {
      const secret = 'secret-non-approved';
      const unapprovedStatuses = ['rejected', 'pending', 'in_process', 'refunded', 'cancelled'];

      for (const status of unapprovedStatuses) {
        const dataId = `pay-status-${status}`;
        const requestId = `req-status-${status}`;
        const sig = generateMPSignature({ dataId, requestId, secret });

        const res = simulateWebhookProcessing({
          headers: { 'x-signature': sig.header, 'x-request-id': requestId },
          dataId,
          paymentStatus: status,
          externalReference: 'coach-2:pro_monthly',
          secret,
        });
        assertEqual(res.status, 200, `Must acknowledge status ${status}`);
        assertEqual(res.updated, false, `Must NOT activate subscription for status ${status}`);
      }
    },
  },
  {
    id: 'B6-05',
    name: 'Freemium boundary: coach with 3 routines is blocked from 4th routine unless upgraded',
    feature: 'F6',
    tier: 2,
    fn: async () => {
      // 0 routines
      assertEqual(checkFreemiumRoutineCreationQuota({ userRoutinesCount: 0, hasActiveSub: false, isAdmin: false }).allowed, true);
      // 1 routine
      assertEqual(checkFreemiumRoutineCreationQuota({ userRoutinesCount: 1, hasActiveSub: false, isAdmin: false }).allowed, true);
      // 2 routines
      assertEqual(checkFreemiumRoutineCreationQuota({ userRoutinesCount: 2, hasActiveSub: false, isAdmin: false }).allowed, true);
      // 3 routines -> Boundary reached!
      const limitReached = checkFreemiumRoutineCreationQuota({ userRoutinesCount: 3, hasActiveSub: false, isAdmin: false });
      assertEqual(limitReached.allowed, false, '4th routine must be blocked when quota is 3');
      assertEqual(limitReached.reason, 'freemium_quota_exceeded');

      // With active subscription -> Unlocked!
      const upgraded = checkFreemiumRoutineCreationQuota({ userRoutinesCount: 3, hasActiveSub: true, isAdmin: false });
      assertEqual(upgraded.allowed, true, 'Active subscription unlocks unlimited routine creation');

      // With admin -> Unlocked!
      const admin = checkFreemiumRoutineCreationQuota({ userRoutinesCount: 10, hasActiveSub: false, isAdmin: true });
      assertEqual(admin.allowed, true, 'Admin always bypasses routine limits');
    },
  },
  {
    id: 'B6-06',
    name: 'Missing or malformed external_reference in webhook returns HTTP 400',
    feature: 'F6',
    tier: 2,
    fn: async () => {
      const secret = 'secret-ext-ref';
      const dataId = 'pay-bad-ext-ref';
      const requestId = 'req-bad-ext-ref';
      const sig = generateMPSignature({ dataId, requestId, secret });

      const resMissing = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: '',
        secret,
      });
      assertEqual(resMissing.status, 400, 'Must return 400 on empty external_reference');

      const resInvalidPlan = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'user-1:unknown_tier',
        secret,
      });
      assertEqual(resInvalidPlan.status, 400, 'Must return 400 on invalid tier in external_reference');
    },
  },
];
