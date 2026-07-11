-- ============================================================
-- 0002_athletes_admin.sql
-- - athletes: cada coach gestiona sus atletas
-- - routines.athlete_id: una rutina puede pertenecer a un atleta
-- - is_admin() + políticas RLS para el dashboard de admin
-- ============================================================

-- ── athletes ───────────────────────────────────────────────
create table if not exists public.athletes (
  id         uuid primary key default gen_random_uuid(),
  coach_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  email      text,
  goal       text,          -- objetivo (ej: hipertrofia, pérdida de grasa)
  level      text,          -- nivel (inicial/intermedio/avanzado)
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_athletes_coach on public.athletes(coach_id);

drop trigger if exists trg_athletes_updated on public.athletes;
create trigger trg_athletes_updated before update on public.athletes
  for each row execute function public.set_updated_at();

-- ── routines ← athlete ─────────────────────────────────────
alter table public.routines
  add column if not exists athlete_id uuid references public.athletes(id) on delete set null;
create index if not exists idx_routines_athlete on public.routines(athlete_id);

-- ============================================================
-- is_admin(): true si el usuario actual tiene role='admin'.
-- SECURITY DEFINER = corre como owner y bypassa RLS → sin recursión.
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── RLS athletes ───────────────────────────────────────────
alter table public.athletes enable row level security;

drop policy if exists "own athletes" on public.athletes;
create policy "own athletes" on public.athletes
  for all using (auth.uid() = coach_id) with check (auth.uid() = coach_id);

-- ── Políticas de ADMIN (se suman por OR a las de dueño) ────
drop policy if exists "admin reads all profiles" on public.profiles;
create policy "admin reads all profiles" on public.profiles
  for select using (public.is_admin());

drop policy if exists "admin reads all subs" on public.subscriptions;
create policy "admin reads all subs" on public.subscriptions
  for select using (public.is_admin());

drop policy if exists "admin writes subs" on public.subscriptions;
create policy "admin writes subs" on public.subscriptions
  for update using (public.is_admin());

-- El coach puede crear SU suscripción, pero solo en estado 'pending'
-- (nunca puede auto-activarse; la activación la hace el admin).
drop policy if exists "own sub insert pending" on public.subscriptions;
create policy "own sub insert pending" on public.subscriptions
  for insert with check (auth.uid() = user_id and status = 'pending');
