/**
 * tests/e2e/tier1_feature/f6_mercadopago_billing.test.js
 * Tier 1 — Feature 6: Automated Mercado Pago Billing Infrastructure [T-01]
 * Source: ORIGINAL_REQUEST.md R3, PROJECT.md F6, teamwork_explorer_survey_3/handoff.md
 */

import { assert, assertEqual, assertMatches } from '../helpers/assertions.js';
import { readFileContent } from '../helpers/fileScanner.js';
import { generateMPSignature } from '../helpers/cryptoUtils.js';
import { buildMercadoPagoPreference, simulateWebhookProcessing } from '../helpers/contracts.js';

export const tests = [
  {
    id: 'F6-01',
    name: 'Mercado Pago preference specifies ARS currency, exact tier pricing, and external_reference',
    feature: 'F6',
    tier: 1,
    fn: async () => {
      const prefMonthly = buildMercadoPagoPreference({ plan: 'pro_monthly', userId: 'user-123' });
      assertEqual(prefMonthly.items[0].currency_id, 'ARS');
      assertEqual(prefMonthly.items[0].unit_price, 15000);
      assertEqual(prefMonthly.external_reference, 'user-123:pro_monthly');

      const prefAnnual = buildMercadoPagoPreference({ plan: 'pro_annual', userId: 'user-456' });
      assertEqual(prefAnnual.items[0].currency_id, 'ARS');
      assertEqual(prefAnnual.items[0].unit_price, 120000);
      assertEqual(prefAnnual.external_reference, 'user-456:pro_annual');
    },
  },
  {
    id: 'F6-02',
    name: 'Webhook signature verification validates authentic HMAC-SHA256 and rejects tampered headers',
    feature: 'F6',
    tier: 1,
    fn: async () => {
      const secret = 'super-secret-key';
      const dataId = 'pay-999888';
      const requestId = 'req-abc-123';
      const sig = generateMPSignature({ dataId, requestId, secret });

      // Valid call
      const resultValid = simulateWebhookProcessing({
        headers: {
          'x-signature': sig.header,
          'x-request-id': requestId,
        },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'user-1:pro_monthly',
        secret,
      });
      assertEqual(resultValid.status, 200);
      assertEqual(resultValid.updated, true);

      // Tampered signature
      const resultTampered = simulateWebhookProcessing({
        headers: {
          'x-signature': sig.header.replace(/1/g, '2'),
          'x-request-id': requestId,
        },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'user-1:pro_monthly',
        secret,
      });
      assertEqual(resultTampered.status, 401);
      assertEqual(resultTampered.updated, false);
    },
  },
  {
    id: 'F6-03',
    name: 'Webhook idempotency check prevents duplicate events from re-crediting subscription',
    feature: 'F6',
    tier: 1,
    fn: async () => {
      const secret = 'secret-idem-key';
      const dataId = 'pay-duplicate-001';
      const requestId = 'req-idem-001';
      const sig = generateMPSignature({ dataId, requestId, secret });
      const processedEvents = new Set();

      // First webhook delivery
      const firstDelivery = simulateWebhookProcessing({
        headers: {
          'x-signature': sig.header,
          'x-request-id': requestId,
        },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'user-77:pro_monthly',
        processedEvents,
        secret,
      });
      assertEqual(firstDelivery.status, 200);
      assertEqual(firstDelivery.updated, true);

      // Duplicate delivery (replay attack)
      const secondDelivery = simulateWebhookProcessing({
        headers: {
          'x-signature': sig.header,
          'x-request-id': requestId,
        },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'user-77:pro_monthly',
        processedEvents,
        secret,
      });
      assertEqual(secondDelivery.status, 200);
      assertEqual(secondDelivery.updated, false);
      assertEqual(secondDelivery.replayed, true);
    },
  },
  {
    id: 'F6-04',
    name: 'Webhook status validation: only approved payments activate subscription',
    feature: 'F6',
    tier: 1,
    fn: async () => {
      const secret = 'secret-status-key';
      const dataId = 'pay-pending-001';
      const requestId = 'req-pending-001';
      const sig = generateMPSignature({ dataId, requestId, secret });

      const pendingResult = simulateWebhookProcessing({
        headers: {
          'x-signature': sig.header,
          'x-request-id': requestId,
        },
        dataId,
        paymentStatus: 'pending',
        externalReference: 'user-9:pro_monthly',
        secret,
      });
      assertEqual(pendingResult.status, 200);
      assertEqual(pendingResult.updated, false);
    },
  },
  {
    id: 'F6-05',
    name: 'Database migration 0010_mercado_pago_billing.sql updates plan check constraint',
    feature: 'F6',
    tier: 1,
    fn: async () => {
      const sqlContent = readFileContent('supabase/migrations/0010_mercado_pago_billing.sql');
      assert(sqlContent !== null, 'supabase/migrations/0010_mercado_pago_billing.sql must exist');

      assertMatches(sqlContent, /subscriptions_plan_check/i, 'Migration must update subscriptions_plan_check');
      assertMatches(sqlContent, /freemium/i, 'Check constraint must include freemium');
      assertMatches(sqlContent, /pro_monthly/i, 'Check constraint must include pro_monthly');
      assertMatches(sqlContent, /pro_annual/i, 'Check constraint must include pro_annual');
    },
  },
  {
    id: 'F6-06',
    name: 'Database migration 0010_mercado_pago_billing.sql implements Freemium 3-routine limit in RLS',
    feature: 'F6',
    tier: 1,
    fn: async () => {
      const sqlContent = readFileContent('supabase/migrations/0010_mercado_pago_billing.sql');
      assert(sqlContent !== null, 'supabase/migrations/0010_mercado_pago_billing.sql must exist');

      assertMatches(sqlContent, /routines.*insert/i, 'Migration must configure routines insert policy');
      assertMatches(sqlContent, /count\(\*\).*<\s*3/i, 'RLS policy must enforce routine count < 3 for freemium users');
    },
  },
];
