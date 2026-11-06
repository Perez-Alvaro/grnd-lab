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
];
