/**
 * tests/e2e/tier1_feature/f1_privacy_policy.test.js
 * Tier 1 — Feature 1: Ley 25.326 Privacy Policy Route & Modal [L-01]
 * Source: ORIGINAL_REQUEST.md R1, PROJECT.md M1
 */

import { assert, assertMatches, assertIncludes } from '../helpers/assertions.js';
import { fileExists, readFileContent, resolveProjectPath } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'F1-01',
    name: 'src/lib/privacyPolicy.js exists and exports central privacy constants',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      const exists = fileExists('src/lib/privacyPolicy.js');
      assert(exists, 'Expected src/lib/privacyPolicy.js to exist');

      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      assert(mod.PRIVACY_VERSION !== undefined, 'Expected PRIVACY_VERSION to be exported');
      assert(typeof mod.PRIVACY_TITLE === 'string', 'Expected PRIVACY_TITLE string export');
      assert(typeof mod.PRIVACY_INTRO === 'string', 'Expected PRIVACY_INTRO string export');
      assert(Array.isArray(mod.PRIVACY_SECTIONS), 'Expected PRIVACY_SECTIONS array export');
    },
  },
  {
    id: 'F1-02',
    name: 'Privacy intro text explicitly references Ley 25.326 and Decreto 1558/2001',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      assertMatches(mod.PRIVACY_INTRO, /25\.326/, 'Intro must cite Ley 25.326');
      assertMatches(mod.PRIVACY_INTRO, /1558\/2001/, 'Intro must cite Decreto Reglamentario 1558/2001');
      assertMatches(mod.PRIVACY_INTRO, /AAIP|Agencia de Acceso a la Informaci[oó]n P[uú]blica/i, 'Intro must cite AAIP');
    },
  },
  {
    id: 'F1-03',
    name: 'Statutory sections cover controller, purpose, athletes, AI, ARCO, AAIP, and security',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      const sectionIds = mod.PRIVACY_SECTIONS.map((s) => s.id);
      const requiredSections = ['responsable', 'finalidad', 'atletas', 'ia', 'derechos_arco', 'aaip', 'seguridad'];

      for (const req of requiredSections) {
        assertIncludes(sectionIds, req, `Missing statutory section: ${req}`);
      }

      // Verify each section has a non-empty title, body, and legal base
      for (const s of mod.PRIVACY_SECTIONS) {
        assert(s.titulo && s.titulo.length > 5, `Section ${s.id} must have a descriptive title`);
        assert(s.cuerpo && s.cuerpo.length > 20, `Section ${s.id} must have descriptive body text`);
        assert(s.base && s.base.length > 3, `Section ${s.id} must have legal basis citation`);
      }
    },
  },
  {
    id: 'F1-04',
    name: 'ARCO rights section states exact statutory response deadlines (10 days access, 5 days rectification)',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      const arco = mod.PRIVACY_SECTIONS.find((s) => s.id === 'derechos_arco');
      assert(arco !== undefined, 'derechos_arco section must exist');

      assertMatches(arco.cuerpo, /10|diez.*d[ií]as/i, 'Must specify 10 days response for right of access');
      assertMatches(arco.cuerpo, /5|cinco.*d[ií]as.*h[aá]biles/i, 'Must specify 5 business days for rectification/suppression');
      assertMatches(arco.base, /14.*15.*16|art/i, 'Must cite articles 14, 15, and 16 of Ley 25.326');
    },
  },
  {
    id: 'F1-05',
    name: 'AAIP section includes mandatory authority notice, seat address, and official URL',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      const aaip = mod.PRIVACY_SECTIONS.find((s) => s.id === 'aaip');
      assert(aaip !== undefined, 'aaip section must exist');

      assertMatches(aaip.cuerpo, /Julio A\.? Roca|CABA|Ciudad Aut[oó]noma/i, 'Must specify AAIP seat address');
      assertMatches(aaip.cuerpo, /argentina\.gob\.ar\/aaip/i, 'Must specify official AAIP web URL');
      assertMatches(aaip.base, /10\/2008|14\/2018/i, 'Must cite Disposición DNPDP 10/2008 or Res AAIP 14/2018');
    },
  },
  {
    id: 'F1-06',
    name: 'src/App.jsx registers routes /politica-de-privacidad and /privacy',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      const appContent = readFileContent('src/App.jsx');
      assert(appContent !== null, 'src/App.jsx must exist');

      assertMatches(appContent, /path=["']\/politica-de-privacidad["']/i, 'App.jsx must declare /politica-de-privacidad route');
      assertMatches(appContent, /path=["']\/privacy["']/i, 'App.jsx must declare /privacy route');
    },
  },
  {
    id: 'F1-07',
    name: 'src/pages/HomeSaaS.jsx footer contains Privacidad button wired to modal/page',
    feature: 'F1',
    tier: 1,
    fn: async () => {
      const homeContent = readFileContent('src/pages/HomeSaaS.jsx');
      assert(homeContent !== null, 'src/pages/HomeSaaS.jsx must exist');

      assertMatches(homeContent, /Privacidad/i, 'HomeSaaS.jsx must contain Privacidad footer button');
      assert(
        !/onClick=\{\(\)\s*=>\s*\{\}\}/.test(homeContent),
        'Footer Privacidad button must NOT be an empty no-op handler'
      );
      assertMatches(homeContent, /PrivacyModal|setPrivacyOpen|politica-de-privacidad/i, 'Privacidad trigger must connect to PrivacyModal or route');
    },
  },
];
