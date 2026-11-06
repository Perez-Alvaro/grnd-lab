# E2E Test Suite Ready (TEST_READY.md)

**Publication Date**: 2026-11-06T17:05:00Z  
**Author**: `teamwork_test_writer_e2e`  
**Test Runner**: `node tests/e2e/runner.js`  
**Pass Criteria**: Zero failures (Exit code 0 on full pass, 1 on failures)  
**Total Test Cases Registered**: 92 test cases  

---

## 1. Test Architecture & Runner Command

The test suite is a zero-dependency, ultra-fast, self-contained automated test suite for Node.js (native ES modules).

### How to Run

```bash
# Execute full E2E test suite (Tiers 1 through 4)
node tests/e2e/runner.js

# Execute individual tiers
node tests/e2e/runner.js --tier=1    # Tier 1: Feature Coverage (41 tests)
node tests/e2e/runner.js --tier=2    # Tier 2: Boundary & Corner Cases (38 tests)
node tests/e2e/runner.js --tier=3    # Tier 3: Cross-Feature Combinations (8 tests)
node tests/e2e/runner.js --tier=4    # Tier 4: Real-World Scenarios (5 tests)

# Execute by Feature
node tests/e2e/runner.js --feature=F1  # Ley 25.326 Privacy Policy (12 tests)
node tests/e2e/runner.js --feature=F2  # Removal of Unverified Claims (11 tests)
node tests/e2e/runner.js --feature=F3  # Landing Page Copy & Pricing Tiers (11 tests)
node tests/e2e/runner.js --feature=F4  # Sample Routine & Onboarding (11 tests)
node tests/e2e/runner.js --feature=F5  # White-Label PDF Branding (12 tests)
node tests/e2e/runner.js --feature=F6  # Mercado Pago Billing & Webhooks (12 tests)
node tests/e2e/runner.js --feature=F7  # Bundle Optimization & Splitting (10 tests)

# Extra flags
node tests/e2e/runner.js --verbose   # Detailed failure stacks
node tests/e2e/runner.js --bail      # Exit immediately on first failure
```

---

## 2. Directory Layout

```
tests/e2e/
├── runner.js                           # Master test aggregator & CLI runner
├── helpers/
│   ├── assertions.js                   # Strict assert, deep equality, regex matchers
│   ├── contracts.js                    # Business logic contracts, schema validators & simulators
│   ├── cryptoUtils.js                  # Mercado Pago HMAC-SHA256 signature generator & validator
│   └── fileScanner.js                  # Static analysis, file reader, import inspector
├── tier1_feature/                      # Individual feature verification (≥ 5 per feature)
│   ├── f1_privacy_policy.test.js       # 7 tests: Ley 25.326, AAIP notice, ARCO response deadlines
│   ├── f2_unverified_claims.test.js    # 6 tests: Zero unverified claims, $75k removal
│   ├── f3_landing_pricing.test.js      # 6 tests: Argentine voseo, 3 pricing tiers ($0, $15k, $120k)
│   ├── f4_sample_routine.test.js       # 5 tests: CAMPOS_VALIDACION schema, instant load, no LLM call
│   ├── f5_whitelabel_pdf.test.js       # 6 tests: Precedence contract, covers and running headers
│   ├── f6_mercadopago_billing.test.js  # 6 tests: Preference ARS, HMAC signature, idempotency, RLS
│   └── f7_bundle_splitting.test.js     # 5 tests: React.lazy(), dynamic imports, manualChunks
├── tier2_boundary/                     # Edge cases, boundaries & negative tests (≥ 5 per feature)
│   ├── b1_privacy_boundary.test.js     # 5 tests: ARCO statutory deadlines, ISO versions, modal dismissal
│   ├── b2_claims_boundary.test.js      # 5 tests: Case permutation sweeps, numeric pricing sweeps
│   ├── b3_pricing_boundary.test.js     # 5 tests: 33% discount mathematical proof, unknown plan rejection
│   ├── b4_routine_boundary.test.js     # 6 tests: Forbidden fields (cadencia, duration), negative numbers
│   ├── b5_whitelabel_boundary.test.js  # 6 tests: Whitespace trimming, null fallbacks, special chars
│   ├── b6_billing_boundary.test.js     # 6 tests: Signature tampering, replay attacks, unapproved status
│   └── b7_bundle_boundary.test.js      # 5 tests: Static import leak check, Suspense fallbacks
├── tier3_pairwise/                     # Cross-feature combinations (≥ 7 tests)
│   └── p1_pairwise_flows.test.js       # 8 pairwise tests: F4+F5, F6+F5, F3+F6, F1+F3, F4+F7, F1+F2, F5+F7
└── tier4_scenarios/                    # Real-world end-to-end workflows (≥ 5 tests)
    └── s1_realworld_scenarios.test.js  # 5 comprehensive application scenarios from TEST_INFRA.md
```

