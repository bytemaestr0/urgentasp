-- Rulează în Supabase > SQL Editor (după schema.sql). Coloane scrise DOAR de worker.
alter table public.profiles
  add column if not exists seen_dates jsonb not null default '[]',
  add column if not exists seen_key text,
  add column if not exists last_checked timestamptz,
  add column if not exists last_error text,
  add column if not exists current_exam_date date,
  add column if not exists service_name text,
  add column if not exists location_name text;
-- Utilizatorii le pot CITI (policy-ul de select există), dar nu le pot modifica:
-- grant-ul de update de pe schema.sql listează explicit doar coloanele lor.
