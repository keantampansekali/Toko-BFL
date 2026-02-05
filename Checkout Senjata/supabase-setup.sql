-- Setup Supabase Database untuk WARUNG BEEPEL
-- Jalankan script ini di SQL Editor di Supabase Dashboard

-- 1. Create users table
create table if not exists users (
  id bigint primary key generated always as identity,
  username text unique not null,
  password text not null,
  role text not null default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create checkouts table
create table if not exists checkouts (
  id bigint primary key generated always as identity,
  checkout_id bigint not null,
  username text not null,
  items jsonb not null,
  total numeric not null,
  date text not null,
  prepared boolean not null default false,
  prepared_by text,
  prepared_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Insert default admin user
insert into users (username, password, role)
values ('admin', 'admin123', 'king')
on conflict (username) do nothing;

-- 3b. Inventory / Stock table
create table if not exists inventory (
  id bigint primary key generated always as identity,
  product_name text unique not null,
  stock integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table users enable row level security;
alter table checkouts enable row level security;
alter table inventory enable row level security;

-- 4b. Ensure new column exists when re-running on an existing project
alter table public.checkouts add column if not exists prepared boolean not null default false;
alter table public.checkouts add column if not exists prepared_by text;
alter table public.checkouts add column if not exists prepared_at timestamp with time zone;

-- 4c. Ensure inventory columns exist on re-run
alter table public.inventory add column if not exists product_name text;
alter table public.inventory add column if not exists stock integer;
alter table public.inventory add column if not exists updated_at timestamp with time zone;

-- Keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inventory_touch on public.inventory;
create trigger trg_inventory_touch
before update on public.inventory
for each row execute function public.touch_updated_at();

-- 5. Drop existing policies if they exist (to avoid errors on re-run)
drop policy if exists "public can read users" on public.users;
drop policy if exists "public can insert users" on public.users;
drop policy if exists "public can update users" on public.users;
drop policy if exists "users can update own data" on public.users;
drop policy if exists "admin can update users" on public.users;
drop policy if exists "admin can delete users" on public.users;

-- 6. Create policies for users table
-- Allow anonymous users to read users (for login/registration)
create policy "public can read users"
on public.users
for select
to anon, authenticated
using (true);

-- Allow anonymous users to insert users (for registration)
create policy "public can insert users"
on public.users
for insert
to anon, authenticated
with check (true);

-- Allow anonymous users to update users (needed because this app uses anon key, not Supabase Auth)
-- NOTE: This is NOT secure for real production. For production, use Supabase Auth and stricter RLS.
create policy "public can update users"
on public.users
for update
to anon, authenticated
using (true)
with check (true);

-- Inventory policies (app uses anon key, so allow read/update for simplicity)
drop policy if exists "public can read inventory" on public.inventory;
drop policy if exists "public can upsert inventory" on public.inventory;

create policy "public can read inventory"
on public.inventory
for select
to anon, authenticated
using (true);

create policy "public can upsert inventory"
on public.inventory
for insert
to anon, authenticated
with check (true);

create policy "public can update inventory"
on public.inventory
for update
to anon, authenticated
using (true)
with check (true);

-- Allow authenticated users to update their own data
create policy "users can update own data"
on public.users
for update
to authenticated
using (auth.uid()::text = id::text);

-- Allow admin to update any user
create policy "admin can update users"
on public.users
for update
to authenticated
using (
  exists (
    select 1 from users
    where username = current_setting('request.jwt.claims', true)::json->>'username'
    and role = 'admin'
  )
);

-- Allow admin to delete users
create policy "admin can delete users"
on public.users
for delete
to authenticated
using (
  exists (
    select 1 from users
    where username = current_setting('request.jwt.claims', true)::json->>'username'
    and role = 'admin'
  )
);

-- 7. Drop existing policies for checkouts if they exist
drop policy if exists "public can read checkouts" on public.checkouts;
drop policy if exists "public can insert checkouts" on public.checkouts;
drop policy if exists "public can update checkouts" on public.checkouts;
drop policy if exists "users can read own checkouts" on public.checkouts;
drop policy if exists "admin can read all checkouts" on public.checkouts;
drop policy if exists "admin can delete checkouts" on public.checkouts;

-- 8. Create policies for checkouts table
-- Allow anonymous users to read checkouts
create policy "public can read checkouts"
on public.checkouts
for select
to anon, authenticated
using (true);

-- Allow anonymous users to insert checkouts
create policy "public can insert checkouts"
on public.checkouts
for insert
to anon, authenticated
with check (true);

-- Allow anonymous users to update checkouts (needed for toggling prepared status; app uses anon key)
-- NOTE: Not secure for real production. For production, use Supabase Auth and stricter RLS.
create policy "public can update checkouts"
on public.checkouts
for update
to anon, authenticated
using (true)
with check (true);

-- Allow users to read their own checkouts
create policy "users can read own checkouts"
on public.checkouts
for select
to authenticated
using (
  username = current_setting('request.jwt.claims', true)::json->>'username'
);

-- Allow admin to read all checkouts
create policy "admin can read all checkouts"
on public.checkouts
for select
to authenticated
using (
  exists (
    select 1 from users
    where username = current_setting('request.jwt.claims', true)::json->>'username'
    and role = 'admin'
  )
);

-- Allow admin to delete checkouts
create policy "admin can delete checkouts"
on public.checkouts
for delete
to authenticated
using (
  exists (
    select 1 from users
    where username = current_setting('request.jwt.claims', true)::json->>'username'
    and role = 'admin'
  )
);

-- 9. Create indexes for better performance
create index if not exists users_username_idx on users(username);
create index if not exists checkouts_username_idx on checkouts(username);
create index if not exists checkouts_checkout_id_idx on checkouts(checkout_id);
