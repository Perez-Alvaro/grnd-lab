# GRIND LAB — Handoff de Proyecto

> **Propósito de este documento**: Transferir contexto completo a cualquier desarrollador, diseñador, stakeholder o agente de IA que continúe el proyecto. Leé todo antes de tocar el código.

---

## 🏢 Identidad de Negocio

### ¿Qué es GRIND LAB?

**GRIND LAB** es un SaaS B2B para entrenadores personales y coaches de fitness. La propuesta central: un coach gestiona su cartera de **atletas** y, bajo cada uno, crea, edita, guarda y exporta **rutinas de entrenamiento profesionales** con asistencia de IA.

La IA **no está integrada** como API dentro del producto — y eso es una decisión de diseño, no una limitación. El coach genera un **Prompt Maestro** desde la plataforma, lo pega en ChatGPT / Claude / Gemini (herramientas gratuitas), recibe un JSON estructurado y lo importa al editor. Esto elimina el costo de APIs de IA, da control total al usuario, y produce rutinas tan buenas o mejores que cualquier integración directa.

A futuro, el producto incorporará **planes nutricionales con base argentina** (con el mismo flujo Prompt → JSON → Editor).

### Posicionamiento

| Dimensión | Definición |
|-----------|-----------|
| **Mercado** | B2B — coaches / entrenadores personales |
| **Segmento principal** | Entrenadores independientes y pequeños estudios (LATAM, habla hispana) |
| **Diferencial clave** | Editor profesional de rutinas + flujo IA sin costo de API |
| **No es** | Un marketplace B2C, ni una app para atletas finales |
| **Modelo de cobro** | Suscripción mensual del coach (USD) |

### Propuesta de Valor para el Cliente (Coach)

El coach resuelve, con GRIND LAB, los tres dolores más reales de su trabajo diario:

1. **Caos documental eliminado** — Adiós a Excel, notas en el celular y rutinas dispersas en WhatsApp. Cada atleta tiene su ficha, cada ficha tiene sus rutinas, todo en la nube.
2. **Rutinas profesionales en minutos, no en horas** — El Prompt Maestro genera una rutina técnicamente correcta (RIR, tempo, periodización, técnicas avanzadas) en segundos vía IA gratuita. El coach refina en el editor visual.
3. **Exportación PDF con calidad de marca** — El PDF generado tiene el nivel de presentación de una herramienta premium. El atleta recibe algo que percibe como valioso y profesional.

---

## 💰 Modelo de Negocio

### Planes de Suscripción

| Plan | Precio | Perfil de cliente |
|------|--------|-------------------|
| **Starter** | $5 USD/mes | Coach independiente que empieza |
| **Pro** | $10 USD/mes | Coach establecido con cartera activa |
| **Studio** | $15 USD/mes | Estudio o coach con múltiples entrenadores |

### Flujo de Cobro

**Etapa 1 (activa):** Transferencia bancaria con activación manual.
- El coach elige un plan → crea una fila `pending` en `subscriptions`.
- El admin recibe la transferencia y activa la cuenta cambiando `status → active` desde el dashboard de Supabase.
- Sin integración de pagos todavía — diseño deliberado para validar el mercado antes de invertir en infraestructura de cobro.

**Etapa 2 (diferida, infraestructura lista):** MercadoPago Suscripciones.
- Columna `mp_preapproval_id` en `subscriptions` y tabla `mp_events` ya existen en la DB.
- Solo falta cablear las Edge Functions (`create-subscription`, `mp-webhook`, `cancel-subscription`).

### Gate de Acceso

El editor de rutinas solo es accesible si `subscriptions.status IN ('active', 'trialing')`. Una cuenta `pending` ve pantalla de "esperando confirmación". Una cuenta `canceled`/`past_due` ve pantalla de renovación.

---

## 🎨 Identidad Visual

### Filosofía de Diseño

> **"Precision over flash. The design must disappear and let the tool speak."**

La estética de GRIND LAB es **técnica y premium**, inspirada en herramientas como **Linear, Notion y Apple Developer Tools**. El objetivo visual es que el coach sienta que usa algo de nivel enterprise, no una app indie.

