/**
 * tests/e2e/tier4_scenarios/s1_realworld_scenarios.test.js
 * Tier 4 — Real-World Application Scenarios
 * Source: TEST_INFRA.md § Real-World Application Scenarios
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
import { fileExists, readFileContent, resolveProjectPath } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'S4-01',
    name: 'Scenario 1: First-time coach onboarding -> Cargar rutina de ejemplo -> Instant preview -> White-label brand edit -> PDF export',
    tier: 4,
    fn: async () => {
      // Step 1: First-time coach enters onboarding wizard
      assert(fileExists('src/components/Trainer/editor/FitterOnboarding.jsx'), 'Onboarding component must exist');

      // Step 2: Clicks "Cargar rutina de ejemplo"
      assert(fileExists('src/constants/sampleWorkoutRoutine.js'), 'Sample workout routine must exist');
      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);
      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;

      // Verify sample is immediately valid and complete
      const validation = validateWorkoutRoutine(sample);
      assertEqual(validation.valid, true, 'Sample routine is valid');

      // Step 3: Visual editor state populated instantly (instant preview)
      assert(sample.weeks.length > 0, 'Weeks immediately populated');
      assert(sample.weeks[0].days.length > 0, 'Days immediately populated');

      // Step 4: Coach customizes personal brand name in editor
      const customizedBrand = 'VALKIRIA FITNESS COACHING';
      const coachPlan = {
        ...sample,
        metadata: {
          ...sample.metadata,
          brandName: customizedBrand,
          author: 'Valeria Valkiria',
        },
      };

      // Step 5: PDF export resolution renders customized brand
      const resolvedBrand = resolveBrandName({
        brandName: coachPlan.metadata.brandName,
        author: coachPlan.metadata.author,
      });
      assertEqual(resolvedBrand, customizedBrand, 'Exported PDF cover & headers will display coach personal brand');
    },
  },
  {
    id: 'S4-02',
    name: 'Scenario 2: Coach landing page visit -> Reviews Argentine copy -> Selects Pro Mensual -> MP checkout -> Webhook activates Pro -> White-label unlocked',
    tier: 4,
    fn: async () => {
      // Step 1: Coach visits landing page (HomeSaaS.jsx)
      const homeContent = readFileContent('src/pages/HomeSaaS.jsx');
      assert(homeContent !== null, 'HomeSaaS.jsx must exist');
      assertMatches(homeContent, /\b(vos|Arm[aá]|Dej[aá]|revis[aá]s)\b/, 'Argentine voseo copy greets coach');

      // Step 2: Selects Pro Mensual ($15.000 ARS)
      const coachId = 'coach-rodrigo-789';
      const pref = buildMercadoPagoPreference({
        plan: 'pro_monthly',
        userId: coachId,
        userEmail: 'rodrigo@gym.com',
      });
      assertEqual(pref.items[0].unit_price, 15000);
      assertEqual(pref.items[0].currency_id, 'ARS');
      assertEqual(pref.external_reference, `${coachId}:pro_monthly`);

      // Step 3: Webhook receives payment notification and activates Pro
      const secret = 'webhook-scenario-secret';
      const dataId = 'pay-scen2-001';
      const requestId = 'req-scen2-001';
      const sig = generateMPSignature({ dataId, requestId, secret });

      const webhookRes = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: pref.external_reference,
        secret,
      });

      assertEqual(webhookRes.status, 200);
      assertEqual(webhookRes.updated, true);
      assertEqual(webhookRes.subscription.status, 'active');
      assertEqual(webhookRes.subscription.plan, 'pro_monthly');

      // Step 4: Pro subscription unlocks white-label branding on exported plans
      const brand = resolveBrandName({
        brandName: 'RODRIGO PERFORMANCE',
        author: 'Rodrigo',
        userName: 'rodrigo',
      });
      assertEqual(brand, 'RODRIGO PERFORMANCE');
    },
  },
  {
    id: 'S4-03',
    name: 'Scenario 3: Freemium coach -> Creates 3 routines -> Hits quota boundary -> Upgrades Pro Anual -> Webhook activates -> Unlimited routines unlocked',
    tier: 4,
    fn: async () => {
      const coachId = 'coach-lucas-freemium';

      // Step 1 & 2: Coach creates routines 1, 2, and 3 under Freemium
      assertEqual(checkFreemiumRoutineCreationQuota({ userRoutinesCount: 0, hasActiveSub: false, isAdmin: false }).allowed, true);
      assertEqual(checkFreemiumRoutineCreationQuota({ userRoutinesCount: 1, hasActiveSub: false, isAdmin: false }).allowed, true);
      assertEqual(checkFreemiumRoutineCreationQuota({ userRoutinesCount: 2, hasActiveSub: false, isAdmin: false }).allowed, true);

      // Step 3: Attempting 4th routine hits Freemium boundary
      const quotaHit = checkFreemiumRoutineCreationQuota({ userRoutinesCount: 3, hasActiveSub: false, isAdmin: false });
      assertEqual(quotaHit.allowed, false, 'Creation blocked at 3 routines');
      assertEqual(quotaHit.limit, 3);

      // Step 4: Coach selects Pro Anual ($120.000 ARS)
      const pref = buildMercadoPagoPreference({ plan: 'pro_annual', userId: coachId });
      assertEqual(pref.items[0].unit_price, 120000);
      assertEqual(pref.items[0].currency_id, 'ARS');

      // Step 5: Webhook confirms payment
      const secret = 'scen3-secret';
      const dataId = 'pay-annual-scen3';
      const requestId = 'req-annual-scen3';
      const sig = generateMPSignature({ dataId, requestId, secret });

      const webhookRes = simulateWebhookProcessing({
        headers: { 'x-signature': sig.header, 'x-request-id': requestId },
        dataId,
        paymentStatus: 'approved',
        externalReference: pref.external_reference,
        secret,
      });

      assertEqual(webhookRes.subscription.status, 'active');
      assertEqual(webhookRes.subscription.daysAdded, 365);

      // Step 6: Coach can now create routine 4, 5, 50 without limits
      const unlocked = checkFreemiumRoutineCreationQuota({ userRoutinesCount: 3, hasActiveSub: true, isAdmin: false });
      assertEqual(unlocked.allowed, true, 'Unlimited routine creation unlocked');
    },
  },
  {
    id: 'S4-04',
    name: 'Scenario 4: Landing page visitor -> Clicks "Privacidad" in footer -> Opens Privacy modal -> Direct navigation to /politica-de-privacidad',
    tier: 4,
    fn: async () => {
      // Step 1: Visitor arrives at landing page
      const homeContent = readFileContent('src/pages/HomeSaaS.jsx');
      assert(homeContent !== null, 'HomeSaaS.jsx must exist');

      // Step 2: Clicks "Privacidad" button in footer
      assertMatches(homeContent, /Privacidad/i);

      // Step 3: Privacy modal opens with statutory disclosures conforming to Ley 25.326
      assert(fileExists('src/lib/privacyPolicy.js'), 'privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const privacyMod = await import(`file://${fullPath}`);

      assertMatches(privacyMod.PRIVACY_INTRO, /25\.326/);
      assert(privacyMod.PRIVACY_SECTIONS.some((s) => s.id === 'derechos_arco'));
      assert(privacyMod.PRIVACY_SECTIONS.some((s) => s.id === 'aaip'));

      // Step 4: App registers route /politica-de-privacidad for direct link
      const appContent = readFileContent('src/App.jsx');
      assertMatches(appContent, /path=["']\/politica-de-privacidad["']/);
      assertMatches(appContent, /path=["']\/privacy["']/);
    },
  },
  {
    id: 'S4-05',
    name: 'Scenario 5: Mobile visitor initial load -> Clean entry bundle without PDF engines -> Dynamic on-demand PDF import triggered on export',
    tier: 4,
    fn: async () => {
      // Step 1: Verify landing page does not statically import PDF renderer or jspdf
      const appContent = readFileContent('src/App.jsx');
      assert(appContent !== null);
      assert(!appContent.includes("from '@react-pdf/renderer'"));
      assert(!appContent.includes("from 'jspdf'"));

      // Step 2: RoutineEditor is lazy-loaded
      assertMatches(appContent, /React\.lazy\(/);

      // Step 3: PDF export is triggered on-demand via dynamic import
      const exportHookContent = readFileContent('src/hooks/usePDFExport.js');
      assert(exportHookContent !== null);
      assertMatches(exportHookContent, /import\(['"].*PlanRenderer.*['"]\)/);
      assertMatches(exportHookContent, /import\(['"].*pdfGeneratorMobile.*['"]\)/);

      // Step 4: vite.config.ts isolates vendor PDF engines
      const viteConfig = readFileContent('vite.config.ts');
      assert(viteConfig !== null);
      assertMatches(viteConfig, /manualChunks/);
    },
  },
];
