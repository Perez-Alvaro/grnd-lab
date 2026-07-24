-- ============================================================
-- 0006_access_override_trial.sql
-- Control de acceso manual del admin + prueba gratis de 24 hs.
--   - profiles.access_override: 'blocked' (bloqueado siempre) |
--     'unlocked' (acceso libre siempre) | null (según pago/prueba).
--   - profiles.trial_until: modo testing — acceso completo hasta esa
--     fecha, la asigna el admin desde su panel.
--   - Alta nueva: trial_until = now() + 24 hs → todo usuario nuevo
--     prueba el software completo un día y después se bloquea solo.
--   - has_active_sub() ahora resuelve: override > prueba > pago.
--   - El admin puede editar profiles ajenos (asignar override/prueba).
-- Aplicar en el SQL Editor de Supabase DESPUÉS de 0001..0005.
-- ============================================================

-- ── Columnas de acceso en profiles ──────────────────────────
alter table public.profiles
  add column if not exists access_override text
    check (access_override in ('blocked','unlocked'));
alter table public.profiles
  add column if not exists trial_until timestamptz;

-- ── Alta nueva: prueba completa de 24 hs ────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role, trial_until)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'coach',
    now() + interval '24 hours'
  );
  return new;
end; $$;

-- ── has_active_sub(): override del admin > prueba > pago ────
-- (Mantiene el nombre porque las políticas RLS de 0004 ya lo usan.)
create or replace function public.has_active_sub()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((
    select case
      when p.access_override = 'blocked'  then false
      when p.access_override = 'unlocked' then true
      when p.trial_until is not null and p.trial_until > now() then true
      else exists (
        select 1 from public.subscriptions s
        where s.user_id = auth.uid()
          and s.status = 'active'
          and s.current_period_end is not null
          and s.current_period_end > now()
      )
    end
    from public.profiles p
    where p.id = auth.uid()
  ), false);
$$;

-- ── El admin administra los accesos de sus clientes ─────────
-- (El trigger trg_profiles_role_guard de 0005 sigue impidiendo
--  que un no-admin se cambie el rol.)
drop policy if exists "admin writes profiles" on public.profiles;
create policy "admin writes profiles" on public.profiles
  for update using (public.is_admin());
