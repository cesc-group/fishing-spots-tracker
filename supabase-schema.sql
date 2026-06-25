-- Family Fishing Spots — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Spots table
create table if not exists fishing_spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text[] not null default '{}',
  maplink text default '',
  notes text default '',
  rating int default 0,
  favorite boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- 2. Catches table
create table if not exists fishing_catches (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references fishing_spots(id) on delete cascade,
  species text not null,
  size numeric,
  angler text default '',
  catch_date date,
  photo_url text,
  created_at timestamptz default now()
);

-- 3. Enable Row Level Security (required by Supabase even for permissive policies)
alter table fishing_spots enable row level security;
alter table fishing_catches enable row level security;

-- 4. Policies — no login required. Anyone with the project's public API key
--    (which is meant to be exposed in client-side code) can read/write.
--    This matches "family + friends, no accounts" — simple, but be aware
--    that anyone who gets your app URL and inspects it could also write
--    directly to the database via the API, not just through the app UI.
create policy "Public can read fishing_spots" on fishing_spots
  for select using (true);
create policy "Public can insert fishing_spots" on fishing_spots
  for insert with check (true);
create policy "Public can update fishing_spots" on fishing_spots
  for update using (true);
create policy "Public can delete fishing_spots" on fishing_spots
  for delete using (true);

create policy "Public can read fishing_catches" on fishing_catches
  for select using (true);
create policy "Public can insert fishing_catches" on fishing_catches
  for insert with check (true);
create policy "Public can update fishing_catches" on fishing_catches
  for update using (true);
create policy "Public can delete fishing_catches" on fishing_catches
  for delete using (true);

-- 5. Seed the original 7 spots from the family's handwritten list
insert into fishing_spots (name, species, notes) values
  ('Lazzaro', array['snook','tarpon'], ''),
  ('Flamingo Rd mini lake', array['bass','mich blue gill','native snakehead'], ''),
  ('Little Columbia spot', array['big bass','peacock bass'], 'Good peacock bass'),
  ('Snake head spot', array['snakehead','tilapia','bass','mian snook','carp'], ''),
  ('Other side of snake head spot', array['bass','peacock bass','mich'], ''),
  ('Bonaventure golf club - mian', array['bluegill','bass','snakehead'], ''),
  ('Weston hills', array['big bass','big snakehead','big peacock bass'], '');

-- Note: run the storage bucket setup separately in the Dashboard UI
-- (Storage > New bucket > name it "catch-photos", make it public)
-- since bucket creation isn't always available via plain SQL on all plans.
