# 🏋️ GRIND LAB

**SaaS B2B para entrenadores.** Un coach gestiona sus atletas y crea, guarda y exporta rutinas de entrenamiento profesionales. La creación de rutinas se apoya en IA externa (ChatGPT/Claude/Gemini) vía un "Prompt Maestro", pero los datos viven en la nube (Supabase) por coach.

> Este README es la fuente de contexto para humanos y agentes de IA. Si vas a
> trabajar en el repo, leelo entero — describe qué ES la app hoy, no lo que fue.

---

## 🎯 Qué es (y qué NO es)

- **Es:** una plataforma multi-tenant donde cada **coach** (rol `coach`) tiene su
  cuenta, sus **atletas**, y las **rutinas** de cada atleta. Hay un **admin** (rol
  `admin`) que gestiona coaches y suscripciones.
- **Modelo de negocio:** suscripción del coach — planes **Starter $5 / Pro $10 /
  Studio $15 USD**. Etapa 1: cobro por **transferencia bancaria** con activación
  manual por el admin. Etapa 2 (diferida): **MercadoPago** (el modelo de datos ya
  lo contempla, ver `subscriptions.mp_preapproval_id` y tabla `mp_events`).
- **NO es** un marketplace B2C ni vende rutinas al cliente final. Documentos viejos
  que hablen de eso ("Fitter", venta directa, etc.) fueron eliminados; si aparece
  alguna referencia, ignorala.

---

## 🧱 Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + React Router 7 |
| Estilos | Tailwind CSS 3 (dark theme, accent lima `#cbff00`) |
| Backend | **Supabase** — Auth + Postgres + (Edge Functions, futuro) |
| PDF | `@react-pdf/renderer` (desktop) y `jsPDF` (mobile) |
| Animación | framer-motion, gsap (DotGrid del hero) |
| Iconos | lucide-react |
| Emails | Resend (sandbox sin dominio; pendiente de cablear en Edge Functions) |

---

## 🚀 Correr en local

```bash
npm install
cp .env.example .env      # completá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev               # http://localhost:5173
npm run build             # build de producción a dist/
npm run lint              # eslint
```

### Variables de entorno
- **Públicas (van al bundle, prefijo `VITE_`):** `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`. Solo claves públicas — la seguridad la aplica RLS.
- **Server-only (NUNCA `VITE_`, NUNCA en el navegador):** `SUPABASE_SERVICE_ROLE_KEY`,
  `RESEND_API_KEY`, y a futuro `MP_ACCESS_TOKEN` / `MP_WEBHOOK_SECRET`. Viven en
  `supabase/functions/.env` (gitignoreado) y en `supabase secrets` para producción.

---

## 🗄️ Base de datos (Supabase)

Migraciones en [`supabase/migrations/`](supabase/migrations/). Aplicarlas desde el
**SQL Editor** de Supabase (o `supabase db push`).

| Tabla | Descripción | Dueño (RLS) |
|-------|-------------|-------------|
| `profiles` | Extiende `auth.users`. Campos: `name`, `role` (`coach`\|`admin`). Se crea sola al registrarse (trigger). | cada uno el suyo; el admin lee todos |
| `subscriptions` | Suscripción del coach: `plan`, `status`, `payment_method`, `mp_preapproval_id`, `current_period_end`. | coach lee la suya; solo admin activa/edita |
| `athletes` | Atletas del coach: `name`, `email`, `goal`, `level`, `notes`. | cada coach los suyos |
| `routines` | Rutina guardada: `title`, `data` (JSON completo del editor), `athlete_id`. | cada coach las suyas |
| `mp_events` | Idempotencia de webhooks MercadoPago (reservado, MP diferido). | solo service_role |

**Seguridad:** RLS activo en todas. El cliente usa solo la **anon key**; nunca hay
secretos en el bundle. La función `is_admin()` (SECURITY DEFINER) habilita las
políticas del admin sin recursión.

---

## 🧭 Rutas (`src/App.jsx`)