---

## 3. Tier Coverage & Threshold Compliance

| Tier | Category | Required Min | Implemented | Status | Features Tested |
|:---:|---|:---:|:---:|:---:|---|
| **Tier 1** | Feature Coverage | ≥ 35 | **41** | ✅ EXCEEDS | F1, F2, F3, F4, F5, F6, F7 (≥ 5 per feature) |
| **Tier 2** | Boundary & Corner Cases | ≥ 35 | **38** | ✅ EXCEEDS | Edge cases, malformed payloads, replay attacks, boundaries |
| **Tier 3** | Cross-Feature Combinations | ≥ 7 | **8** | ✅ EXCEEDS | Multi-feature integration contracts & flows |
| **Tier 4** | Real-World Workload Scenarios | ≥ 5 | **5** | ✅ MEETS | Scenarios 1-5 from TEST_INFRA.md |
| **Total** | Full Suite | ≥ 82 | **92** | ✅ EXCEEDS | Complete coverage of R1–R6 requirements |

---

## 4. Current Baseline Test Execution Status

### Test Run Summary (Executed on Current Repo State)
- **Total Tests Executed**: 92
- **Passed**: 81 (88.0%)
- **Failed**: 11 (12.0%)
- **Execution Duration**: ~0.50 seconds

### Milestone Breakdown
- **Milestone 1 (Legal, Privacy & Landing Transformation)**:
  - F1 (Ley 25.326 Privacy Policy): **12 / 12 PASS (100%)**
  - F2 (Claims Removal): **11 / 11 PASS (100%)**
  - F3 (Argentine Voseo & 3 Pricing Tiers): **11 / 11 PASS (100%)**
- **Milestone 2 (Sample Routine & Onboarding)**:
  - F4 (Sample Routine Ingestion & Schema): **11 / 11 PASS (100%)**
- **Milestone 4 (Mercado Pago Billing Infrastructure)**:
  - F6 (MP Checkout, Webhook HMAC & Idempotency): **12 / 12 PASS (100%)**
- **Tier 3 (Cross-Feature Combinations)**:
  - Pairwise flows P1–P8: **8 / 8 PASS (100%)**
- **Pending Milestones (Planned in Execution Track)**:
  - Milestone 3 (White-Label PDF Branding): 2 pending tests (`F5-02`, `F5-04` covering `CoverPage.jsx` and `WeekSection.jsx` workout day headers).
  - Milestone 5 (Bundle Optimization & Splitting): 8 pending tests (`F7-01`..`F7-05`, `B7-03`..`B7-05`, `S4-05` covering `React.lazy` in `App.jsx`, dynamic imports in `usePDFExport.js`, `planTypes.js`, and `vite.config.ts` manualChunks).

---

## 5. Next Steps for Orchestrator & Milestone 6

1. Execute **Milestone 3** (`worker_m3`): implement white-label coach brand name on `CoverPage.jsx` and `WeekSection.jsx`.
2. Execute **Milestone 5** (`worker_m5`): implement `React.lazy()`, dynamic PDF imports, and `manualChunks` in `vite.config.ts`.
3. In **Milestone 6** (Final Verification & Hardening):
   - Run `node tests/e2e/runner.js`.
   - Verify **100% pass (92 / 92)** with exit code 0.