### Paleta de Colores (Sistema de Tokens)

Los colores no se usan como valores hex crudos en componentes — todos pasan por CSS variables (tokens) en `src/styles/theme.css`. El sistema soporta dark/light mode con swap en `:root[data-theme]`.

**Estado actual: tema forzado a dark** (la detección de tema del sistema está deshabilitada hasta completar la tokenización del editor).

#### Colores de Marca (Teal/Mint)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-1` / accent dark | `#3e8e8c` | Bordes activos, variante oscura del accent |
| `--color-2` / accent base | `#5bb3a0` | **Color accent principal** — botones CTA, highlights |
| `--color-3` / accent mid | `#7bd5b9` | Hover states, íconos activos |
| `--color-4` / accent light | `#a5e3d6` | Fondos de badges, señales de estado suaves |
| `--color-5` / accent subtle | `#cff7f1` | Fondos sutiles, glassmorphism elements |

#### Neutros de Fondo

| Token | Hex | Uso |
|-------|-----|-----|
| `neutral-950` | `#0B0B0F` | Fondo base — profundidad técnica |
| `neutral-900` | `#141419` | Superficies elevadas (cards) |
| `neutral-800` | `#1A1A20` | Superficies alternativas |
| `neutral-700` | `#2A2A35` | Bordes default |
| `neutral-600` | `#35354A` | Bordes enfatizados |

#### Estados del Sistema

| Color | Hex | Uso |
|-------|-----|-----|
| Success | `#10b981` | Confirmaciones, rutina guardada |
| Warning | `#f59e0b` | Alertas, suscripción próxima a vencer |
| Error | `#ef4444` | Errores, validación fallida |
| Info | `#3b82f6` | Tips, mensajes informativos |

### Tipografía

| Fuente | Rol | Uso |
|--------|-----|-----|
| **Hanken Grotesk** | UI principal y display | Todos los textos, headings |
| **JetBrains Mono** | Técnico / código | JSON editor, valores técnicos, hints |

**Escala de pesos**: 400 (body) → 500 (medium) → 600 (semibold) → 700 (bold). No se mezclan más de 3 pesos en una vista.

**Jerarquía de texto**:
- `text-primary` — Titulares, CTAs (blanco puro)
- `text-secondary` — Texto de soporte y descripciones (gris claro)
- `text-tertiary` — Labels, metadata (gris medio)
- `text-quaternary` — Placeholders, disabled (gris apagado)

### Espaciado y Ritmo

Escala basada en 4px. Los breakpoints de secciones mayores usan `py-24` (96px) en mobile y `py-32` (128px) en desktop. Espaciado interno de cards: `gap-6` (24px).

### Bordes y Radio

Escala intencional y reducida: `xs=2px`, `sm=4px`, `default=6px`, `lg=10px`. Las clases `xl`, `2xl`, `3xl`, `4xl` degradan a `10px` para mantener el look técnico (sin roundness excesiva). Solo badges y pills usan `full` (9999px).

### Sombras con Accent

El sistema define sombras temáticas que usan el accent (`rgba(91, 179, 160, …)`):
- `shadow-glow` / `shadow-glow-lg` — para elementos activos e interactivos
- `shadow-md-accent`, `shadow-lg-accent`, `shadow-xl-accent` — profundidad con tinte de marca

### Animaciones y Micro-interacciones

