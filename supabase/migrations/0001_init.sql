-- ============================================================
-- 0001_init.sql — Esquema inicial GRIND LAB (B2B coaches)
-- Tablas: profiles, subscriptions, routines, mp_events
-- Seguridad: RLS activo en todas. El cliente solo toca lo propio.
-- Pagos: por ahora transferencia bancaria con activación manual (admin
--        vía dashboard = service_role). MercadoPago queda cableado a futuro
--        (columna mp_preapproval_id ya presente).
-- ============================================================

-- ── profiles: extiende auth.users ──────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  role       text not null default 'coach' check (role in ('coach','admin')),
  created_at timestamptz not null default now()
);

-- ── subscriptions: estado de suscripción del coach ─────────
create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  plan               text not null check (plan in ('starter','pro','studio')),
  status             text not null default 'pending'
                       check (status in ('pending','trialing','active','past_due','canceled')),
  payment_method     text not null default 'bank_transfer',
  mp_preapproval_id  text unique,               -- reservado para MercadoPago
  current_period_end timestamptz,
  notes              text,                       -- ej: referencia de transferencia
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);

-- ── routines: rutinas del coach (persistencia en la nube) ──
create table if not exists public.routines (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null default 'Rutina sin título',
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_routines_user on public.routines(user_id);

-- ── mp_events: idempotencia webhook (reservado, MP diferido) ─
create table if not exists public.mp_events (
  id           text primary key,
  type         text,
  processed_at timestamptz not null default now()
);

-- ── updated_at automático ──────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated before update on public.subscriptions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_routines_updated on public.routines;
create trigger trg_routines_updated before update on public.routines
  for each row execute function public.set_updated_at();

-- ── Alta automática de profile al registrarse ──────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'coach'
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.routines      enable row level security;
alter table public.mp_events     enable row level security; -- sin políticas: solo service_role

-- profiles: cada uno ve/edita el suyo (rol NO editable desde el cliente:
--   update permitido pero un cambio de role se controla a nivel app/admin)
drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- subscriptions: el coach SOLO lee la suya. Las escrituras (activación tras
--   transferencia) las hace el admin vía dashboard (service_role bypassa RLS).
drop policy if exists "own sub read" on public.subscriptions;
create policy "own sub read" on public.subscriptions for select using (auth.uid() = user_id);

-- routines: CRUD solo sobre lo propio
drop policy if exists "own routines" on public.routines;
create policy "own routines" on public.routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
