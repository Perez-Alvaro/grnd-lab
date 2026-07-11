# 🚀 Plan de Lanzamiento — GRIND LAB / BaseRutina

> **Modelo:** B2B — suscripción de coaches (Starter $5 / Pro $10 / Studio $15 USD)
> **Backend:** Supabase (Auth + Postgres + Edge Functions), sin servidor propio
> **Pagos (etapa 1):** Transferencia bancaria con activación manual (admin vía dashboard).
> **Pagos (etapa 2):** MercadoPago Suscripciones — DIFERIDO, cableado a futuro (columna
>   `mp_preapproval_id` y tabla `mp_events` ya presentes).
> **Emails:** Resend (modo sandbox sin dominio → dominio real cuando se compre)
> **Principio de seguridad:** ningún secreto en el bundle del navegador. El cliente
> solo recibe la `anon key` de Supabase (protegida por RLS) y la `public key` de MP.

---

## 0. Objetivo

Pasar de una SPA client-side con auth mock a un SaaS B2B **listo para lanzar**:
coaches se registran, se suscriben (MP), y usan el editor de rutinas con sus datos
persistidos en la nube. Todo lo sensible corre en Edge Functions; el navegador nunca
ve una clave que pueda firmar tokens, cobrar, o leer datos de otros usuarios.

---

## 1. Arquitectura objetivo

```
┌─────────────────────────────────────────────────────────┐
│  NAVEGADOR (Vite SPA)                                    │
│  - Landing HomeSaaS + editor protegido                  │
│  - supabase-js con ANON KEY (RLS lo limita a lo propio) │
│  - MP Public Key (pública por diseño)                   │
│  - NUNCA: service_role, MP access token, Resend key     │
└───────────────┬─────────────────────────────────────────┘
                │ HTTPS
   ┌────────────┴───────────────┐
   │  SUPABASE                   │
   │  ┌───────────────────────┐  │
   │  │ Auth (email+password) │  │  ← reemplaza auth.js mock
   │  ├───────────────────────┤  │
   │  │ Postgres + RLS        │  │  ← profiles, subscriptions, routines
   │  ├───────────────────────┤  │
   │  │ Edge Functions (Deno) │  │  ← SECRETOS viven acá
   │  │  · create-subscription│  │
   │  │  · mp-webhook         │  │  ← valida firma MP, actualiza sub
   │  │  · cancel-subscription│  │
   │  │  · send-email (Resend)│  │
   │  └───────────────────────┘  │
   └────────────┬───────────────┘
                │ server-to-server (secretos)
     ┌──────────┴──────────┐
     │ MercadoPago  │ Resend │
     └──────────────┴────────┘
```

**Regla de oro:** cualquier variable con prefijo `VITE_` termina en el bundle y es
pública. Los secretos van con `supabase secrets set` y solo se leen dentro de Edge
Functions vía `Deno.env.get(...)`.

---

## 2. Mapa de secretos (dónde vive cada clave)

| Clave | Lado | Cómo se guarda |
|---|---|---|
| `VITE_SUPABASE_URL` | Cliente (público) | `.env` con prefijo VITE |
| `VITE_SUPABASE_ANON_KEY` | Cliente (público, RLS protege) | `.env` con prefijo VITE |
| `VITE_MP_PUBLIC_KEY` | Cliente (público por diseño) | `.env` con prefijo VITE |
| `SUPABASE_SERVICE_ROLE_KEY` | **Edge Function** | `supabase secrets set` |
| `MP_ACCESS_TOKEN` | **Edge Function** | `supabase secrets set` |
| `MP_WEBHOOK_SECRET` | **Edge Function** | `supabase secrets set` |
| `RESEND_API_KEY` | **Edge Function** | `supabase secrets set` |
| `APP_URL` (para back_urls/links) | Edge Function | `supabase secrets set` |

`.env.example` se actualiza; `.env` real va en `.gitignore` (ya está).

---

## 3. Modelo de datos (Postgres + RLS)

