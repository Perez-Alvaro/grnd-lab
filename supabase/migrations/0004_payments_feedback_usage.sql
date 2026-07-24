-- ============================================================
-- 0004_payments_feedback_usage.sql
-- Suscripciones por transferencia bancaria (ciclo completo):
--   - payments: el coach informa la transferencia subiendo comprobante
--     (estado 'submitted' = "pago enviado, por chequear por el admin").
--   - approve_payment()/reject_payment(): el admin confirma el impacto
--     y el sistema habilita 30/90/365 días según el plan.
--   - has_active_sub(): gate de RLS → sin pago vigente NO se puede
--     crear/editar rutinas ni planes de nutrición (deshabilitación
--     automática al vencer current_period_end, sin cron).
--   - feedback: buzón de reclamos/bugs de los entrenadores.
--   - usage_events: tracking de uso de cada editor para el admin.
--   - Bucket privado 'receipts' para comprobantes.
-- Aplicar en el SQL Editor de Supabase DESPUÉS de 0001..0003.
-- ============================================================

-- ── Planes reales del landing (mensual/trimestral/anual) ────
-- Se mantienen los valores legacy por si hay filas viejas.
alter table public.subscriptions drop constraint if exists subscriptions_plan_check;
alter table public.subscriptions add constraint subscriptions_plan_check
  check (plan in ('mensual','trimestral','anual','starter','pro','studio'));

-- ── has_active_sub(): pago vigente = active y período sin vencer ─
create or replace function public.has_active_sub()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = auth.uid()
      and status = 'active'
      and current_period_end is not null
      and current_period_end > now()
  );
$$;

-- ── plan_duration_days(): días que habilita cada plan ───────
create or replace function public.plan_duration_days(p_plan text)
returns integer language sql immutable as $$
  select case p_plan
    when 'mensual'    then 30
    when 'trimestral' then 90
    when 'anual'      then 365
    else 30
  end;
$$;

-- ============================================================
-- payments: transferencias informadas por el coach
-- ============================================================
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  plan            text not null check (plan in ('mensual','trimestral','anual')),
  amount_usd      numeric,
  reference       text,                    -- nro de operación / alias del emisor
  receipt_path    text not null,           -- path en el bucket 'receipts'
  status          text not null default 'submitted'
                    check (status in ('submitted','approved','rejected')),
  admin_notes     text,                    -- motivo de rechazo u observaciones
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  period_end      timestamptz,             -- hasta cuándo habilitó este pago
  created_at      timestamptz not null default now()
);
create index if not exists idx_payments_user   on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);

alter table public.payments enable row level security;

-- El coach informa su pago (siempre nace 'submitted', nunca auto-aprobado)
drop policy if exists "own payment insert submitted" on public.payments;
create policy "own payment insert submitted" on public.payments
  for insert with check (auth.uid() = user_id and status = 'submitted');

drop policy if exists "own payments read" on public.payments;
create policy "own payments read" on public.payments
  for select using (auth.uid() = user_id);

drop policy if exists "admin reads all payments" on public.payments;
create policy "admin reads all payments" on public.payments
  for select using (public.is_admin());

drop policy if exists "admin writes payments" on public.payments;
create policy "admin writes payments" on public.payments
  for update using (public.is_admin());