| Propiedad | Valor | Principio |
|-----------|-------|-----------|
| Duración | 200–300ms | Responsive, no performativa |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` | Apple-style, natural |
| Movimiento | `translateY(8px)` máximo | Sutil, no distractor |
| Animaciones definidas | `fade-in`, `fade-in-up`, `slide-up`, `slide-down`, `subtle-glow` | |

**Regla de oro**: las animaciones son reacciones naturales, no performances. Si se siente como marketing, se simplifica.

### Anti-patterns Documentados

❌ Gradientes radiales agresivos  
❌ Efectos neon estilo gaming  
❌ Múltiples fuentes compitiendo  
❌ Todo en blanco o todo en bold  
❌ Duraciones de animación > 500ms  
❌ Hex crudos en componentes (siempre usar tokens)  

---

## 🔑 Valor Agregado para el Cliente

### El Diferencial Central: IA como Cerebro Externo

```
GRIND LAB (genera Prompt) → IA gratuita (razona y devuelve JSON) → GRIND LAB (edita y exporta)
```

Este modelo da al coach **todo el poder de la IA de última generación sin pagar ninguna API**. Las herramientas gratuitas (ChatGPT, Claude, Gemini) son el motor; GRIND LAB es la interfaz profesional y el editor.

### Comparativa vs. Alternativas del Mercado

| Aspecto | Excel / WhatsApp | APIs de IA directas | GRIND LAB |
|---------|------------------|---------------------|-----------|
| Organización | Caótica, dispersa | Sin estructura | Multi-atleta, cloud |
| Costo de IA | — | $20–100/mes en APIs | $0 (usa IA gratuita) |
| Control del dato | Archivos locales | Black box | JSON editable, exportable |
| Presentación | PDFs genéricos | Sin render | PDF profesional |
| Persistencia | Riesgo de pérdida | — | Cloud con Supabase + RLS |
| Acceso móvil | Parcial | — | Mobile-first (375px→) |

### Outcomes Tangibles para el Coach

1. **Ahorro de tiempo**: Rutinas que antes tomaban 1–2 horas se generan y refinan en 10–15 minutos.
2. **Escalabilidad de cartera**: Puede gestionar más atletas sin perder calidad ni organización.
3. **Imagen profesional**: El PDF exportado refuerza el valor percibido del servicio. Atletas que reciben un documento de calidad pagan más y retienen más.
4. **Tranquilidad con los datos**: Cada rutina vive en la nube, aislada por coach (RLS), sin riesgo de pérdida por falla de dispositivo.
5. **Cero lock-in**: El JSON de cada rutina es portable. El coach puede exportarlo, versionarlo, usarlo fuera de GRIND LAB si lo necesita.

### El Prompt Maestro como Ventaja Competitiva

El Prompt Maestro no es un prompt genérico — es un documento de ~250 líneas que incluye:
- Contexto completo del atleta (género, objetivo, nivel, equipamiento)
- Estructura JSON exacta que debe devolver la IA
- Reglas de generación por objetivo (volumen / fuerza / pérdida de grasa)
- Técnicas avanzadas (FST-7, Drop Sets, Rest-Pause, etc.)
- Validaciones para evitar outputs inválidos

El resultado: la IA produce rutinas técnicamente correctas, no outputs genéricos.

### El Editor como Herramienta de Criterio

El flujo `FitterOnboarding` (conversacional, con chips que auto-avanzan) lleva al coach paso a paso por la configuración del atleta. Una vez generada la rutina, el editor provee:
- Vista formulario (semanas → días → ejercicios con steppers +/−)
- Vista JSON para edición técnica directa
- Preview en vivo de la rutina
- Exportación PDF (dual engine: `@react-pdf/renderer` en desktop, `jsPDF` en mobile)

---

## 🏗️ Arquitectura del Sistema

### Stack Técnico

| Capa | Tecnología | Decisión |
|------|-----------|---------|
| Frontend | React 18 + Vite 5 + React Router 7 | SPA, sin SSR por ahora |
| Estilos | Tailwind CSS 3.4 + tokens CSS custom | No usar TailwindUI ni componentes externos |
| Backend | **Supabase** (Auth + Postgres + Edge Functions) | Sin servidor propio que mantener |
| PDF | `@react-pdf/renderer` (desktop) + `jsPDF` (mobile) | Dual engine por compatibilidad |
| Animación | framer-motion, gsap (DotGrid hero) | Solo en landing; editor usa CSS |
| Emails | Resend (sandbox — pendiente de dominio) | Cableado listo, solo falta DNS |

### Estructura de Datos

```
auth.users (Supabase Auth)
   │ 1:1 trigger handle_new_user
   ▼
