/**
 * tests/e2e/tier2_boundary/b3_pricing_boundary.test.js
 * Tier 2 — Boundary & Corner Cases: Pricing Tiers & Mathematical Proofs [C-01]
 */

import { assert, assertEqual, assertThrows } from '../helpers/assertions.js';
import { calculatePricingSavings, buildMercadoPagoPreference } from '../helpers/contracts.js';
import { readFileContent } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'B3-01',
    name: 'Mathematical proof: Pro Anual discount equals exactly $60.000 ARS savings (33% OFF / 4 months free)',
    feature: 'F3',
    tier: 2,
    fn: async () => {
      const calc = calculatePricingSavings(15000, 120000);
      assertEqual(calc.fullAnnualCost, 180000, '12 months @ $15.000 = $180.000');
      assertEqual(calc.savingsARS, 60000, 'Savings must be $60.000 ARS');
      assertEqual(calc.discountPercent, 33, 'Discount percentage must be 33%');
      assertEqual(calc.freeMonthsEquivalent, 4, 'Savings equivalent to 4 free months');
      assertEqual(calc.monthlyEquivalent, 10000, 'Monthly equivalent must be $10.000 ARS');
    },
  },
  {
    id: 'B3-02',
    name: 'Invalid tier ID rejection in Mercado Pago preference builder',
    feature: 'F3',
    tier: 2,
    fn: async () => {
      assertThrows(
        () => buildMercadoPagoPreference({ plan: 'lifetime', userId: 'user-x' }),
        'Should reject legacy plan ID "lifetime"'
      );
      assertThrows(
        () => buildMercadoPagoPreference({ plan: 'starter', userId: 'user-x' }),
        'Should reject legacy plan ID "starter"'
      );
      assertThrows(
        () => buildMercadoPagoPreference({ plan: 'unknown_plan', userId: 'user-x' }),
        'Should reject unknown plan ID'
      );
    },
  },
  {
    id: 'B3-03',
    name: 'Currency formatting in HomeSaaS.jsx includes Argentine dot separators ($15.000, $120.000)',
    feature: 'F3',
    tier: 2,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      assert(/\$15\.000/.test(content), 'Must format $15.000 with Argentine dot separator');
      assert(/\$120\.000/.test(content), 'Must format $120.000 with Argentine dot separator');
    },
  },
  {
    id: 'B3-04',
    name: 'Preference builder throws on missing or null user ID',
    feature: 'F3',
    tier: 2,
    fn: async () => {
      assertThrows(
        () => buildMercadoPagoPreference({ plan: 'pro_monthly', userId: null }),
        'Must throw error when userId is null'
      );
      assertThrows(
        () => buildMercadoPagoPreference({ plan: 'pro_monthly', userId: '' }),
        'Must throw error when userId is empty string'
      );
    },
  },
  {
    id: 'B3-05',
    name: 'Pricing cards in HomeSaaS.jsx do not contain undefined or empty feature text',
    feature: 'F3',
    tier: 2,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      // Boundary check: ensure no empty feature string in code
      assert(!/features:\s*\[[^\]]*['"]\s*['"][^\]]*\]/.test(content), 'Pricing features must not contain empty strings');
    },
  },
];