-- ── approve_payment(): el admin confirma que la transferencia impactó ─
-- Activa/extiende la suscripción por la duración del plan pagado.
create or replace function public.approve_payment(p_payment_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_payment public.payments%rowtype;
  v_days    integer;
  v_sub_id  uuid;
  v_base    timestamptz;
  v_end     timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede aprobar pagos';
  end if;

  select * into v_payment from public.payments where id = p_payment_id for update;
  if not found then
    raise exception 'Pago inexistente';
  end if;
  if v_payment.status <> 'submitted' then
    raise exception 'El pago ya fue revisado';
  end if;

  v_days := public.plan_duration_days(v_payment.plan);

  select id into v_sub_id from public.subscriptions
    where user_id = v_payment.user_id
    order by created_at desc limit 1;

  if v_sub_id is null then
    v_end := now() + make_interval(days => v_days);
    insert into public.subscriptions (user_id, plan, status, current_period_end, payment_method)
      values (v_payment.user_id, v_payment.plan, 'active', v_end, 'bank_transfer')
      returning id into v_sub_id;
  else
    -- si aún tiene días vigentes, el nuevo período se suma al final
    select greatest(coalesce(current_period_end, now()), now()) into v_base
      from public.subscriptions where id = v_sub_id;
    v_end := v_base + make_interval(days => v_days);
    update public.subscriptions
      set plan = v_payment.plan, status = 'active', current_period_end = v_end
      where id = v_sub_id;
  end if;

  update public.payments
    set status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        subscription_id = v_sub_id,
        period_end = v_end
    where id = p_payment_id;
end; $$;

-- ── reject_payment(): la transferencia no impactó / comprobante inválido ─
create or replace function public.reject_payment(p_payment_id uuid, p_notes text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede rechazar pagos';
  end if;
  update public.payments
    set status = 'rejected',
        admin_notes = p_notes,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    where id = p_payment_id and status = 'submitted';
  if not found then
    raise exception 'El pago no existe o ya fue revisado';
  end if;
end; $$;

-- ============================================================
-- Deshabilitación automática por falta de pago (gate en RLS)
-- Sin pago vigente el coach puede VER y BORRAR lo suyo, pero no
-- crear ni editar rutinas/planes. El admin no tiene restricción.
-- ============================================================

-- routines
drop policy if exists "own routines" on public.routines;
drop policy if exists "own routines select" on public.routines;
drop policy if exists "own routines delete" on public.routines;
drop policy if exists "own routines insert active" on public.routines;
drop policy if exists "own routines update active" on public.routines;

create policy "own routines select" on public.routines
  for select using (auth.uid() = user_id);
create policy "own routines delete" on public.routines
  for delete using (auth.uid() = user_id);
create policy "own routines insert active" on public.routines
  for insert with check (
    auth.uid() = user_id and (public.has_active_sub() or public.is_admin())
  );
create policy "own routines update active" on public.routines
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and (public.has_active_sub() or public.is_admin()));

-- el admin también puede leer todas las rutinas (métricas de uso)
drop policy if exists "admin reads all routines" on public.routines;
create policy "admin reads all routines" on public.routines
  for select using (public.is_admin());

-- nutrition_plans
drop policy if exists "own nutrition_plans" on public.nutrition_plans;
drop policy if exists "own nutrition_plans select" on public.nutrition_plans;
drop policy if exists "own nutrition_plans delete" on public.nutrition_plans;
drop policy if exists "own nutrition_plans insert active" on public.nutrition_plans;
drop policy if exists "own nutrition_plans update active" on public.nutrition_plans;

create policy "own nutrition_plans select" on public.nutrition_plans
  for select using (auth.uid() = user_id);
create policy "own nutrition_plans delete" on public.nutrition_plans
  for delete using (auth.uid() = user_id);
create policy "own nutrition_plans insert active" on public.nutrition_plans
  for insert with check (
    auth.uid() = user_id and (public.has_active_sub() or public.is_admin())
  );
create policy "own nutrition_plans update active" on public.nutrition_plans
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and (public.has_active_sub() or public.is_admin()));

-- ============================================================
-- feedback: buzón de reclamos y bugs de los entrenadores
-- ============================================================
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null default 'bug' check (type in ('bug','reclamo','sugerencia')),
  subject     text not null,
  message     text not null,
  status      text not null default 'open' check (status in ('open','in_progress','resolved')),
  admin_reply text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_feedback_user   on public.feedback(user_id);
create index if not exists idx_feedback_status on public.feedback(status);

drop trigger if exists trg_feedback_updated on public.feedback;
create trigger trg_feedback_updated before update on public.feedback
  for each row execute function public.set_updated_at();

alter table public.feedback enable row level security;

drop policy if exists "own feedback insert" on public.feedback;
create policy "own feedback insert" on public.feedback
  for insert with check (auth.uid() = user_id and status = 'open');

drop policy if exists "own feedback read" on public.feedback;
create policy "own feedback read" on public.feedback
  for select using (auth.uid() = user_id);

drop policy if exists "admin reads all feedback" on public.feedback;
create policy "admin reads all feedback" on public.feedback
  for select using (public.is_admin());

drop policy if exists "admin writes feedback" on public.feedback;
create policy "admin writes feedback" on public.feedback
  for update using (public.is_admin());

-- ============================================================
-- usage_events: qué editor se usa más (solo lo lee el admin)
-- ============================================================
create table if not exists public.usage_events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  event      text not null,   -- 'editor_open' | 'plan_saved' | 'pdf_export'
  plan_type  text,            -- 'workout' | 'nutrition'
  created_at timestamptz not null default now()
);
create index if not exists idx_usage_events_event on public.usage_events(event, plan_type);

alter table public.usage_events enable row level security;

drop policy if exists "own usage insert" on public.usage_events;
create policy "own usage insert" on public.usage_events
  for insert with check (auth.uid() = user_id);

drop policy if exists "admin reads usage" on public.usage_events;
create policy "admin reads usage" on public.usage_events
  for select using (public.is_admin());

-- ============================================================
-- Storage: bucket privado para comprobantes de transferencia
-- Cada coach sube a receipts/{su-uid}/...; solo él y el admin leen.
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('receipts', 'receipts', false)
  on conflict (id) do nothing;

drop policy if exists "receipts upload own folder" on storage.objects;
create policy "receipts upload own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "receipts read own or admin" on storage.objects;
create policy "receipts read own or admin" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'receipts'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
