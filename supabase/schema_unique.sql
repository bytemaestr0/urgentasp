-- Rulează în Supabase > SQL Editor, DUPĂ schema.sql și schema_worker.sql.
-- Nume de utilizator unic, cod ntfy unic (fără deosebire între litere mari/mici).
-- Emailul unic e deja garantat de Supabase Auth (auth.users.email are index unic).

-- 0) Verifică dubluri existente. Dacă vreuna returnează rânduri, rezolvă-le înainte de pasul 1:
-- select lower(btrim(name)) as n, count(*) from public.profiles where btrim(name) <> '' group by 1 having count(*) > 1;
-- select lower(btrim(ntfy)) as n, count(*) from public.profiles where btrim(ntfy) <> '' group by 1 having count(*) > 1;

-- 1) Indecși unici (ultima linie de apărare, chiar dacă cineva ocolește aplicația)
create unique index if not exists profiles_name_unique on public.profiles (lower(btrim(name))) where btrim(name) <> '';
create unique index if not exists profiles_ntfy_unique on public.profiles (lower(btrim(ntfy))) where btrim(ntfy) <> '';

-- 2) Trigger-ul de înregistrare: curăță numele (spații la capete / dublate)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, btrim(regexp_replace(coalesce(new.raw_user_meta_data->>'name',''), '\s+', ' ', 'g')));
  return new;
end $$;

-- 3) Verificare disponibilitate nume (apelabilă și înainte de autentificare, la înscriere)
create or replace function public.username_available(p_name text) returns boolean
language sql security definer set search_path = public stable as $$
  select btrim(coalesce(p_name,'')) <> ''
     and not exists (select 1 from public.profiles
                     where lower(btrim(name)) = lower(btrim(regexp_replace(p_name, '\s+', ' ', 'g'))));
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- 4) Verificare cod ntfy: liber dacă nu îl folosește ALT cont (doar utilizatori autentificați)
create or replace function public.ntfy_available(p_code text) returns boolean
language sql security definer set search_path = public stable as $$
  select not exists (select 1 from public.profiles
                     where lower(btrim(ntfy)) = lower(btrim(p_code))
                       and btrim(ntfy) <> ''
                       and id is distinct from auth.uid());
$$;
revoke all on function public.ntfy_available(text) from public;
grant execute on function public.ntfy_available(text) to authenticated;

notify pgrst, 'reload schema';
