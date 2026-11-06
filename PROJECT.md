# Project: Mock (ex-BaseRutina / GRIND LAB) Production Backlog

## Architecture
Mock is a client-side React 19 + Vite web application with Supabase Postgres backend (Auth, Storage, RLS) and automated Mercado Pago billing infrastructure.
- **Frontend Layer**: React 19, Tailwind CSS, Lucide Icons, React Router v7. Split via `React.lazy` into lazy chunks (`HomeSaaS`, `RoutineEditor`, `CoachDashboard`, `AdminDashboard`, `PrivacyPolicy`).
- **Legal & Privacy Layer**: Statutory privacy disclosures under Argentina Ley 25.326 with central policy text (`src/lib/privacyPolicy.js`), modal dialog (`PrivacyModal.jsx`), and dedicated page route (`/politica-de-privacidad`, `/privacy`).
- **Onboarding & Editor Subsystem**: `FitterOnboarding.jsx` wizard with instant 1-click sample routine ingestion (`src/constants/sampleWorkoutRoutine.js`) into `useRoutineEditor` state, enabling instant visual editing and preview without external LLM calls.
- **PDF Generation Subsystem**: Dual PDF rendering engines:
  - Desktop PDF: `@react-pdf/renderer` (`PlanRenderer.jsx`, `NutritionPlanRenderer.jsx`, `CoverPage.jsx`, `WeekSection.jsx`) featuring prominent white-label coach brand styling on cover pages and running headers.
  - Mobile PDF: `jspdf` (`pdfGeneratorMobile.js`) with responsive white-label formatting.
  - Both engines are dynamically loaded to keep the landing page entry bundle lightweight (< 180 kB).
- **Billing & Subscription Subsystem**:
  - Mercado Pago integration in ARS (Checkout Preferences for $15.000 ARS/mo and $120.000 ARS/yr).
  - Supabase Edge Functions: `create-checkout` and `mercado-pago-webhook`.
  - Webhook security: HMAC-SHA256 signature verification (`x-signature`), live API status lookup, and idempotency tracking via `mp_events`.
  - Database schema (`0010_mercado_pago_billing.sql`) extending subscription plan check constraints and updating RLS for Freemium 3-routine limit.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Ley 25.326 Privacy Policy Route & Modal | Statutory privacy disclosures under Argentina Ley 25.326 accessible from site footer via modal and `/politica-de-privacidad` / `/privacy` route | M1 | ORIGINAL_REQUEST R1 |
| F2 | Zero Unverified Claims | Removal of all unverified claims ("no se guarda nada en servidores", "sin registro requerido", lifetime transfer claims) across landing page and codebase | M1 | ORIGINAL_REQUEST R1 |
| F3 | Transparent Pricing Tiers & Argentine Voseo Copy | Landing page (`HomeSaaS.jsx`) rewrite in Argentine Spanish ("vos"), 5-second value proposition, and 3 clear tiers: Freemium (3 rutinas gratis), Pro Mensual ($15.000 ARS/mes), Pro Anual ($120.000 ARS/año) | M1 | ORIGINAL_REQUEST R4 |
| F4 | Onboarding Sample Routine Button & Instant Preview | "Cargar rutina de ejemplo" button in `FitterOnboarding.jsx` that loads a complete, valid routine into visual editor and enables instant PDF preview without LLM call | M2 | ORIGINAL_REQUEST R2 |
| F5 | White-Label Branding in PDF Exports | Prominent display of coach configured personal brand name on cover pages and running headers in workout and nutrition PDFs | M3 | ORIGINAL_REQUEST R5 |
| F6 | Automated Mercado Pago Billing Infrastructure | Supabase Edge Functions (`create-checkout`, `mercado-pago-webhook`), HMAC signature verification, live API verification, idempotency, and database migration in ARS | M4 | ORIGINAL_REQUEST R3 |
| F7 | Bundle Optimization & Code-Splitting | Code-splitting heavy libraries (`@react-pdf/renderer`, `jspdf`) via `React.lazy()` and dynamic imports, reducing initial bundle from 2.88 MB to < 180 kB | M5 | ORIGINAL_REQUEST R6 |
| F8 | End-to-End Test Suite Verification & Hardening | Complete pass on 100% of E2E opaque-box test suite (Tiers 1-4) and Tier 5 adversarial coverage hardening | M6 | ORIGINAL_REQUEST AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Legal Compliance & Landing Page Transformation | R1, R4: Ley 25.326 Privacy Policy route/modal, unverified claims removal, Argentine voseo copy & 3 pricing tiers in HomeSaaS | none | IN_PROGRESS |
| M2 | Sample Routine Onboarding & Instant Preview | R2: `sampleWorkoutRoutine.js`, "Cargar rutina de ejemplo" in FitterOnboarding, instant preview and editor population | none | IN_PROGRESS |
| M3 | White-Label Branding in PDF Exports | R5: Coach personal brand configuration and prominent cover/header rendering in PlanRenderer, NutritionPlanRenderer, CoverPage, WeekSection, pdfGeneratorMobile | M2 | IN_PROGRESS |
| M4 | Automated Mercado Pago Billing Infrastructure | R3: Supabase Edge Functions (create-checkout, mercado-pago-webhook), migration 0010, subscription checkout in ARS, webhook HMAC & live verification | none | IN_PROGRESS |
| M5 | Bundle Optimization & Code-Splitting | R6: Code-splitting `@react-pdf/renderer` and `jspdf` using React.lazy(), dynamic imports in usePDFExport/planTypes, and Rollup manualChunks | M1, M2, M3 | IN_PROGRESS |
| M6 | Final Milestone: 100% E2E Pass & Coverage Hardening | All features: 100% pass on E2E test suite (Tiers 1-4) and Tier 5 adversarial coverage hardening | M1, M2, M3, M4, M5 | PLANNED |