```sql
-- profiles: extiende auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'coach' check (role in ('coach','admin')),
  created_at timestamptz not null default now()
);

-- subscriptions: estado de la suscripción del coach
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('starter','pro','studio')),
  status text not null default 'pending'
    check (status in ('pending','trialing','active','past_due','canceled')),
  mp_preapproval_id text unique,          -- id de la suscripción en MP
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- routines: rutinas del coach (RESUELVE la pérdida de trabajo)
create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Rutina sin título',
  data jsonb not null,                     -- el JSON del editor
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- mp_events: idempotencia del webhook (evita procesar 2 veces)
create table public.mp_events (
  id text primary key,                     -- notification/data id de MP
  type text,
  processed_at timestamptz not null default now()
);
```

### RLS (Row Level Security) — activar en TODAS las tablas

```sql
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.routines      enable row level security;
alter table public.mp_events     enable row level security; -- sin políticas = solo service_role

-- profiles: cada uno ve/edita el suyo
create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- subscriptions: el coach solo LEE la suya. Las escrituras las hace el webhook (service_role, bypassea RLS).
create policy "own sub read" on subscriptions for select using (auth.uid() = user_id);

-- routines: CRUD solo sobre lo propio
create policy "own routines" on routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

> El webhook usa `service_role` (bypassa RLS) para escribir `subscriptions` y `mp_events`.
> El cliente **nunca** puede marcarse su propia suscripción como `active`.

---

## 4. Fases de ejecución

Cada fase es un incremento desplegable y verificable. Se puede pausar entre fases.

### Fase 0 — Fundaciones y limpieza de secretos
- Crear proyecto Supabase; obtener URL + anon key.
- Instalar `@supabase/supabase-js`; crear `src/lib/supabaseClient.js`.
- Crear `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_MP_PUBLIC_KEY) y actualizar `.env.example`.
- **Borrar del cliente:** `src/lib/auth.js` (mock), `src/data/users.db.json` (¡hashes en el bundle!), `src/scripts/createUser.js`. `routeObfuscator.js` se mantiene la ruta pero deja de ser "seguridad" — el gate real es la sesión.
- Correr migraciones SQL (tablas + RLS) vía Supabase SQL editor o `supabase/migrations`.

### Fase 1 — Auth real (Supabase Auth)
- Reescribir `src/store/authStore.jsx` para usar `supabase.auth` (`signInWithPassword`, `signUp`, `signOut`, `onAuthStateChange`, `getSession`).
- `ProtectedRoute` gatea con la **sesión real** (y en Fase 3, además con suscripción activa).
- UI: agregar **signup** (hoy no existe — la landing lo promete pero no está). Login/registro/reset password.
- Trigger SQL: al crear usuario en `auth.users`, insertar fila en `profiles`.
- Migrar los 3 usuarios actuales a Supabase Auth (invitación o alta manual).

### Fase 2 — Persistencia de rutinas (star feature + fix crítico de UX)
- `useRoutineEditor` guarda/carga desde `routines` (autosave con debounce).
- Lista "Mis rutinas" para abrir/duplicar/borrar.
- Fallback a `localStorage` como borrador offline mientras no hay red.

### Fase 3 — Suscripción por transferencia bancaria (activación manual)
- Pantalla de planes (Starter $5 / Pro $10 / Studio $15): el coach elige plan →
  crea una fila en `subscriptions` en estado `pending` → ve los datos bancarios y
  un instructivo ("transferí y avisanos").
- **Activación:** el admin (vos) recibe la transferencia y cambia `status` a `active`
  (+ `current_period_end`) desde el **Table Editor** de Supabase (service_role,
  bypassa RLS). Sin código de pagos todavía.
- Gating: `SubscriptionGate` permite el editor solo si `status in ('active','trialing')`.
  Si `pending` → pantalla "esperando confirmación de pago".

