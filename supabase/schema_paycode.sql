-- Rulează în Supabase > SQL Editor (după schema.sql, schema_worker.sql, schema_unique.sql).
-- Fiecare cont primește un cod unic de 12 caractere (litere mari + cifre, ex: 3F9A0C71B2D4),
-- folosit ca mesaj la plata prin MIA. Utilizatorul îl poate citi, dar NU îl poate modifica.

-- 1) Coloana
alter table public.profiles add column if not exists pay_code text;

-- 2) Generatorul (CSPRNG prin gen_random_uuid, cu verificare de unicitate)
create or replace function public.gen_pay_code() returns text
language plpgsql set search_path = public as $$
declare c text;
begin
  loop
    c := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
    exit when not exists (select 1 from public.profiles where pay_code = c);
  end loop;
  return c;
end $$;

-- 3) Conturile existente: câte un cod, rând cu rând (ca să nu se ciocnească între ele)
do $$
declare r record;
begin
  for r in select id from public.profiles where pay_code is null loop
    update public.profiles set pay_code = public.gen_pay_code() where id = r.id;
  end loop;
end $$;

-- 4) Conturile noi primesc codul automat la înregistrare + unicitate garantată
alter table public.profiles alter column pay_code set default public.gen_pay_code();
alter table public.profiles alter column pay_code set not null;
create unique index if not exists profiles_pay_code_key on public.profiles (pay_code);

-- (Coloana pay_code nu e în lista de coloane modificabile din schema.sql, deci utilizatorii nu o pot schimba.)

-- Verificare:
-- select count(*) total, count(distinct pay_code) distincte, min(length(pay_code)) lung_min, max(length(pay_code)) lung_max from public.profiles;

-- Când primești o plată cu mesajul „cod unic: XXXXXXXXXXXX":
-- select id, name, plan from public.profiles where pay_code = 'XXXXXXXXXXXX';
-- update public.profiles set plan = 'paid' where pay_code = 'XXXXXXXXXXXX';

notify pgrst, 'reload schema';