## Interface Contracts

### M1 (Privacy & Landing) ↔ Application
- Route `/politica-de-privacidad` and `/privacy` in `src/App.jsx` renders `PrivacyPolicy.jsx`.
- Modal `PrivacyModal` imported and toggled in `src/pages/HomeSaaS.jsx` footer.
- Pricing tier IDs exported as `freemium`, `pro_monthly`, `pro_annual`.

### M2 (Sample Routine) ↔ M3 (PDF White-Label) & Editor
- Sample routine exported from `src/constants/sampleWorkoutRoutine.js` matching `docs/CAMPOS_VALIDACION.md`:
  `{ metadata: { title, author, brandName, level, frequency, objective, durationWeeks, ... }, weeks: [...] }`.
- `onImportJSON(sampleRoutine)` immediately populates `useRoutineEditor` state and switches view to `"preview"`.

### M3 (PDF White-Label) ↔ PDF Engines
- `plan.metadata.brandName || plan.metadata.author || "Mock"` resolved across:
  - `src/pdf/sections/CoverPage.jsx`: `<Text style={styles.brandTitle}>{brandName.toUpperCase()}</Text>` above title.
  - `src/pdf/sections/NutritionCoverPage.jsx`: prominent brand display in `headerSection`.
  - `src/pdf/sections/WeekSection.jsx` & `NutritionWeekSection.jsx`: running header `[BrandName] · [Día X] · [Semana Y]`.
  - `src/services/pdfGeneratorMobile.js`: prominent brand banner on cover and page headers.

### M4 (Mercado Pago Billing) ↔ Frontend & Supabase
- Edge Function `create-checkout`:
  - Request: `POST /functions/v1/create-checkout` with `Bearer <JWT>` and body `{ plan: 'pro_monthly' | 'pro_annual' }`.
  - Response: `{ init_point: string, preference_id: string }`.
- Edge Function `mercado-pago-webhook`:
  - Request: `POST /functions/v1/mercado-pago-webhook?data.id=<id>` with headers `x-signature` and `x-request-id`.
  - Logic: Validate HMAC-SHA256 signature -> Idempotency check via `mp_events` -> Query MP API -> Update `subscriptions` and `payments` -> Insert `mp_events` -> Return HTTP 200 `{ received: true }`.
- Database Migration `0010_mercado_pago_billing.sql`:
  - `subscriptions.plan` check constraint includes `('freemium','pro_monthly','pro_annual')`.
  - `routines` RLS insert policy allows coach routine creation if routine count < 3 or active subscription.

### M5 (Bundle Optimization) ↔ Build Pipeline
- `src/App.jsx`: Route-level lazy loading:
  `const RoutineEditor = React.lazy(() => import("./pages/RoutineEditor.jsx"));` wrapped in `<Suspense>`.
- `src/hooks/usePDFExport.js`:
  `const { generateTrainingPlanPDF } = await import("../pdf/PlanRenderer.js");`
- `vite.config.ts`: Rollup manualChunks configuration for `pdf-engine` (`@react-pdf/renderer`) and `jspdf-engine` (`jspdf`).

## Code Layout
- `src/lib/privacyPolicy.js`: Central statutory privacy clauses conforming to Ley 25.326.
- `src/components/Legal/PrivacyContent.jsx`: Reusable privacy policy presentation component.
- `src/components/Legal/PrivacyModal.jsx`: Modal wrapper for privacy policy.
- `src/pages/PrivacyPolicy.jsx`: Standalone route page for privacy policy.
- `src/pages/HomeSaaS.jsx`: High-converting landing page with Argentine voseo copy and 3 transparent pricing cards.
- `src/constants/sampleWorkoutRoutine.js`: Valid sample workout plan conforming to `docs/CAMPOS_VALIDACION.md`.
- `src/components/Trainer/editor/FitterOnboarding.jsx`: Onboarding wizard with sample routine trigger.
- `src/pdf/sections/CoverPage.jsx`: Desktop workout PDF cover page with prominent brand styling.
- `src/pdf/sections/NutritionCoverPage.jsx`: Desktop nutrition PDF cover page with prominent brand styling.
- `src/pdf/sections/WeekSection.jsx`: Desktop workout running header with brand styling.
- `src/pdf/sections/NutritionWeekSection.jsx`: Desktop nutrition running header with brand styling.
- `src/services/pdfGeneratorMobile.js`: Mobile PDF generator with brand styling.
- `supabase/migrations/0010_mercado_pago_billing.sql`: SQL migration for MP plans and RLS Freemium policy.
- `supabase/functions/create-checkout/index.ts`: Edge function to create MP checkout preferences.
- `supabase/functions/mercado-pago-webhook/index.ts`: Edge function for secure webhook handling and idempotency.
- `src/lib/mercadoPago.js`: Frontend helper to trigger checkout flow.
- `tests/e2e/`: Opaque-box E2E test suite (Tiers 1-4 and Tier 5 adversarial tests).
