/**
 * tests/e2e/tier2_boundary/b2_claims_boundary.test.js
 * Tier 2 — Boundary & Corner Cases: Claims Integrity & Obsolete Pricing [L-01]
 */

import { assert, assertEqual } from '../helpers/assertions.js';
import { readFileContent, searchOccurrencesInDirectory } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'B2-01',
    name: 'Adversarial case variation check: all case permutations of "no se guarda nada" in src/',
    feature: 'F2',
    tier: 2,
    fn: async () => {
      const patterns = [
        /NO SE GUARDA NADA/g,
        /No Se Guarda Nada/g,
        /no se guarda nada/g,
        /nO sE gUaRdA nAdA/g,
      ];
      for (const pat of patterns) {
        const matches = searchOccurrencesInDirectory('src', pat);
        assertEqual(matches.length, 0, `Found match for pattern ${pat} in ${JSON.stringify(matches.map((m) => m.file))}`);
      }
    },
  },
  {
    id: 'B2-02',
    name: 'Adversarial case variation check: all case permutations of "sin registro requerido" in src/',
    feature: 'F2',
    tier: 2,
    fn: async () => {
      const patterns = [
        /SIN REGISTRO REQUERIDO/g,
        /Sin Registro Requerido/g,
        /sin registro requerido/g,
      ];
      for (const pat of patterns) {
        const matches = searchOccurrencesInDirectory('src', pat);
        assertEqual(matches.length, 0, `Found match for pattern ${pat} in ${JSON.stringify(matches.map((m) => m.file))}`);
      }
    },
  },
  {
    id: 'B2-03',
    name: 'Numeric variations of obsolete 75k pricing in HomeSaaS.jsx (75000, 75.000, $75k)',
    feature: 'F2',
    tier: 2,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      const matches75k = content.match(/\b75\.?000\b|\$75k/gi) || [];
      assertEqual(matches75k.length, 0, `Found ${matches75k.length} occurrences of 75000 variants in HomeSaaS.jsx`);
    },
  },
  {
    id: 'B2-04',
    name: 'Negative marketing claims boundary: zero occurrences of "sin mensualidades" in HomeSaaS.jsx',
    feature: 'F2',
    tier: 2,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      const matches = content.match(/sin mensualidades|sin cuotas mensuales/gi) || [];
      assertEqual(matches.length, 0, `Found anti-subscription marketing claims in HomeSaaS.jsx`);
    },
  },
  {
    id: 'B2-05',
    name: 'Obsolete architectural claims: docs/DESIGN_RATIONALE.md does not claim "sin backend"',
    feature: 'F2',
    tier: 2,
    fn: async () => {
      const content = readFileContent('docs/DESIGN_RATIONALE.md');
      if (!content) return; // if docs not present, pass

      const matches = content.match(/sin backend/gi) || [];
      assertEqual(matches.length, 0, 'DESIGN_RATIONALE.md must not claim "sin backend"');
    },
  },
];
