/**
 * tests/e2e/tier1_feature/f2_unverified_claims.test.js
 * Tier 1 — Feature 2: Absence of Unverified Claims [L-01]
 * Source: ORIGINAL_REQUEST.md R1 & AC, PROJECT.md F2
 */

import { assert, assertEqual } from '../helpers/assertions.js';
import { readFileContent, searchOccurrencesInDirectory } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'F2-01',
    name: 'Zero occurrences of "no se guarda nada en servidores" across src/ and docs/',
    feature: 'F2',
    tier: 1,
    fn: async () => {
      const srcOccs = searchOccurrencesInDirectory('src', /no se guarda nada en servidores/i);
      const docsOccs = searchOccurrencesInDirectory('docs', /no se guarda nada en servidores/i);

      const total = srcOccs.length + docsOccs.length;
      assertEqual(
        total,
        0,
        `Found unverified claim "no se guarda nada en servidores" in: ${JSON.stringify(
          [...srcOccs, ...docsOccs].map((o) => o.file)
        )}`
      );
    },
  },
  {
    id: 'F2-02',
    name: 'Zero occurrences of "sin registro requerido" across src/',
    feature: 'F2',
    tier: 1,
    fn: async () => {
      const occs = searchOccurrencesInDirectory('src', /sin registro requerido/i);
      assertEqual(
        occs.length,
        0,
        `Found unverified claim "sin registro requerido" in: ${JSON.stringify(occs.map((o) => o.file))}`
      );
    },
  },
  {
    id: 'F2-03',
    name: 'src/pages/HomeSaaS.jsx contains zero references to "$75.000 ARS" or "$75.000"',
    feature: 'F2',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      const matches = content.match(/75\.000/g) || [];
      assertEqual(
        matches.length,
        0,
        `Found ${matches.length} occurrences of obsolete $75.000 lifetime price in HomeSaaS.jsx`
      );
    },
  },
  {
    id: 'F2-04',
    name: 'src/pages/HomeSaaS.jsx contains zero claims of "pago único de por vida"',
    feature: 'F2',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      const matches = content.match(/pago [uú]nico de por vida|acceso de por vida/gi) || [];
      assertEqual(
        matches.length,
        0,
        `Found ${matches.length} occurrences of "pago único de por vida" in HomeSaaS.jsx`
      );
    },
  },
  {
    id: 'F2-05',
    name: 'Absence of obsolete anti-subscription FAQs in HomeSaaS.jsx',
    feature: 'F2',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      const antiSubMatches = content.match(/Por qu[eé] Mock no cobra suscripci[oó]n/gi) || [];
      assertEqual(
        antiSubMatches.length,
        0,
        `Found obsolete anti-subscription FAQ in HomeSaaS.jsx`
      );
    },
  },
  {
    id: 'F2-06',
    name: 'docs/DESIGN_RATIONALE.md cleaned of "todo local, sin backend" and "Sin registros"',
    feature: 'F2',
    tier: 1,
    fn: async () => {
      const content = readFileContent('docs/DESIGN_RATIONALE.md');
      if (!content) return; // if docs not present, pass

      assert(!/todo local, sin backend/i.test(content), 'DESIGN_RATIONALE must not claim "todo local, sin backend"');
      assert(!/Sin registros\. Sin pagos/i.test(content), 'DESIGN_RATIONALE must not claim "Sin registros. Sin pagos"');
    },
  },
];
