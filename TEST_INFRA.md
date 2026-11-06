# E2E Test Infra: Mock (GRIND LAB) Production Backlog

## Test Philosophy
- Opaque-box, requirement-driven, derived strictly from `ORIGINAL_REQUEST.md` and user-facing contracts.
- Independent of internal implementation details.
- Progressive testability: Tier 1 tests verify fundamental isolated behaviors before complex cross-feature combinations are evaluated.
- Robustness: Rigorous negative testing ensuring graceful error handling and zero unhandled crashes.

## Feature Inventory & Tier Allocation
| # | Feature | Source (Requirement) | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|----------------------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Ley 25.326 Privacy Policy [L-01] | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 2 | Unverified Claims Removal [L-01] | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 3 | Sample Routine Instant Load [U-01] | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 4 | Mercado Pago Billing & Webhooks [T-01] | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 5 | Landing Page Copy & Pricing Tiers [C-01] | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 6 | White-Label PDF Branding [P-01] | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 7 | Bundle Splitting & Code Optimization [T-02] | ORIGINAL_REQUEST R6 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Node.js automated test runner / Vitest / custom runner executing via `npm test` or `node tests/e2e/runner.js`.
- **Pass / Fail Semantics**: Zero failures (exit code 0).
- **Directory Layout**:
  - `tests/e2e/tier1_feature/`: Individual feature coverage tests (5+ per feature, >= 35 tests).
  - `tests/e2e/tier2_boundary/`: Edge, boundary, and error cases (5+ per feature, >= 35 tests).
  - `tests/e2e/tier3_pairwise/`: Cross-feature combination tests (>= 7 pairwise tests).
  - `tests/e2e/tier4_scenarios/`: Real-world end-to-end coach workflows (>= 5 scenarios).
  - `tests/e2e/tier5_adversarial/`: White-box adversarial hardening tests.
  - `tests/e2e/runner.js`: Test aggregator and reporter.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | First-time coach onboarding -> Cargar rutina de ejemplo -> Instant preview -> White-label brand name edit -> PDF export | F3, F4, F5, F6 | High |
| 2 | Coach visits landing page -> Reviews Argentine copy -> Selects Pro Mensual -> Initiates MP checkout -> Webhook activates Pro -> PDF export unlocks white-label | F1, F2, F5, F6 | High |
| 3 | Coach signs up on Freemium -> Creates 3 routines -> Hits freemium boundary -> Upgrades via MP annual checkout -> Webhook processes approved payment -> Unlimited routines unlocked | F5, F6 | High |
| 4 | Landing page visitor -> Checks footer -> Clicks "Privacidad" -> Opens Privacy modal conforming to Ley 25.326 -> Navigates to `/politica-de-privacidad` directly | F1, F2 | Medium |
| 5 | Mobile visitor initial load -> Verifies initial bundle size (< 180 kB) -> Accesses editor -> On-demand PDF dynamic import triggered | F6, F7 | High |

## Coverage Thresholds
- **Tier 1**: ≥ 35 test cases (≥ 5 per feature)
- **Tier 2**: ≥ 35 test cases (≥ 5 per feature)
- **Tier 3**: ≥ 7 cross-feature combination test cases
- **Tier 4**: ≥ 5 real-world workload scenarios
- **Total Minimum**: ≥ 82 test cases
