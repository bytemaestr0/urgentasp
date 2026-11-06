-- Rulează în Supabase > SQL Editor
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text default '',
  plan text not null default 'free' check (plan in ('free','paid')),
  link text default '',
  ntfy text default '',
  free_mode text not null default 'new' check (free_mode in ('new','all')),
  auto boolean not null default false,
  excluded jsonb not null default '[]'
);

alter table public.profiles enable row level security;
create policy "citește propriul profil" on public.profiles for select using (auth.uid() = id);
create policy "modifică propriul profil" on public.profiles for update using (auth.uid() = id);

-- Utilizatorul NU poate schimba singur planul (doar tu / webhook-ul de plată, cu service role)
revoke update on public.profiles from authenticated;
grant update (name, link, ntfy, free_mode, auto, excluded) on public.profiles to authenticated;

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name',''));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Activarea manuală a planului Plus pentru un utilizator:
-- update public.profiles set plan = 'paid' where id = '<user-id>';