profiles(id, name, role)          role ∈ {coach, admin}
   │
   ├──< subscriptions(user_id, plan, status, mp_preapproval_id, current_period_end)
   ├──< athletes(coach_id, name, email, goal, level, notes)
   │        │
   │        └──< routines(athlete_id)
   └──< routines(user_id, title, data jsonb, athlete_id)

mp_events(id)                     # idempotencia webhook MP (reservado)
```

### Seguridad

- **RLS (Row Level Security)** en todas las tablas — el cliente nunca puede leer datos de otro coach.
- El navegador solo recibe la **anon key** de Supabase (pública). Ningún secreto en el bundle.
- Los secretos (`service_role`, `Resend API key`, futuros `MP_ACCESS_TOKEN`) viven en Edge Functions vía `supabase secrets set`.
- Un coach **no puede auto-activar** su suscripción (RLS permite `INSERT` en `pending` pero el `UPDATE` a `active` es solo admin/service_role).
- `is_admin()` es `SECURITY DEFINER` y `STABLE` para evitar recursión en políticas de admin.

### Rutas

| Ruta | Vista | Protección |
|------|-------|-----------|
| `/` | Landing B2B (`HomeSaaS`) | Pública |
| `/dashboard` | `CoachDashboard` (atletas + rutinas) | Sesión activa |
| `/admin` | `AdminDashboard` (coaches, suscripciones) | `role=admin` |
| `<ruta ofuscada>` | `RoutineEditor` | Sesión activa |

La ruta del editor se deriva en runtime desde `routeObfuscator.js` — es cosmética, no seguridad real. La protección real es `ProtectedRoute` + RLS.

---

## 🗺️ Estado Actual y Roadmap

### ✅ Completado

- Auth real con Supabase (login / signup / reset password, roles coach/admin)
- Dashboard del coach: gestión de atletas y rutinas persistidas en cloud
- Dashboard del admin: vista de coaches y suscripciones, activación manual
- Editor de rutinas completo (formulario + JSON + preview)
- Flujo de onboarding IA (`FitterOnboarding`) con chips auto-avanzables
- Export PDF dual engine (desktop y mobile)
- Landing page B2B (`HomeSaaS`) mobile-first con animación `DecryptedText`
- Sistema de temas tokenizado (dark/light) — dark forzado hasta terminar tokenización
- Fotos reales hotlinkeadas desde Pexels (sin API key)

### ⏳ Pendiente Prioritario

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🔴 Alta | Tokenizar editor | `WeekEditor`, `DayEditor`, `PlanMetadataForm`, `RoutinePreview`, `JSONEditor`, modales `Editor/`, `DotGrid` |
| 🔴 Alta | Reactivar detección de tema | 1 línea en `index.html` — bloqueada hasta completar tokenización |
| 🟡 Media | Pantalla self-service suscripción | Fase 3: el coach elige plan y crea `subscriptions.pending` |
| 🟡 Media | Emails transaccionales (Resend) | Fase 5: bienvenida, activación, `past_due` |
| 🟢 Baja | MercadoPago | Fase 4: la infraestructura DB ya está lista; falta Edge Functions |

### ⚠️ Deuda Técnica

| Ítem | Impacto | Solución sugerida |
|------|---------|------------------|
| Bundle ~2.7 MB | Performance (LCP) | `import()` dinámico para PDF/canvas/gsap |
| 0% tests | Confianza en cambios | Vitest (unit) + Playwright (e2e) |
| `HomeSaaS.jsx` monolítico (~1.4k líneas) | Mantenibilidad | Extraer secciones a componentes propios |
| Rotar `service_role` y `RESEND_API_KEY` | Seguridad crítica | Se expusieron en chat en su momento |

---

## 🛠️ Guía de Trabajo para Desarrolladores

### Setup Local

```bash
git clone <repo>
npm install
cp .env.example .env
# Completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev   # http://localhost:5173
```

### Variables de Entorno

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `.env` (cliente) | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `.env` (cliente) | Clave pública (RLS protege) |
| `SUPABASE_SERVICE_ROLE_KEY` | `supabase/functions/.env` | Solo Edge Functions — NUNCA en bundle |
| `RESEND_API_KEY` | `supabase/functions/.env` | Solo Edge Functions |

### Reglas Inquebrantables

1. **Nunca hex crudos en componentes** — usar tokens Tailwind (`bg-accent`, `text-text-primary`, etc.)
2. **Nunca secretos con prefijo `VITE_`** — ese prefijo los mete en el bundle del navegador
3. **El coach no puede activar su propia suscripción** — la RLS lo bloquea deliberadamente
4. **Verificar con `npx vite build` + `npx eslint <archivo>`** — los screenshots dan timeout por el DotGrid
5. **El editor requiere sesión de Supabase real** — no se puede probar en preview; usar `npm run dev` logueado

### Supabase

- **Project ref**: `zxxbfwggfrfsfpmfveyj`
- **URL**: `https://zxxbfwggfrfsfpmfveyj.supabase.co`
- **Cliente**: `src/lib/supabaseClient.js` (solo anon key)
- **Migraciones**: `supabase/migrations/0001_init.sql` y `0002_athletes_admin.sql` (aplicar desde SQL Editor)
- **Para ser admin**: cambiar `role='admin'` en tabla `profiles` para el user correspondiente

