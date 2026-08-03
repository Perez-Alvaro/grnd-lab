-- ============================================================
-- 0008_terms_acceptance.sql
-- Aceptación de los Términos y Condiciones de Mock.
--
-- Se guarda CUÁNDO y QUÉ VERSIÓN aceptó cada usuario. La versión importa:
-- si el texto cambia, se sube TERMS_VERSION en src/lib/legalTerms.js y el
-- usuario vuelve a prestar consentimiento (una aceptación vieja no cubre
-- condiciones nuevas).
--
-- No se agrega policy nueva: "own profile update" (0001) ya permite que cada
-- usuario actualice su propia fila, y trg_profiles_role_guard (0005) impide
-- que aproveche ese UPDATE para cambiarse el rol.
-- ============================================================

alter table public.profiles
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version     text;

comment on column public.profiles.terms_accepted_at is
  'Momento en que el usuario aceptó los T&C. NULL = todavía no aceptó.';
comment on column public.profiles.terms_version is
  'Versión de los T&C aceptada (TERMS_VERSION de src/lib/legalTerms.js).';

-- Índice parcial: la consulta habitual es "quiénes NO aceptaron todavía".
create index if not exists profiles_terms_pending_idx
  on public.profiles (id)
  where terms_accepted_at is null;
