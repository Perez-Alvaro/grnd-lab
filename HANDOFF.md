# CONTEXTO DEL PROYECTO — GRIND LAB (handoff)

> Pegá este archivo (o su contenido) al iniciar un chat nuevo para migrar el contexto.
> Sos mi asistente de desarrollo. Continuás un proyecto ya avanzado. Leé todo antes de tocar nada.

## Qué es
**GRIND LAB** (repo `grnd-lab`, en `C:\Users\perez\OneDrive\Escritorio\VS LOCAL\grnd-lab`).
SaaS **B2B** para entrenadores: cada coach gestiona **atletas** y bajo cada uno guarda **rutinas**. La creación de rutinas se apoya en IA externa (ChatGPT/Claude/Gemini) vía un "Prompt Maestro" (no hay API de IA integrada, por diseño). A futuro: **planes nutricionales argentinos** con el mismo flujo.
NO es B2C ni marketplace. Si ves docs viejos que hablan de "Fitter" B2C / venta de rutinas al cliente final, ignoralos (son legacy).

## Stack
React 18 + Vite 5 + React Router 7 + Tailwind 3.4. Backend: **Supabase** (Auth + Postgres + Edge Functions). PDF: `@react-pdf/renderer` (desktop) + `jsPDF` (mobile). framer-motion, gsap, lucide-react. Windows / PowerShell + Git Bash.

## Modelo de negocio
- Suscripción del coach: **Starter $5 / Pro $10 / Studio $15 USD**.
- Pagos etapa 1: **transferencia bancaria** con activación manual (el admin cambia `status` a `active` en el Table Editor de Supabase). Etapa 2: MercadoPago (DIFERIDO — modelo de datos ya lo soporta: `subscriptions.mp_preapproval_id`, tabla `mp_events`).
- Emails: Resend en sandbox hasta comprar dominio (aún sin cablear en Edge Functions).

## Supabase
- Project ref: `zxxbfwggfrfsfpmfveyj` → `https://zxxbfwggfrfsfpmfveyj.supabase.co`
- Cliente en `src/lib/supabaseClient.js` (solo anon key; RLS protege todo).
- Secretos (service_role, Resend key) en `supabase/functions/.env` (GITIGNOREADO, nunca en el bundle). **Pendiente: ROTAR service_role y Resend key** (se pegaron en chat en su momento).
- **Migraciones a aplicar por el usuario** (SQL Editor de Supabase): `supabase/migrations/0001_init.sql` y `0002_athletes_admin.sql`. Tablas: `profiles` (role coach|admin), `subscriptions`, `athletes`, `routines` (data jsonb), `mp_events`. RLS activo + `is_admin()` SECURITY DEFINER. Para ser admin: poner `role='admin'` a tu user en `profiles`.

## Rutas / auth
- `/` HomeSaaS (landing) · `/dashboard` CoachDashboard · `/admin` AdminDashboard (requiredRole admin) · ruta ofuscada = RoutineEditor. Todo protegido con `ProtectedRoute` + sesión real de Supabase (`src/store/authStore.jsx`). Redirect por rol tras login. `LoginModal` con login/signup/reset.
- El auth mock viejo (auth.js, users.db.json, session.js) fue ELIMINADO.

## THEMING (importante)
- Paleta migrada de morado/rosa (era "AI slop") a **teal/mint**. Tokens como canal RGB en `src/styles/theme.css` (`--c-*`: dark en `:root`, light en `:root[data-theme="light"]`); `tailwind.config.js` usa `rgb(var(--c-*) / <alpha-value>)`. `index.html` tiene script no-flash que estampa `data-theme`.
- **El tema está FORZADO a dark por ahora** (ver TODO en index.html). Reactivar detección de sistema = 1 línea, PERO solo cuando TODO el client-side esté tokenizado.
- Regla: nunca hex crudo en componentes; usar tokens (`bg-primary-bg/surface`, `text-text-primary/secondary/tertiary`, `border-border`, `bg-accent text-primary-bg` en botones). Bandas oscuras a propósito (scrim de modal, CTA banner) usan `text-white` explícito.

