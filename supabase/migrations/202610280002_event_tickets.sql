-- Apply after schema.sql and 202610280001_officer_event_mcp.sql.
alter table public.profiles add column if not exists membership_number bigint generated always as identity;
create unique index if not exists profiles_membership_number_key on public.profiles(membership_number);

alter table public.events add column if not exists description text;
alter table public.events add column if not exists rsvp_enabled boolean not null default true;
alter table public.events add column if not exists rsvp_closes_at timestamptz;
alter table public.events add column if not exists capacity integer;
alter table public.events drop constraint if exists events_description_check;
alter table public.events add constraint events_description_check check (description is null or length(description) <= 2000);
alter table public.events drop constraint if exists events_capacity_check;
alter table public.events add constraint events_capacity_check check (capacity is null or capacity between 1 and 100000);
alter table public.events drop constraint if exists events_rsvp_close_check;
alter table public.events add constraint events_rsvp_close_check check (rsvp_closes_at is null or rsvp_closes_at <= starts_at);
grant select(description, rsvp_enabled, rsvp_closes_at, capacity) on public.events to anon, authenticated;

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  ticket_number bigint generated always as identity unique,
  profile_id uuid not null references public.profiles on delete cascade,
  event_id uuid not null references public.events on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  issued_at timestamptz not null default now(),
  cancelled_at timestamptz,
  unique(profile_id, event_id)
);
create index if not exists registrations_event_status_idx on public.event_registrations(event_id, status);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from public, anon, authenticated;
grant select on public.event_registrations to authenticated;
drop policy if exists "members read only their own tickets" on public.event_registrations;
create policy "members read only their own tickets" on public.event_registrations for select to authenticated
  using (profile_id = auth.uid());
-- No direct writes: RPCs enforce ownership, capacity and the RSVP lifecycle.

create or replace function public.rsvp_for_event(p_event_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_event public.events%rowtype; v_ticket public.event_registrations%rowtype;
begin
  if auth.uid() is null then raise exception using errcode = 'PT401', message = 'Sign in to RSVP'; end if;
  if not exists(select 1 from public.profiles where id = auth.uid()) then
    raise exception using errcode = 'PT404', message = 'Membership profile not found';
  end if;
  -- Consistent event-first locking serializes capacity checks and cancellations.
  select * into v_event from public.events where id = p_event_id for update;
  if not found then raise exception using errcode = 'PT404', message = 'Event not found'; end if;
  select * into v_ticket from public.event_registrations where profile_id = auth.uid() and event_id = p_event_id;
  -- A successful retry still returns its original ticket after registration closes.
  if found and v_ticket.status = 'confirmed' then return v_ticket.id; end if;
  if not v_event.rsvp_enabled or now() >= coalesce(v_event.rsvp_closes_at, v_event.starts_at) then
    raise exception using errcode = 'PT409', message = 'Registration is closed';
  end if;
  if v_event.capacity is not null and (select count(*) from public.event_registrations where event_id = p_event_id and status = 'confirmed') >= v_event.capacity then
    raise exception using errcode = 'PT409', message = 'This event is full';
  end if;
  insert into public.event_registrations(profile_id, event_id) values(auth.uid(), p_event_id)
  on conflict(profile_id, event_id) do update set status = 'confirmed', cancelled_at = null,
    issued_at = now() returning * into v_ticket;
  return v_ticket.id;
end;
$$;
revoke all on function public.rsvp_for_event(uuid) from public;
grant execute on function public.rsvp_for_event(uuid) to authenticated;

create or replace function public.cancel_event_rsvp(p_ticket_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_event_id uuid; v_starts_at timestamptz; v_ticket public.event_registrations%rowtype;
begin
  if auth.uid() is null then raise exception using errcode = 'PT401', message = 'Sign in to manage your ticket'; end if;
  select event_id into v_event_id from public.event_registrations where id = p_ticket_id and profile_id = auth.uid();
  if not found then raise exception using errcode = 'PT404', message = 'Ticket not found'; end if;
  select starts_at into v_starts_at from public.events where id = v_event_id for update;
  if not found then raise exception using errcode = 'PT404', message = 'Event not found'; end if;
  select * into v_ticket from public.event_registrations where id = p_ticket_id and profile_id = auth.uid() for update;
  if not found then raise exception using errcode = 'PT404', message = 'Ticket not found'; end if;
  if v_ticket.status = 'cancelled' then return true; end if;
  if now() >= v_starts_at then raise exception using errcode = 'PT409', message = 'This ticket can no longer be cancelled'; end if;
  update public.event_registrations set status = 'cancelled', cancelled_at = now() where id = p_ticket_id;
  return true;
end;
$$;
revoke all on function public.cancel_event_rsvp(uuid) from public;
grant execute on function public.cancel_event_rsvp(uuid) to authenticated;
