/**
 * tests/e2e/tier2_boundary/b1_privacy_boundary.test.js
 * Tier 2 — Boundary & Corner Cases: Privacy Policy [L-01]
 */

import { assert, assertMatches } from '../helpers/assertions.js';
import { fileExists, readFileContent, resolveProjectPath } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'B1-01',
    name: 'Every privacy policy section has valid unique ID, non-empty title, body, and legal base',
    feature: 'F1',
    tier: 2,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      const seenIds = new Set();
      for (const section of mod.PRIVACY_SECTIONS) {
        assert(section.id && typeof section.id === 'string', 'Section ID must be non-empty string');
        assert(!seenIds.has(section.id), `Duplicate section ID found: ${section.id}`);
        seenIds.add(section.id);

        assert(section.titulo.trim().length >= 5, `Section ${section.id} title is too short`);
        assert(section.cuerpo.trim().length >= 30, `Section ${section.id} body is too short`);
        assert(section.base.trim().length >= 4, `Section ${section.id} legal base is too short`);
      }
    },
  },
  {
    id: 'B1-02',
    name: 'ARCO statutory response timeframe boundary: ≤ 10 calendar days for access, ≤ 5 business days for rectification',
    feature: 'F1',
    tier: 2,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      const arco = mod.PRIVACY_SECTIONS.find((s) => s.id === 'derechos_arco');
      assert(arco !== undefined, 'derechos_arco section must exist');

      // Verify exact statutory limits are stated
      assertMatches(arco.cuerpo, /diez\s*\(\s*10\s*\)\s*d[ií]as/i, 'Must state 10 calendar days for access');
      assertMatches(arco.cuerpo, /cinco\s*\(\s*5\s*\)\s*d[ií]as\s*h[aá]biles/i, 'Must state 5 business days for rectification');

      // Boundary: must not promise longer than statutory limit of 10 days for access (e.g. 15, 20, 30 days)
      assert(!/acceso.*(?:1[1-9]|[2-9]\d)\s*d[ií]as/i.test(arco.cuerpo), 'Access deadline cannot exceed 10 days');
      // Boundary: must not promise longer than statutory limit of 5 business days for rectification
      assert(!/rectificaci[oó]n.*[6-9]\s*d[ií]as/i.test(arco.cuerpo), 'Rectification deadline cannot exceed 5 business days');
    },
  },
  {
    id: 'B1-03',
    name: 'AAIP section boundary: contains both physical CABA postal seat and https URL',
    feature: 'F1',
    tier: 2,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      const aaip = mod.PRIVACY_SECTIONS.find((s) => s.id === 'aaip');
      assert(aaip !== undefined, 'aaip section must exist');

      assertMatches(aaip.cuerpo, /https:\/\/www\.argentina\.gob\.ar\/aaip/i, 'Must contain full official HTTPS URL');
      assertMatches(aaip.cuerpo, /710/i, 'Must contain street number 710 for AAIP headquarters');
    },
  },
  {
    id: 'B1-04',
    name: 'PRIVACY_VERSION follows ISO date format YYYY-MM-DD or semantic versioning',
    feature: 'F1',
    tier: 2,
    fn: async () => {
      assert(fileExists('src/lib/privacyPolicy.js'), 'src/lib/privacyPolicy.js must exist');
      const fullPath = resolveProjectPath('src/lib/privacyPolicy.js');
      const mod = await import(`file://${fullPath}`);

      assertMatches(
        mod.PRIVACY_VERSION,
        /^\d{4}-\d{2}-\d{2}$|^\d+\.\d+\.\d+$/,
        'PRIVACY_VERSION must be in YYYY-MM-DD or semver format'
      );
    },
  },
  {
    id: 'B1-05',
    name: 'PrivacyModal and PrivacyContent component files exist with proper export declarations',
    feature: 'F1',
    tier: 2,
    fn: async () => {
      assert(fileExists('src/components/Legal/PrivacyContent.jsx'), 'PrivacyContent.jsx must exist');
      assert(fileExists('src/components/Legal/PrivacyModal.jsx'), 'PrivacyModal.jsx must exist');
      assert(fileExists('src/pages/PrivacyPolicy.jsx'), 'PrivacyPolicy.jsx must exist');

      const modalContent = readFileContent('src/components/Legal/PrivacyModal.jsx');
      assertMatches(modalContent, /open.*onClose/s, 'PrivacyModal must accept open and onClose props');
    },
  },
];
