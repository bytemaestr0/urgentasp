# UrgentASP

Site React (Vite) cu autentificare Supabase pentru alerte de programări la ASP.

## Pornire
1. `npm install`
2. Copiază `.env.example` în `.env` și completează URL-ul și cheia Publishable (sb_publishable_...) din Supabase (Project Settings > API Keys).
3. Rulează `supabase/schema.sql` în Supabase > SQL Editor.
4. În Supabase > Authentication > URL Configuration adaugă adresa site-ului (ex. `http://localhost:5173`) și în Redirect URLs: `http://localhost:5173/login` și `http://localhost:5173/reset-password` (la fel pentru domeniul de producție).
5. `npm run dev`

## Build
`npm run build` generează folderul `dist/`, care poate fi pus pe orice hosting static.

## Plan Plus
Utilizatorul nu își poate schimba singur planul. Activează-l din SQL Editor:
`update public.profiles set plan = 'paid' where id = '<user-id>';`

## Rute
`/`, `/instructiuni`, `/login`, `/signup`, `/forgot-password`, `/reset-password`. `/programare` și `/cont` cer autentificare și redirecționează la `/login`.
Pe hosting folosește redirect SPA către `index.html` (incluse: `public/_redirects` pentru Netlify, `vercel.json` pentru Vercel).
