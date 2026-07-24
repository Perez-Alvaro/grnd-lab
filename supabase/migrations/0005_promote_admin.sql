-- ============================================================
-- 0005_promote_admin.sql
-- 1) Promueve la cuenta del administrador (perezalvaroraul26@gmail.com)
--    a role='admin'. El trigger de alta crea a todos como 'coach',
--    por eso el dueño también nace como entrenador.
-- 2) Tapa el hueco de seguridad: la política "own profile update"
--    permitía que cualquier coach se auto-asignara role='admin'.
--    Ahora un trigger bloquea el cambio de rol salvo que lo haga
--    un admin (o el service_role / Table Editor, donde auth.uid()
--    es null).
-- Aplicar en el SQL Editor de Supabase DESPUÉS de 0001..0004.
-- ============================================================

-- ── 1) Admin del SaaS ───────────────────────────────────────
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where lower(email) = 'perezalvaroraul26@gmail.com'
);

-- ── 2) Nadie se auto-promueve ───────────────────────────────
create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null        -- service_role / SQL Editor pasan
     and not public.is_admin() then
    raise exception 'No tenés permisos para cambiar el rol';
  end if;
  return new;
end; $$;

drop trigger if exists trg_profiles_role_guard on public.profiles;
create trigger trg_profiles_role_guard before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- Verificación rápida (debería devolver tu fila con role='admin'):
-- select p.id, u.email, p.name, p.role
-- from public.profiles p join auth.users u on u.id = p.id
-- where p.role = 'admin';
