-- ============================================================
-- 0007_app_settings.sql
-- Configuración editable por el admin desde el panel.
--
-- Motivo: los datos de transferencia (titular / alias / CBU) estaban
-- hardcodeados en el bundle del front (src/lib/subscriptions.js). Cambiar
-- una cuenta bancaria obligaba a tocar código y desplegar de nuevo.
--
-- Tabla clave/valor: hoy guarda 'transfer_info', mañana sirve para
-- cualquier otro ajuste sin necesidad de otra migración.
-- ============================================================

create table if not exists public.app_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

alter table public.app_settings enable row level security;

-- ── Lectura: cualquier usuario autenticado ──────────────────
-- El coach necesita ver los datos de transferencia para poder pagar.
-- Acá NO va nada secreto: son datos que el coach tiene que ver igual.
drop policy if exists "app_settings_select_authenticated" on public.app_settings;
create policy "app_settings_select_authenticated"
  on public.app_settings
  for select
  to authenticated
  using (true);

-- ── Escritura: solo admin ───────────────────────────────────
drop policy if exists "app_settings_insert_admin" on public.app_settings;
create policy "app_settings_insert_admin"
  on public.app_settings
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "app_settings_update_admin" on public.app_settings;
create policy "app_settings_update_admin"
  on public.app_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "app_settings_delete_admin" on public.app_settings;
create policy "app_settings_delete_admin"
  on public.app_settings
  for delete
  to authenticated
  using (public.is_admin());

-- ── updated_at automático ───────────────────────────────────
create or replace function public.touch_app_settings()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists app_settings_touch on public.app_settings;
create trigger app_settings_touch
  before insert or update on public.app_settings
  for each row execute function public.touch_app_settings();

-- ── Semilla: valores actuales del código ────────────────────
-- on conflict do nothing → si ya lo editaste, la migración no lo pisa.
insert into public.app_settings (key, value)
values (
  'transfer_info',
  jsonb_build_object(
    'titular', 'Alvaro Raul Perez',
    'alias',   'mock.entrenamiento',
    'cbu',     '',
    'banco',   '',
    'nota',    'Enviá el comprobante desde tu panel para que activemos tu acceso.'
  )
)
on conflict (key) do nothing;
