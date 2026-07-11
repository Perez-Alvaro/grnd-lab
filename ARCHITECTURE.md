# 🏗️ GRIND LAB — Arquitectura

Detalle técnico del sistema. Para el panorama general y cómo correrlo, ver
[`README.md`](README.md). Para el roadmap por fases, ver
[`docs/PLAN_LANZAMIENTO.md`](docs/PLAN_LANZAMIENTO.md).

---

## Principios

1. **Multi-tenant con Supabase.** Cada coach ve solo sus datos; la separación la
   garantiza **Row Level Security** en Postgres, no el frontend.
2. **Cero secretos en el cliente.** El navegador usa únicamente la `anon key`
   (pública). Service role / API keys viven en Edge Functions (server-side).
3. **IA como cerebro externo.** La app no llama a ninguna API de IA: genera un
   "Prompt Maestro" que el coach pega en ChatGPT/Claude/Gemini y devuelve JSON.
4. **JSON como fuente de verdad de la rutina.** Portable, versionable, editable a mano.

---

## Modelo de datos y seguridad

```
auth.users (Supabase Auth)
   │ 1:1 (trigger handle_new_user)
   ▼
profiles(id, name, role)            role ∈ {coach, admin}
   │
   ├──< subscriptions(user_id, plan, status, mp_preapproval_id, current_period_end)
   ├──< athletes(coach_id, name, email, goal, level, notes)
   │        │
   │        └──< routines(athlete_id)          # athlete_id nullable
   └──< routines(user_id, title, data jsonb, athlete_id)

mp_events(id)                        # idempotencia webhook MP (reservado)
```

### RLS (resumen)
- `profiles`: `select/update` propio (`auth.uid() = id`). Admin lee todos vía `is_admin()`.
- `subscriptions`: el coach **lee** la suya; puede **insertar** solo en estado
  `pending` (no puede auto-activarse). Solo el **admin** hace `update` (activar).
- `athletes` y `routines`: CRUD completo restringido a `auth.uid() = coach_id/user_id`.
- `mp_events`: sin políticas → solo accesible con service_role.
- `is_admin()` es `SECURITY DEFINER` y `stable`: corre como owner y bypassa RLS, por
  lo que las políticas de admin no generan recursión al consultar `profiles`.

Migraciones: `supabase/migrations/0001_init.sql` (tablas base + auth trigger + RLS)
y `0002_athletes_admin.sql` (athletes + `is_admin()` + políticas de admin).

---

## Autenticación (frontend)

- `src/lib/supabaseClient.js` crea el cliente con `persistSession + autoRefreshToken`.
- `src/store/authStore.jsx` (`AuthProvider` / `useAuth`) es la única fuente de sesión:
  `getSession()` al montar + `onAuthStateChange`. Normaliza el usuario a
  `{ id, email, name, role }` (name/role salen de `profiles`, con fallback a
  `user_metadata`). Expone `login`, `signup`, `resetPassword`, `logout`.
- `src/components/Auth/ProtectedRoute.jsx` gatea por `sessionReady` + `user` y,
  opcionalmente, por `requiredRole`.
- `src/components/Auth/LoginModal.jsx`: modos login / signup / reset. Redirige por rol.

---

## Pipeline de PDF

```
usePDFExport(type)
 ├── 'desktop' → src/pdf/PlanRenderer.js (shim) → PlanRenderer.jsx (@react-pdf/renderer)
 │                └── sections/*.js (shims) → sections/*.jsx (CoverPage, WeekSection, ProgressPage)
 └── 'mobile'  → src/services/pdfGeneratorMobile.js (jsPDF)
```

> Los archivos `.js` dentro de `src/pdf/` son **shims de re-export** (2 líneas) que
> apuntan al `.jsx` real. No son duplicados: la cadena de imports los necesita. No
> borrarlos sin aplanar antes los imports.

---

## Editor de rutina

- `src/hooks/useRoutineEditor.js`: estado central (metadata, semanas, días,
  ejercicios) + CRUD + `loadPlan(json)` + `plan` (JSON actual) + `planForPdf`.
- `src/pages/RoutineEditor.jsx`: UI de 2 paneles (form/JSON | preview). Lee
  `?routineId` (cargar) y `?athleteId` (asociar); botón **Guardar** persiste vía
  `src/lib/routines.js`.
- `src/lib/schemas/routineSchema.js` valida el JSON; `transformers/` convierte entre
  formato de editor y export.

---

## Decisiones clave

- **Supabase en vez de backend propio:** auth + Postgres + storage + edge functions
  gestionados, RLS como capa de seguridad, sin servidor que mantener.
- **Transferencia bancaria antes que MercadoPago:** desbloquea el cobro sin integrar
  pagos; el modelo de datos ya deja MP listo para cuando se implemente.
- **Ruta de editor ofuscada:** solo cosmética; la seguridad real es `ProtectedRoute` + RLS.

---

## Deuda técnica

1. **Bundle ~2.7 MB** sin code-splitting (PDF/canvas/gsap/framer eager) → `import()` dinámico.
2. **Sin tests** (0%). Sugerido Vitest (unit) + Playwright (e2e).
3. **`HomeSaaS.jsx` monolítico** (~1.4k líneas) → dividir en secciones por archivo.
4. **Emails (Resend) y suscripción self-service** aún no implementados (Fases 3 y 5).