### Fase 4 — Webhook MercadoPago (DIFERIDO)
Cableado a futuro; el modelo de datos ya lo soporta. Cuando se implemente:
- Edge Function `mp-webhook` pública que:
  1. Valida `x-signature` (HMAC-SHA256 con `MP_WEBHOOK_SECRET`) — rechaza si no coincide.
  2. Idempotencia via `mp_events`.
  3. Trae el recurso de MP con `MP_ACCESS_TOKEN` y actualiza `subscriptions`.
- `create-subscription` (preapproval) reemplaza el flujo manual de la Fase 3.

### Fase 5 — Resend (transaccional, sin dominio)
- Edge Function `send-email` (o inline en el webhook) con `RESEND_API_KEY`.
- **Sin dominio:** `from: 'GRIND LAB <onboarding@resend.dev>'` (sender sandbox de Resend).
  ⚠️ En sandbox Resend solo entrega a la casilla dueña de la cuenta — sirve para
  dejarlo cableado y probado. Al comprar dominio: verificar DNS en Resend y cambiar
  el `from`. **Nada más cambia.**
- Plantillas listas: bienvenida/registro, suscripción activada, pago rechazado
  (`past_due`), cancelación, reset password (si no se usa el de Supabase).

### Fase 6 — Hardening de seguridad
- Auditoría RLS: intentar leer/escribir datos ajenos con la anon key → debe fallar.
- Verificar que **ningún** secreto quedó en el bundle (`grep` de las claves en `dist/`).
- Validación de firma del webhook probada con payload falso (debe rechazar).
- Rate limiting básico en Edge Functions públicas.
- Headers de seguridad (CSP, HSTS) en el hosting del front.
- CORS de las Edge Functions restringido a `APP_URL`.
- Quitar el "security theater": `routeObfuscator` deja de venderse como protección.

### Fase 7 — Mejora de funcionalidades estrella *(se detalla al terminar Fase 0–6)*
Candidatas (a priorizar juntos): plantillas/biblioteca de rutinas, mejor generador
de Prompt Maestro, export PDF más rico + share link, code-splitting del PDF para
bajar el bundle (hoy 2.5 MB), duplicar/versionar rutinas, branding del coach en el PDF.

---

## 5. Estructura de archivos nueva

```
supabase/
├── migrations/
│   └── 0001_init.sql              # tablas + RLS + trigger profiles
└── functions/
    ├── create-subscription/index.ts
    ├── mp-webhook/index.ts
    ├── cancel-subscription/index.ts
    └── _shared/
        ├── mp.ts                  # cliente MP + validación de firma
        ├── resend.ts              # envío de emails
        └── cors.ts

src/lib/supabaseClient.js          # cliente browser (anon key)
src/lib/subscription.js            # helpers de estado de suscripción
```

Se elimina: `src/lib/auth.js`, `src/data/users.db.json`, `src/scripts/createUser.js`.

---

## 6. Lo que necesito de vos para ejecutar

1. **Proyecto Supabase** creado → URL + anon key + service_role key.
2. **Credenciales MercadoPago** (cuenta de test primero): access token + public key + webhook secret.
3. **Cuenta Resend** → API key (arrancamos con `onboarding@resend.dev`).
4. Precios reales de los planes Starter / Pro / Studio (monto ARS + frecuencia).

Con eso arranco por Fase 0–1 (fundaciones + auth real) que no dependen de MP, y en
paralelo dejo el webhook y Resend cableados para cuando estén las credenciales.

---

## 7. Riesgos y decisiones abiertas

- **Trial "14 días sin tarjeta"** que promete la landing: MP preapproval puede iniciar
  con `status=trialing` sin cobro inicial, o manejamos el trial en nuestra DB y recién
  al día 14 se crea el preapproval. Definir.
- **Sandbox de Resend** solo entrega al dueño de la cuenta: los emails a coaches reales
  recién funcionan con dominio verificado. Hasta entonces, probado pero no "en vivo".
- **Migración de usuarios** actuales: se recrean en Supabase Auth (los hashes viejos no
  se importan por seguridad; se invita a resetear password).
```
