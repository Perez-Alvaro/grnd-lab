-- ============================================================
-- 0009_harden_profile_update.sql
-- FIX DE SEGURIDAD (CRÍTICO): bypass de pago por auto-escalación.
--
-- La policy "own profile update" (0001) deja que cada usuario actualice SU
-- fila de profiles, y en Postgres una policy de UPDATE no restringe columnas.
-- El trigger de 0005 solo bloqueaba cambios de `role`, pero 0006 agregó
-- `access_override` y `trial_until` — columnas que deciden el acceso a los
-- editores (has_active_sub()). Sin este fix, un coach podía correr:
--     update profiles set access_override = 'unlocked' where id = auth.uid();
--     update profiles set trial_until = '2099-01-01' where id = auth.uid();
-- y darse acceso gratis de por vida, salteando el pago por transferencia.
--
-- Se reescribe el guard (mismo trigger trg_profiles_role_guard) para que un
-- NO-admin no pueda cambiar role NI access_override NI trial_until. El admin,
-- el service_role y el SQL Editor (auth.uid() null) siguen pudiendo.
-- Aplicar en el SQL Editor de Supabase DESPUÉS de 0001..0008.
-- ============================================================

create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null
     and not public.is_admin()
     and (
          new.role            is distinct from old.role
       or new.access_override is distinct from old.access_override
       or new.trial_until     is distinct from old.trial_until
     ) then
    raise exception 'No tenés permisos para cambiar estos campos del perfil';
  end if;
  return new;
end; $$;

-- El trigger trg_profiles_role_guard (creado en 0005) ya apunta a esta función,
-- así que con reemplazarla alcanza. Se recrea por si 0005 no se aplicó.
drop trigger if exists trg_profiles_role_guard on public.profiles;
create trigger trg_profiles_role_guard before update on public.profiles
  for each row execute function public.prevent_role_escalation();
