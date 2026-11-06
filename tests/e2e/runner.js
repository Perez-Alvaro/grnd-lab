#!/usr/bin/env node
/**
 * tests/e2e/runner.js
 * Master Test Aggregator and Runner for Mock (GRIND LAB) E2E Test Suite.
 * Supports running all tiers (1-4) or filtering by tier/feature.
 *
 * Usage:
 *   node tests/e2e/runner.js
 *   node tests/e2e/runner.js --tier=1
 *   node tests/e2e/runner.js --feature=F1
 *   node tests/e2e/runner.js --verbose
 */

import { performance } from 'node:perf_hooks';

// Tier 1 Suites
import { tests as t1f1 } from './tier1_feature/f1_privacy_policy.test.js';
import { tests as t1f2 } from './tier1_feature/f2_unverified_claims.test.js';
import { tests as t1f3 } from './tier1_feature/f3_landing_pricing.test.js';
import { tests as t1f4 } from './tier1_feature/f4_sample_routine.test.js';
import { tests as t1f5 } from './tier1_feature/f5_whitelabel_pdf.test.js';
import { tests as t1f6 } from './tier1_feature/f6_mercadopago_billing.test.js';
import { tests as t1f7 } from './tier1_feature/f7_bundle_splitting.test.js';

// Tier 2 Suites
import { tests as t2b1 } from './tier2_boundary/b1_privacy_boundary.test.js';
import { tests as t2b2 } from './tier2_boundary/b2_claims_boundary.test.js';
import { tests as t2b3 } from './tier2_boundary/b3_pricing_boundary.test.js';
import { tests as t2b4 } from './tier2_boundary/b4_routine_boundary.test.js';
import { tests as t2b5 } from './tier2_boundary/b5_whitelabel_boundary.test.js';
import { tests as t2b6 } from './tier2_boundary/b6_billing_boundary.test.js';
import { tests as t2b7 } from './tier2_boundary/b7_bundle_boundary.test.js';

// Tier 3 Suites
import { tests as t3p1 } from './tier3_pairwise/p1_pairwise_flows.test.js';

// Tier 4 Suites
import { tests as t4s1 } from './tier4_scenarios/s1_realworld_scenarios.test.js';

const ALL_TESTS = [
  ...t1f1, ...t1f2, ...t1f3, ...t1f4, ...t1f5, ...t1f6, ...t1f7,
  ...t2b1, ...t2b2, ...t2b3, ...t2b4, ...t2b5, ...t2b6, ...t2b7,
  ...t3p1,
  ...t4s1,
];

// CLI Arguments parsing
const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const featureArg = args.find((a) => a.startsWith('--feature='));
const verbose = args.includes('--verbose') || args.includes('-v');
const bail = args.includes('--bail');

const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
const targetFeature = featureArg ? featureArg.split('=')[1].toUpperCase() : null;

// Filter tests
let testsToRun = ALL_TESTS;
if (targetTier !== null) {
  testsToRun = testsToRun.filter((t) => t.tier === targetTier);
}
if (targetFeature !== null) {
  testsToRun = testsToRun.filter((t) => t.feature === targetFeature);
}

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

async function run() {
  const startTime = performance.now();
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}  Mock (GRIND LAB) E2E Test Suite Runner${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`Total tests registered: ${ALL_TESTS.length}`);
  console.log(`Tests selected for run: ${testsToRun.length}`);
  if (targetTier) console.log(`Filter: Tier ${targetTier}`);
  if (targetFeature) console.log(`Filter: Feature ${targetFeature}`);
  console.log('');

  let passed = 0;
  let failed = 0;
  const failureDetails = [];

  let currentTier = null;

  for (const test of testsToRun) {
    if (test.tier !== currentTier) {
      currentTier = test.tier;
      console.log(`\n${colors.bold}${colors.yellow}--- TIER ${currentTier} ---${colors.reset}`);
    }

    const testStart = performance.now();
    try {
      await test.fn();
      const duration = (performance.now() - testStart).toFixed(1);
      passed++;
      console.log(`  ${colors.green}✓${colors.reset} [${test.id}] ${test.name} ${colors.gray}(${duration}ms)${colors.reset}`);
    } catch (err) {
      const duration = (performance.now() - testStart).toFixed(1);
      failed++;
      console.log(`  ${colors.red}✗${colors.reset} [${test.id}] ${test.name} ${colors.gray}(${duration}ms)${colors.reset}`);
      failureDetails.push({
        id: test.id,
        name: test.name,
        feature: test.feature,
        tier: test.tier,
        error: err.message || String(err),
        stack: err.stack,
      });

      if (bail) {
        console.log(`\n${colors.red}Bailing after first failure.${colors.reset}`);
        break;
      }
    }
  }

  const totalDuration = ((performance.now() - startTime) / 1000).toFixed(2);

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}  TEST SUMMARY REPORT${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`Executed:    ${testsToRun.length}`);
  console.log(`Passed:      ${colors.green}${passed}${colors.reset}`);
  console.log(`Failed:      ${failed > 0 ? colors.red + failed + colors.reset : '0'}`);
  console.log(`Pass Rate:   ${((passed / (testsToRun.length || 1)) * 100).toFixed(1)}%`);
  console.log(`Duration:    ${totalDuration}s`);

  if (failureDetails.length > 0) {
    console.log(`\n${colors.bold}${colors.red}FAILURE BREAKDOWN (${failureDetails.length}):${colors.reset}`);
    failureDetails.forEach((f, idx) => {
      console.log(`\n${idx + 1}) [${f.id}] (Tier ${f.tier}${f.feature ? ' / ' + f.feature : ''}): ${f.name}`);
      console.log(`   ${colors.red}${f.error}${colors.reset}`);
      if (verbose && f.stack) {
        console.log(`   ${colors.gray}${f.stack.split('\n').slice(1, 4).join('\n   ')}${colors.reset}`);
      }
    });
  }

  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
