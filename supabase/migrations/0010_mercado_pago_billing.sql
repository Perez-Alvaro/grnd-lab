-- ============================================================
-- 0010_mercado_pago_billing.sql
-- Infraestructura de cobros automáticos con Mercado Pago en ARS
-- y soporte para el tier Freemium (hasta 3 rutinas gratuitas).
-- ============================================================

-- 1. Ampliar check constraints de planes en subscriptions y payments
alter table public.subscriptions drop constraint if exists subscriptions_plan_check;
alter table public.subscriptions add constraint subscriptions_plan_check
  check (plan in ('freemium','pro_monthly','pro_annual','pro','mensual','trimestral','anual','starter','studio','lifetime'));

alter table public.subscriptions
  add column if not exists mp_payment_id text;

alter table public.payments drop constraint if exists payments_plan_check;
alter table public.payments add constraint payments_plan_check
  check (plan in ('freemium','pro_monthly','pro_annual','pro','mensual','trimestral','anual','starter','studio','lifetime'));

alter table public.payments
  add column if not exists amount_ars numeric,
  add column if not exists payment_method text default 'bank_transfer',
  add column if not exists mp_payment_id text;

-- Permitir receipt_path opcional (los pagos de Mercado Pago no requieren comprobante subido)
alter table public.payments alter column receipt_path drop not null;

-- 2. Asegurar existencia de mp_events para idempotencia de webhooks
create table if not exists public.mp_events (
  id           text primary key,
  type         text,
  processed_at timestamptz not null default now()
);
alter table public.mp_events enable row level security;

-- 3. Actualizar función plan_duration_days
create or replace function public.plan_duration_days(p_plan text)
returns integer language sql immutable as $$
  select case p_plan
    when 'pro_monthly' then 30
    when 'pro_annual'  then 365
    when 'pro'         then 30
    when 'mensual'     then 30
    when 'trimestral'  then 90
    when 'anual'       then 365
    when 'lifetime'    then 3650
    when 'freemium'    then 3650
    else 30
  end;
$$;

-- 4. Actualizar políticas RLS de routines para admitir el tier Freemium (hasta 3 rutinas)
drop policy if exists "own routines insert active" on public.routines;
create policy "own routines insert active" on public.routines
  for insert with check (
    auth.uid() = user_id and (
      public.has_active_sub()
      or public.is_admin()
      or (select count(*) from public.routines where user_id = auth.uid()) < 3
    )
  );

drop policy if exists "own routines update active" on public.routines;
create policy "own routines update active" on public.routines
  for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and (
      public.has_active_sub()
      or public.is_admin()
      or (select count(*) from public.routines where user_id = auth.uid()) <= 3
    )
  );
