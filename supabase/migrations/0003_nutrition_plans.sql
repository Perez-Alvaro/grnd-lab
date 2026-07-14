-- ============================================================
-- 0003_nutrition_plans.sql
-- Planes nutricionales: tabla espejo de `routines`.
--   - Mismo árbol semana → día → (comidas) guardado en `data` jsonb.
--   - Pertenece a un coach (user_id) y opcionalmente a un atleta (athlete_id).
--   - RLS: CRUD sobre lo propio + lectura de admin (mismo patrón que routines).
-- Aplicar en el SQL Editor de Supabase DESPUÉS de 0001 y 0002.
-- ============================================================

-- ── nutrition_plans: planes de nutrición del coach ─────────
create table if not exists public.nutrition_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  athlete_id uuid references public.athletes(id) on delete set null,
  title      text not null default 'Plan nutricional sin título',
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_nutrition_plans_user    on public.nutrition_plans(user_id);
create index if not exists idx_nutrition_plans_athlete on public.nutrition_plans(athlete_id);

-- ── updated_at automático (reutiliza set_updated_at de 0001) ─
drop trigger if exists trg_nutrition_plans_updated on public.nutrition_plans;
create trigger trg_nutrition_plans_updated before update on public.nutrition_plans
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table public.nutrition_plans enable row level security;

-- CRUD solo sobre lo propio
drop policy if exists "own nutrition_plans" on public.nutrition_plans;
create policy "own nutrition_plans" on public.nutrition_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- El admin puede leer todos (mismo patrón que routines en 0002; is_admin()
-- ya existe y es SECURITY DEFINER, así que no hay recursión).
drop policy if exists "admin reads all nutrition_plans" on public.nutrition_plans;
create policy "admin reads all nutrition_plans" on public.nutrition_plans
  for select using (public.is_admin());