| Ruta | Página | Protección |
|------|--------|-----------|
| `/` | `HomeSaaS` — landing B2B | pública |
| `/dashboard` | `CoachDashboard` — atletas + rutinas | requiere sesión |
| `/admin` | `AdminDashboard` — coaches, suscripciones, métricas | requiere `role=admin` |
| `<ruta ofuscada>` | `RoutineEditor` — editor de rutina | requiere sesión |
| `*` | redirige a `HomeSaaS` | — |

La ruta del editor se deriva en runtime desde `src/lib/routeObfuscator.js` (NO es una
medida de seguridad real, solo evita una URL obvia; la seguridad la da `ProtectedRoute`
+ RLS). Tras el login, el redirect es por rol (`/admin` o `/dashboard`).

---

## 🔄 Flujo principal

1. El coach se registra / inicia sesión (`LoginModal` → Supabase Auth, ver `authStore.jsx`).
2. En `/dashboard` crea **atletas** y, dentro de cada uno, **rutinas**.
3. "Nueva rutina" abre el editor con `?athleteId=`. El editor genera un **Prompt
   Maestro** (`utils/promptGenerator.js`) que el coach pega en una IA gratuita; la IA
   devuelve un JSON que se importa y edita en vivo. También hay modo formulario manual.
4. **Guardar** persiste el JSON en `routines` (`lib/routines.js`). Abrir una rutina
   existente usa `?routineId=`.
5. **Exportar PDF** (`hooks/usePDFExport.js` → `src/pdf/` para desktop,
   `src/services/pdfGeneratorMobile.js` para mobile).

---

## 📂 Estructura

```
src/
├── App.jsx / main.jsx          # entry + routing
├── lib/
│   ├── supabaseClient.js       # cliente Supabase (anon key)
│   ├── athletes.js routines.js admin.js   # capa de acceso a datos (CRUD + RLS)
│   ├── routeObfuscator.js      # deriva la ruta del editor
│   └── schemas/ transformers/  # validación y transformación del JSON de rutina
├── store/authStore.jsx         # AuthProvider (Supabase Auth) + useAuth()
├── components/
│   ├── Auth/                   # ProtectedRoute, LoginModal
│   ├── navbar/UserMenu.jsx
│   ├── Editor/                 # JSON editor, import/export modals
│   ├── Trainer/                # form editor (metadata/semanas/días/ejercicios) + preview
│   ├── Tutorial/               # onboarding
│   └── ui/                     # design system (Button, Input, Modal, …) — barrel en index.js
├── pages/
│   ├── HomeSaaS.jsx            # landing (monolítica por diseño)
│   ├── CoachDashboard.jsx AdminDashboard.jsx
│   └── RoutineEditor.jsx
├── hooks/useRoutineEditor.js   # estado central del editor de rutina
├── pdf/                        # generación PDF desktop (@react-pdf/renderer)
│   └── *.js son shims que re-exportan los *.jsx reales (no borrar los .js)
├── services/pdfGeneratorMobile.js  # PDF mobile (jsPDF)
├── constants/ context/ utils/ styles/
supabase/migrations/            # 0001_init, 0002_athletes_admin
docs/PLAN_LANZAMIENTO.md        # plan de fases hacia el lanzamiento (fuente de verdad del roadmap)
```

---

## 🚧 Estado actual y deuda técnica

- ✅ Auth real (Supabase), roles, RLS.
- ✅ Dashboards de coach y admin; atletas; persistencia de rutinas en la nube.
- ⏳ Suscripción self-service por transferencia (Fase 3) y emails Resend (Fase 5) — pendientes.
- ⏳ MercadoPago — diferido.
- ⚠️ Bundle grande (~2.7 MB) sin code-splitting: `@react-pdf/renderer`, `html2canvas`,
  `jspdf`, `gsap`, `framer-motion` se cargan eager. Candidato a `import()` dinámico.
- ⚠️ Sin tests (coverage 0%). Recomendado: Vitest + Playwright.
- ⚠️ `HomeSaaS.jsx` es monolítico (~1.4k líneas).

Ver [`docs/PLAN_LANZAMIENTO.md`](docs/PLAN_LANZAMIENTO.md) para el plan completo por fases
y [`ARCHITECTURE.md`](ARCHITECTURE.md) para el detalle técnico.
