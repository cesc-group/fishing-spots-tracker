# Family Fishing Spots

Shared fishing spot tracker — Supabase backend, deployed via GitHub Pages.

Live at: https://cesc-group.github.io/fishing-spots-tracker/ (once deployed)

## Status

- [x] Supabase schema created (fishing_spots, fishing_catches tables, RLS policies, storage bucket)
- [x] React + Vite app built (Catches tab live; other tabs in progress)
- [x] GitHub Pages deploy workflow configured
- [ ] Repo created on GitHub and code pushed
- [ ] GitHub Actions secrets added (see below)
- [ ] GitHub Pages enabled in repo settings
- [ ] Remaining tabs (Spots, Map, Timeline, Stats, Guide, Add)

## One-time setup on GitHub

1. Create a new repo at `cesc-group/fishing-spots-tracker` (public or private — Pages works either way on a paid org plan; public is required on a free plan)
2. Push this code to the `main` branch
3. Add two repository secrets (Settings → Secrets and variables → Actions → New repository secret):
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase publishable key
4. Settings → Pages → under "Build and deployment", set Source to **GitHub Actions**
5. Push to `main` (or re-run the workflow) — the site builds and deploys automatically

After that, every future push to `main` redeploys automatically. No Vercel, no separate hosting account.

## Local development

1. Copy `.env.example` to `.env`, fill in your Supabase project URL and publishable key
2. `npm install`
3. `npm run dev`
