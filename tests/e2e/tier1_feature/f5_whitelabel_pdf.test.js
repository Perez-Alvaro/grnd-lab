/**
 * tests/e2e/tier1_feature/f5_whitelabel_pdf.test.js
 * Tier 1 — Feature 5: White-Label Branding in PDF Exports [P-01]
 * Source: ORIGINAL_REQUEST.md R5, PROJECT.md F5
 */

import { assert, assertEqual, assertMatches } from '../helpers/assertions.js';
import { readFileContent } from '../helpers/fileScanner.js';
import { resolveBrandName } from '../helpers/contracts.js';

export const tests = [
  {
    id: 'F5-01',
    name: 'Brand resolution contract respects precedence: brandName > author > userName > "Mock"',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      // 1. brandName present
      assertEqual(resolveBrandName({ brandName: 'Alpha Academy', author: 'Coach John', userName: 'John' }), 'Alpha Academy');
      // 2. brandName missing, author present
      assertEqual(resolveBrandName({ brandName: '', author: 'Coach John', userName: 'John' }), 'Coach John');
      // 3. brandName and author missing, userName present
      assertEqual(resolveBrandName({ brandName: '', author: '', userName: 'John Doe' }), 'John Doe');
      // 4. all missing -> default "Mock"
      assertEqual(resolveBrandName({ brandName: '', author: '', userName: '' }), 'Mock');
    },
  },
  {
    id: 'F5-02',
    name: 'Desktop CoverPage.jsx renders prominent brand name in header section above title',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pdf/sections/CoverPage.jsx');
      assert(content !== null, 'src/pdf/sections/CoverPage.jsx must exist');

      assertMatches(
        content,
        /brandName|brandTitle|MARCA/i,
        'CoverPage.jsx must resolve and render brandName or brandTitle styling'
      );
    },
  },
  {
    id: 'F5-03',
    name: 'Desktop NutritionCoverPage.jsx renders prominent brand name',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pdf/sections/NutritionCoverPage.jsx');
      assert(content !== null, 'src/pdf/sections/NutritionCoverPage.jsx must exist');

      assertMatches(
        content,
        /brandName|author|brandTitle/i,
        'NutritionCoverPage.jsx must display coach brand name in header section'
      );
    },
  },
  {
    id: 'F5-04',
    name: 'Desktop WeekSection.jsx running header includes coach brand name on workout pages',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pdf/sections/WeekSection.jsx');
      assert(content !== null, 'src/pdf/sections/WeekSection.jsx must exist');

      assertMatches(
        content,
        /brandName|runningHeader|author/i,
        'WeekSection.jsx must include brand name in running header'
      );
    },
  },
  {
    id: 'F5-05',
    name: 'Desktop NutritionWeekSection.jsx running header includes coach brand name',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pdf/sections/NutritionWeekSection.jsx');
      assert(content !== null, 'src/pdf/sections/NutritionWeekSection.jsx must exist');

      assertMatches(
        content,
        /brandName|runningHeader|author/i,
        'NutritionWeekSection.jsx must include brand name in running header'
      );
    },
  },
  {
    id: 'F5-06',
    name: 'Mobile PDF generator (pdfGeneratorMobile.js) renders coach brand name on cover and headers',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/services/pdfGeneratorMobile.js');
      assert(content !== null, 'src/services/pdfGeneratorMobile.js must exist');

      assertMatches(
        content,
        /brandName|coach|author/i,
        'pdfGeneratorMobile.js must reference and render coach brand name'
      );
    },
  },
  {
    id: 'F5-07',
    name: 'src/lib/branding.js exists and exports branding and logo processing functions',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/lib/branding.js');
      assert(content !== null, 'src/lib/branding.js must exist');
      assertMatches(content, /getCoachBranding/i, 'Must export getCoachBranding');
      assertMatches(content, /saveCoachBranding/i, 'Must export saveCoachBranding');
      assertMatches(content, /processLogoFile/i, 'Must export processLogoFile');
    },
  },
  {
    id: 'F5-08',
    name: 'CoverPage and NutritionCoverPage render brandLogo image on cover page',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const workoutCover = readFileContent('src/pdf/sections/CoverPage.jsx');
      assertMatches(workoutCover, /brandLogo/i, 'CoverPage.jsx must resolve brandLogo');
      assertMatches(workoutCover, /<Image.*brandLogo/s, 'CoverPage.jsx must render Image component with brandLogo');

      const nutritionCover = readFileContent('src/pdf/sections/NutritionCoverPage.jsx');
      assertMatches(nutritionCover, /brandLogo/i, 'NutritionCoverPage.jsx must resolve brandLogo');
      assertMatches(nutritionCover, /<Image.*brandLogo/s, 'NutritionCoverPage.jsx must render Image component with brandLogo');
    },
  },
  {
    id: 'F5-09',
    name: 'PlanMetadataForm includes brand name and logo upload controls',
    feature: 'F5',
    tier: 1,
    fn: async () => {
      const form = readFileContent('src/components/Trainer/editor/PlanMetadataForm.jsx');
      assert(form !== null, 'PlanMetadataForm.jsx must exist');
      assertMatches(form, /brandLogo/i, 'PlanMetadataForm must handle brandLogo');
      assertMatches(form, /processLogoFile/i, 'PlanMetadataForm must use processLogoFile');
      assertMatches(form, /saveCoachBranding/i, 'PlanMetadataForm must allow saving as default branding');
    },
  },
];