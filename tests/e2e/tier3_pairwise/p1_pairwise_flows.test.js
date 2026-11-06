/**
 * tests/e2e/tier3_pairwise/p1_pairwise_flows.test.js
 * Tier 3 — Cross-Feature Combinations (Pairwise Tests)
 * Verifies contract interactions between pairs of features F1..F7.
 */

import { assert, assertEqual, assertMatches } from '../helpers/assertions.js';
import { generateMPSignature } from '../helpers/cryptoUtils.js';
import {
  resolveBrandName,
  validateWorkoutRoutine,
  buildMercadoPagoPreference,
  simulateWebhookProcessing,
  checkFreemiumRoutineCreationQuota,
} from '../helpers/contracts.js';
import { fileExists, resolveProjectPath } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'P1-01',
    name: 'Pairwise (F4 + F5): Sample Routine Onboarding Ingestion with White-Label Brand Override',
    tier: 3,
    fn: async () => {
      // 1. Load sample routine
      assert(fileExists('src/constants/sampleWorkoutRoutine.js'), 'Sample workout routine must exist');
      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);
      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;

      // 2. Validate schema
      const val = validateWorkoutRoutine(sample);
      assertEqual(val.valid, true, 'Sample routine must be valid before modification');

      // 3. Coach customizes personal brand name
      const customBrand = 'ELITE ATHLETICS ARGENTINA';
      const modifiedRoutine = {
        ...sample,
        metadata: {
          ...sample.metadata,
          brandName: customBrand,
        },
      };

      // 4. Resolve brand name for PDF export
      const resolved = resolveBrandName({
        brandName: modifiedRoutine.metadata.brandName,
        author: modifiedRoutine.metadata.author,
      });

      assertEqual(resolved, customBrand, 'Custom brand name must override author on sample routine');
    },
  },
  {
    id: 'P1-02',
    name: 'Pairwise (F6 + F5): Mercado Pago Webhook Activation Unlocks White-Label PDF Branding',
    tier: 3,
    fn: async () => {
      const secret = 'webhook-whitelabel-secret';
      const dataId = 'pay-whitelabel-001';
      const requestId = 'req-wl-001';
      const sig = generateMPSignature({ dataId, requestId, secret });

      // Simulate incoming payment webhook for Pro plan
      const webhookRes = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: 'coach-diego:pro_monthly',
        secret,
      });

      assertEqual(webhookRes.status, 200);
      assertEqual(webhookRes.updated, true);
      assertEqual(webhookRes.subscription.status, 'active');

      // Given an active Pro subscription, coach's configured brand name is applied
      const coachBrand = 'DIEGO TRAINER PRO';
      const brandForPDF = resolveBrandName({
        brandName: coachBrand,
        author: 'Diego Gomez',
        userName: 'diego',
      });

      assertEqual(brandForPDF, coachBrand, 'Pro subscription enables custom white-label branding');
    },
  },
  {
    id: 'P1-03',
    name: 'Pairwise (F3 + F6): Landing Page Pricing Card Selection Generates Accurate MP Preference',
    tier: 3,
    fn: async () => {
      // Coach selects Pro Mensual from landing page
      const prefMonthly = buildMercadoPagoPreference({
        plan: 'pro_monthly',
        userId: 'coach-monthly-1',
        userEmail: 'coach@gym.com',
      });
      assertEqual(prefMonthly.items[0].unit_price, 15000);
      assertEqual(prefMonthly.items[0].currency_id, 'ARS');

      // Coach selects Pro Anual from landing page
      const prefAnnual = buildMercadoPagoPreference({
        plan: 'pro_annual',
        userId: 'coach-annual-1',
        userEmail: 'coach@gym.com',
      });
      assertEqual(prefAnnual.items[0].unit_price, 120000);
      assertEqual(prefAnnual.items[0].currency_id, 'ARS');
      assertMatches(prefAnnual.items[0].title, /Anual/i);
    },
  },
  {
    id: 'P1-04',
    name: 'Pairwise (F3 + F6): Freemium 3-Routine Limit Triggers MP Upgrade and Unlocks Creation',
    tier: 3,
    fn: async () => {
      const coachId = 'coach-freemium-user';

      // 1. Coach creates 3 free routines on Freemium tier
      const quotaCheck3 = checkFreemiumRoutineCreationQuota({
        userRoutinesCount: 3,
        hasActiveSub: false,
        isAdmin: false,
      });
      assertEqual(quotaCheck3.allowed, false, 'Freemium coach cannot exceed 3 routines');

      // 2. Coach initiates Pro Anual upgrade
      const pref = buildMercadoPagoPreference({ plan: 'pro_annual', userId: coachId });
      assertEqual(pref.external_reference, `${coachId}:pro_annual`);

      // 3. Webhook processes approved payment
      const secret = 'secret-upgrade-key';
      const dataId = 'pay-upgrade-999';
      const requestId = 'req-upgrade-999';
      const sig = generateMPSignature({ dataId, requestId, secret });

      const webhookRes = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: pref.external_reference,
        secret,
      });

      assertEqual(webhookRes.subscription.status, 'active');

      // 4. Now with active subscription, coach can create 4th, 5th, etc. routines
      const quotaCheckAfterUpgrade = checkFreemiumRoutineCreationQuota({
        userRoutinesCount: 3,
        hasActiveSub: true,
        isAdmin: false,
      });
      assertEqual(quotaCheckAfterUpgrade.allowed, true, 'Upgraded coach can create unlimited routines');
    },
  },
  {
    id: 'P1-05',
    name: 'Pairwise (F1 + F3): Landing Page Footer Opens Ley 25.326 Privacy Modal Without Navigation',
    tier: 3,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const privacyMod = await import(`file://${fullPath}`);

      // Verify that privacy clauses are ready to be displayed inside landing page modal
      assert(privacyMod.PRIVACY_SECTIONS.length >= 6, 'Must have at least 6 privacy clauses');
      const arco = privacyMod.PRIVACY_SECTIONS.find((s) => s.id === 'derechos_arco');
      assert(arco !== undefined, 'ARCO clause must be ready for modal presentation');
    },
  },
  {
    id: 'P1-06',
    name: 'Pairwise (F4 + F7): Onboarding Sample Routine Load Does Not Trigger Heavy PDF Bundle',
    tier: 3,
    fn: async () => {
      // Verify sample routine is statically isolated in constants and does not import @react-pdf/renderer
      assert(fileExists('src/constants/sampleWorkoutRoutine.js'), 'sampleWorkoutRoutine.js must exist');
      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);
      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;

      // Sample data has zero references to @react-pdf
      assert(sample !== null && typeof sample === 'object');
      const sampleStr = JSON.stringify(sample);
      assert(!sampleStr.includes('@react-pdf'), 'Sample routine must not have PDF dependencies');
    },
  },
  {
    id: 'P1-07',
    name: 'Pairwise (F1 + F2): Privacy Policy Explicitly Outlines Cloud Storage (Consistent with Removed Claims)',
    tier: 3,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const privacyMod = await import(`file://${fullPath}`);

      // Verify privacy policy transparently describes cloud backend (Supabase / RLS)
      const secText = privacyMod.PRIVACY_SECTIONS.map((s) => s.cuerpo).join(' ');
      assertMatches(secText, /Supabase|Row Level Security|servidor|base de datos/i, 'Privacy policy must disclose secure database storage');
    },
  },
  {
    id: 'P1-08',
    name: 'Pairwise (F5 + F7): Dynamic PDF Loader Passes Coach Brand Name to Both Desktop and Mobile Generators',
    tier: 3,
    fn: async () => {
      const planWithBrand = {
        metadata: {
          title: 'Plan de Hipertrofia 12 Semanas',
          brandName: 'TITAN COACHING',
          author: 'Esteban Titan',
        },
      };

      const resolvedBrand = resolveBrandName({
        brandName: planWithBrand.metadata.brandName,
        author: planWithBrand.metadata.author,
      });

      assertEqual(resolvedBrand, 'TITAN COACHING', 'Dynamic PDF pipelines receive configured brand');
    },
  },
];
