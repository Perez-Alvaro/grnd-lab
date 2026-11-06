/**
 * tests/e2e/tier2_boundary/b7_bundle_boundary.test.js
 * Tier 2 — Boundary & Corner Cases: Static Import Leaks & Bundle Boundaries [T-02]
 */

import { assert, assertEqual, assertMatches } from '../helpers/assertions.js';
import { readFileContent, extractStaticImports } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'B7-01',
    name: 'Static import leak check: src/App.jsx contains zero static imports of PDF libraries',
    feature: 'F7',
    tier: 2,
    fn: async () => {
      const staticImports = extractStaticImports('src/App.jsx');
      const leaked = staticImports.filter(
        (imp) => imp.includes('@react-pdf/renderer') || imp.includes('jspdf') || imp.includes('PlanRenderer')
      );
      assertEqual(leaked.length, 0, `Static import leak found in App.jsx: ${JSON.stringify(leaked)}`);
    },
  },
  {
    id: 'B7-02',
    name: 'Static import leak check: src/pages/HomeSaaS.jsx contains zero static imports of PDF libraries',
    feature: 'F7',
    tier: 2,
    fn: async () => {
      const staticImports = extractStaticImports('src/pages/HomeSaaS.jsx');
      const leaked = staticImports.filter(
        (imp) => imp.includes('@react-pdf/renderer') || imp.includes('jspdf') || imp.includes('PlanRenderer')
      );
      assertEqual(leaked.length, 0, `Static import leak found in HomeSaaS.jsx: ${JSON.stringify(leaked)}`);
    },
  },
  {
    id: 'B7-03',
    name: 'Suspense boundary check: src/App.jsx provides fallback spinner for lazy components',
    feature: 'F7',
    tier: 2,
    fn: async () => {
      const content = readFileContent('src/App.jsx');
      assert(content !== null, 'src/App.jsx must exist');

      assertMatches(content, /<Suspense[^>]*fallback=/s, 'App.jsx must configure Suspense fallback');
    },
  },
  {
    id: 'B7-04',
    name: 'Dynamic import syntax in usePDFExport.js uses Promise-based await import()',
    feature: 'F7',
    tier: 2,
    fn: async () => {
      const content = readFileContent('src/hooks/usePDFExport.js');
      assert(content !== null, 'src/hooks/usePDFExport.js must exist');

      assertMatches(
        content,
        /await\s+import\(|import\(.+\)\.then\(/,
        'usePDFExport.js must asynchronously load PDF engines'
      );
    },
  },
  {
    id: 'B7-05',
    name: 'vite.config.ts manualChunks specifically isolates @react-pdf/renderer from main vendor chunk',
    feature: 'F7',
    tier: 2,
    fn: async () => {
      const config = readFileContent('vite.config.ts');
      assert(config !== null, 'vite.config.ts must exist');

      assertMatches(config, /@react-pdf\/renderer/, 'vite.config.ts must configure chunking for @react-pdf/renderer');
    },
  },
];