### Archivos Clave

| Archivo | Responsabilidad |
|---------|----------------|
| `src/store/authStore.jsx` | Fuente única de sesión (Supabase Auth) |
| `src/styles/theme.css` | Tokens CSS de color (dark y light) |
| `tailwind.config.js` | Extensiones del design system |
| `src/lib/supabaseClient.js` | Cliente Supabase (anon key) |
| `src/lib/athletes.js`, `routines.js`, `admin.js` | CRUD de cada entidad con RLS |
| `src/hooks/useRoutineEditor.js` | Estado central del editor de rutina |
| `src/utils/promptGenerator.js` | Generador del Prompt Maestro |
| `src/pdf/` | Pipeline PDF desktop (shims .js → .jsx reales) |
| `docs/PLAN_LANZAMIENTO.md` | Roadmap por fases — fuente de verdad |

---

## 📌 Decisiones de Diseño Justificadas

| Decisión | Razón |
|----------|-------|
| **IA como cerebro externo (sin API integrada)** | Elimina costo de API (~$20–100/mes), da control total al usuario, y produce resultados igualmente buenos con el Prompt Maestro |
| **Supabase en vez de backend propio** | Auth + Postgres + Edge Functions gestionados, RLS como capa de seguridad, cero servidores que mantener |
| **Transferencia bancaria antes que MercadoPago** | Desbloquea cobro real inmediatamente; el modelo de datos ya deja MP listo sin refactoring |
| **Paleta teal/mint (migrada de morado/rosa)** | El morado era "AI slop" — la paleta teal transmite precisión técnica y diferencia de herramientas de IA genéricas |
| **Tema dark forzado temporalmente** | Evitar bugs visuales con componentes aún no tokenizados; 1 línea para reactivar cuando esté completo |
| **JSON como fuente de verdad de la rutina** | Portable, versionable, editable a mano, exportable fuera del sistema |
| **PDF dual engine** | `@react-pdf/renderer` no funciona en mobile (worker/canvas); `jsPDF` cubre ese gap |
| **Ruta del editor ofuscada** | Solo cosmética (evita URL obvia); la seguridad real es `ProtectedRoute` + RLS — no confundir |

---

## 📞 Recursos

- **Repo**: `grnd-lab` en `C:\Users\perez\VSProyects\SAS PROYECTS\grnd-lab`
- **Supabase**: `https://zxxbfwggfrfsfpmfveyj.supabase.co`
- **Docs internas**: `docs/` — `PLAN_LANZAMIENTO.md`, `DESIGN_SYSTEM.md`, `DESIGN_RATIONALE.md`, `SAAS_LANDING_COPY.md`
- **Skill instalada**: `ui-ux-pro-max` en `.claude/skills/` (mobile-first 375/768/1024, targets ≥44px, tokens semánticos)
- **Fotos**: Pexels hotlink — `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=800`. Verificar que retorne 200 antes de usar.

---

_Última actualización: julio 2026_  
_Estado: MVP funcional — tokenización de editor en progreso, preparación para lanzamiento comercial._
