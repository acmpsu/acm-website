-- Penn State ACM — membership schema.
-- Run in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: policies are dropped and recreated.

-- ---------------------------------------------------------------------------
-- Profiles: one row per signed-in member, keyed to auth.users.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  email        text not null,
  full_name    text,
  major        text,
  grad_year    int,
  is_officer   boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Officer check MUST be SECURITY DEFINER: reading public.profiles from inside a
-- policy on public.profiles would re-trigger that policy and recurse forever
-- (Postgres error 42P17). SECURITY DEFINER runs as the owner and bypasses RLS.
create or replace function public.is_officer()
returns boolean language sql security definer stable set search_path = '' as $$
  select coalesce((select p.is_officer from public.profiles p where p.id = auth.uid()), false);
$$;

grant execute on function public.is_officer() to authenticated;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_officer());

drop policy if exists "officers read all profiles" on public.profiles;

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- `is_officer` is deliberately NOT self-assignable: promote officers by hand in
-- the Supabase table editor, or with
--   update public.profiles set is_officer = true where email = 'you@psu.edu';

-- Create the profile row automatically on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Committee membership. `committee_id` matches the ids in src/lib/constants.ts.
-- ---------------------------------------------------------------------------
create table if not exists public.committee_members (
  profile_id   uuid not null references public.profiles on delete cascade,
  committee_id text not null,
  joined_at    timestamptz not null default now(),
  primary key (profile_id, committee_id)
);

alter table public.committee_members enable row level security;

drop policy if exists "read own committees" on public.committee_members;
create policy "read own committees" on public.committee_members
  for select using (auth.uid() = profile_id or public.is_officer());

drop policy if exists "officers read all committees" on public.committee_members;

drop policy if exists "join committees" on public.committee_members;
create policy "join committees" on public.committee_members
  for insert with check (auth.uid() = profile_id);

drop policy if exists "leave committees" on public.committee_members;
create policy "leave committees" on public.committee_members
  for delete using (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- Events and check-in. Members check in with the code announced at the event.
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  starts_at    timestamptz not null,
  location     text,
  committee_id text,
  checkin_code text not null unique,
  created_at   timestamptz not null default now()
);

alter table public.events enable row level security;

-- Any signed-in member can see the event list; only officers manage it.
drop policy if exists "members read events" on public.events;
create policy "members read events" on public.events
  for select using (auth.uid() is not null);

drop policy if exists "officers manage events" on public.events;
create policy "officers manage events" on public.events
  for all using (public.is_officer()) with check (public.is_officer());

create table if not exists public.attendance (
  profile_id    uuid not null references public.profiles on delete cascade,
  event_id      uuid not null references public.events on delete cascade,
  checked_in_at timestamptz not null default now(),
  primary key (profile_id, event_id)
);

alter table public.attendance enable row level security;

drop policy if exists "read own attendance" on public.attendance;
create policy "read own attendance" on public.attendance
  for select using (auth.uid() = profile_id or public.is_officer());

drop policy if exists "officers read all attendance" on public.attendance;

drop policy if exists "check in as self" on public.attendance;
create policy "check in as self" on public.attendance
  for insert with check (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- Check-in by code. SECURITY DEFINER so the code can be validated without
-- exposing every event's code to the client.
-- ---------------------------------------------------------------------------
create or replace function public.check_in(code text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  target public.events%rowtype;
begin
  if auth.uid() is null then
    return 'Not signed in';
  end if;

  select * into target from public.events e where lower(e.checkin_code) = lower(trim(code));

  if not found then
    return 'No event matches that code';
  end if;

  insert into public.attendance (profile_id, event_id)
  values (auth.uid(), target.id)
  on conflict do nothing;

  return 'Checked in to ' || target.title;
end;
$$;

grant execute on function public.check_in(text) to authenticated;
