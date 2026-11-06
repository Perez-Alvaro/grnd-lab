/**
 * tests/e2e/tier1_feature/f7_bundle_splitting.test.js
 * Tier 1 — Feature 7: Bundle Optimization & Code-Splitting [T-02]
 * Source: ORIGINAL_REQUEST.md R6, PROJECT.md F7, teamwork_explorer_survey_2/handoff.md
 */

import { assert, assertMatches } from '../helpers/assertions.js';
import { readFileContent, extractStaticImports } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'F7-01',
    name: 'src/App.jsx uses React.lazy() for route-level code-splitting of RoutineEditor',
    feature: 'F7',
    tier: 1,
    fn: async () => {
      const appContent = readFileContent('src/App.jsx');
      assert(appContent !== null, 'src/App.jsx must exist');

      assertMatches(
        appContent,
        /lazy\(\s*\(\)\s*=>\s*import\(['"].*RoutineEditor.*['"]\)\)/,
        'App.jsx must load RoutineEditor using React.lazy()'
      );
      assertMatches(appContent, /Suspense/i, 'App.jsx must wrap lazy routes in Suspense');
    },
  },
  {
    id: 'F7-02',
    name: 'src/hooks/usePDFExport.js dynamically imports PlanRenderer instead of static import',
    feature: 'F7',
    tier: 1,
    fn: async () => {
      const staticImports = extractStaticImports('src/hooks/usePDFExport.js');
      const hasStaticPlanRenderer = staticImports.some((imp) => imp.includes('PlanRenderer'));
      assert(!hasStaticPlanRenderer, 'usePDFExport.js must NOT statically import PlanRenderer');

      const content = readFileContent('src/hooks/usePDFExport.js');
      assert(content !== null, 'src/hooks/usePDFExport.js must exist');
      assertMatches(content, /import\(['"].*PlanRenderer.*['"]\)/, 'usePDFExport.js must dynamically import PlanRenderer');
    },
  },
  {
    id: 'F7-03',
    name: 'src/hooks/usePDFExport.js dynamically imports pdfGeneratorMobile instead of static import',
    feature: 'F7',
    tier: 1,
    fn: async () => {
      const staticImports = extractStaticImports('src/hooks/usePDFExport.js');
      const hasStaticMobile = staticImports.some((imp) => imp.includes('pdfGeneratorMobile'));
      assert(!hasStaticMobile, 'usePDFExport.js must NOT statically import pdfGeneratorMobile');

      const content = readFileContent('src/hooks/usePDFExport.js');
      assert(content !== null, 'src/hooks/usePDFExport.js must exist');
      assertMatches(content, /import\(['"].*pdfGeneratorMobile.*['"]\)/, 'usePDFExport.js must dynamically import pdfGeneratorMobile');
    },
  },
  {
    id: 'F7-04',
    name: 'src/config/planTypes.js uses dynamic import for NutritionPlanRenderer',
    feature: 'F7',
    tier: 1,
    fn: async () => {
      const staticImports = extractStaticImports('src/config/planTypes.js');
      const hasStaticNutrition = staticImports.some((imp) => imp.includes('NutritionPlanRenderer'));
      assert(!hasStaticNutrition, 'planTypes.js must NOT statically import NutritionPlanRenderer');

      const content = readFileContent('src/config/planTypes.js');
      assert(content !== null, 'src/config/planTypes.js must exist');
      assertMatches(content, /import\(['"].*NutritionPlanRenderer.*['"]\)/, 'planTypes.js must dynamically import NutritionPlanRenderer');
    },
  },
  {
    id: 'F7-05',
    name: 'vite.config.ts configures Rollup manualChunks for heavy PDF libraries',
    feature: 'F7',
    tier: 1,
    fn: async () => {
      const viteConfig = readFileContent('vite.config.ts');
      assert(viteConfig !== null, 'vite.config.ts must exist');

      assertMatches(viteConfig, /manualChunks|rollupOptions/i, 'vite.config.ts must declare rollupOptions manualChunks');
      assertMatches(viteConfig, /@react-pdf\/renderer|jspdf/i, 'manualChunks must segregate @react-pdf/renderer and/or jspdf');
    },
  },
];