## Ya hecho (client-side mobile-first + tokenizado)
- **Landing** (`HomeSaaS`): mobile-first, sin slop (saqué métricas inventadas, ticker, secciones redundantes), fotos reales de **Pexels hotlinkeadas** (sin API key: `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=800`) en PainPoints y en sección "Servicios" (rutinas + nutrición argentina "Próximamente"), animación **DecryptedText** en el H1 (`src/components/ui/DecryptedText.jsx`, adaptado sin dep `motion`).
- **Dashboards** Coach/Admin: tokenizados + mobile-first (tabla admin → cards en mobile).
- **Auth/modales** (LoginModal, UserMenu, Button, Tabs, FAQ, Snackbar): tokenizados + override de autofill temático en index.css.
- **Editor** (`RoutineEditor`): mobile-first, 1 columna en mobile con **toggle Editor↔Vista previa** (segmented control lg:hidden), 2 columnas en desktop, `h-dvh`.
- `FitterOnboarding` (flujo IA): conversacional pregunta-por-pregunta con **chips que autoavanzan** + campos de texto; paso final con **botón grande "Pegá lo que te dio la IA"** (lee portapapeles → importa; fallback textarea) y botones que copian el prompt y abren la IA.
- `ExerciseEditor`: Series/Reps con **steppers +/−** (valor editable a mano para rangos "8-12"/"AMRAP"); resto texto. Tokenizado.

## Pendiente
1. **Terminar de tokenizar el editor** (para cerrar el tema claro): `WeekEditor`, `DayEditor`, `PlanMetadataForm`, `RoutinePreview`, `JSONEditor`, modales de `Editor/`, y `DotGrid`. Ojo: `.text-primary`/`.text-secondary` hardcodeados en `index.css` (~L97-112).
2. Reactivar detección de tema del sistema (1 línea en index.html) recién cuando (1) esté completo.
3. Fase 3: pantalla self-service de suscripción por transferencia (crear `subscriptions` en `pending`).
4. Fase 5: emails Resend (bienvenida, "recibimos tu solicitud", "activada").
5. MercadoPago (webhook + create-subscription) — diferido.
6. Deuda: bundle ~2.7MB sin code-splitting (PDF/canvas/gsap eager → `import()` dinámico); sin tests; `HomeSaaS.jsx` monolítico.

## Cómo verificar / trabajar
- Verificar con `npx vite build` + `npx eslint <archivo>`. Los screenshots del preview dan timeout (rAF del DotGrid) → verificar por `read_page`/JS/medidas.
- El editor está detrás del login de Supabase → no se puede montar en el preview sin sesión; se prueba logueado en el dev server (`npm run dev`, puerto 5173).
- El linter reescribe archivos entre ediciones (usar Write/Python para cambios grandes).
- Skill instalada `ui-ux-pro-max` (`.claude/skills/`) para decisiones UI/UX (mobile-first 375/768/1024, targets ≥44px, tokens semánticos, contraste ambos temas).
- Fotos: Pexels hotlink directo; verificar contenido (página del photo) y que cargue (200) antes de usar.
- Memoria persistente en `…\.claude\projects\…\memory\` (`MEMORY.md` + `grindlab-launch-decisions.md` + `grindlab-product-state.md`).


### Paleta de colores 
/* CSS */
.color-1 {
  color: #3e8e8c;
}
.color-2 {
  color: #5bb3a0;
}
.color-3 {
  color: #7bd5b9;
}
.color-4 {
  color: #a5e3d6;
}
.color-5 {
  color: #cff7f1;
}

/* CSS Variables */
:root {
  --color-1: #3e8e8c;
  --color-2: #5bb3a0;
  --color-3: #7bd5b9;
  --color-4: #a5e3d6;
  --color-5: #cff7f1;
}

## Tarea actual / próxima
Seguir tokenizando el resto del editor (`WeekEditor`, `DayEditor`, `PlanMetadataForm`, `RoutinePreview`, `JSONEditor`, modales `Editor/`, `DotGrid`) para cerrar el tema claro. Después reactivar la detección de tema del sistema.

---
_Confirmá que entendiste el contexto y decime qué hago primero._
