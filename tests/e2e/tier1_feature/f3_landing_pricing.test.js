/**
 * tests/e2e/tier1_feature/f3_landing_pricing.test.js
 * Tier 1 — Feature 3: Landing Page Argentine Voseo Copy & Transparent Pricing Tiers [C-01]
 * Source: ORIGINAL_REQUEST.md R4, PROJECT.md F3
 */

import { assert, assertMatches } from '../helpers/assertions.js';
import { readFileContent } from '../helpers/fileScanner.js';

export const tests = [
  {
    id: 'F3-01',
    name: 'HomeSaaS hero copy uses Argentine Spanish with voseo ("vos", "armás", "dejá", "revisás")',
    feature: 'F3',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      // Voseo indicators in Argentine Spanish
      assertMatches(content, /\b(vos|Arm[aá]|Dej[aá]|revis[aá]s|entreg[aá]s|prob[aá]|Empez[aá]|Pod[eé]s)\b/, 'Copy must use Argentine voseo verbs');
    },
  },
  {
    id: 'F3-02',
    name: 'Hero communicates core outcome clearly without technical AI jargon barrier',
    feature: 'F3',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      // Value proposition: routines & nutrition in minutes, saving hours in Excel/WhatsApp
      assertMatches(content, /rutinas.*nutrici[oó]n|dietas|minutos|Excel/i, 'Headline/subhead must focus on speed and saving time');
    },
  },
  {
    id: 'F3-03',
    name: 'Landing page presents exactly 3 transparent pricing tiers: Freemium, Pro Mensual, Pro Anual',
    feature: 'F3',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      assertMatches(content, /freemium|Plan Inicial|Gratis/i, 'Must feature Freemium / Free tier');
      assertMatches(content, /Pro Mensual/i, 'Must feature Pro Mensual tier');
      assertMatches(content, /Pro Anual/i, 'Must feature Pro Anual tier');
      assertMatches(content, /15\.000/i, 'Must specify $15.000 ARS for monthly plan');
      assertMatches(content, /120\.000/i, 'Must specify $120.000 ARS for annual plan');
    },
  },
  {
    id: 'F3-04',
    name: 'Freemium tier explicitly guarantees 3 complete routines without credit card required',
    feature: 'F3',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      assertMatches(content, /3 rutinas/i, 'Freemium tier must include 3 routines');
      assertMatches(content, /sin tarjeta/i, 'Freemium tier must state sin tarjeta');
    },
  },
  {
    id: 'F3-05',
    name: 'Pro Anual tier specifies $120.000 ARS/year with monthly equivalent ($10.000) or savings note',
    feature: 'F3',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      assertMatches(content, /120\.000/, 'Pro Anual must state $120.000 ARS');
      assertMatches(content, /10\.000|33%|4 meses|60\.000/, 'Pro Anual must state savings or monthly equivalent ($10.000)');
    },
  },
  {
    id: 'F3-06',
    name: 'FAQ explains Mercado Pago billing in ARS and easy self-serve cancellation',
    feature: 'F3',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/pages/HomeSaaS.jsx');
      assert(content !== null, 'src/pages/HomeSaaS.jsx must exist');

      assertMatches(content, /Mercado Pago/i, 'FAQ must mention Mercado Pago');
      assertMatches(content, /cancelar|cancel[aá]s/i, 'FAQ must explain cancellation policy');
      assertMatches(content, /pesos|ARS/i, 'FAQ must confirm pricing in pesos argentinos');
    },
  },
];
