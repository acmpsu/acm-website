-- Run after supabase/schema.sql. Re-runnable, additive migration.
-- A self-update policy is not a column permission: prevent self-promotion.
revoke update on public.profiles from public, anon, authenticated;
grant update (full_name, major, grad_year) on public.profiles to authenticated;

create table if not exists public.officer_agent_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles on delete cascade,
  label text not null check (length(trim(label)) between 1 and 80),
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  revoked_at timestamptz,
  check (expires_at > created_at and expires_at <= created_at + interval '31 days')
);
alter table public.officer_agent_tokens enable row level security;
revoke all on public.officer_agent_tokens from public, anon, authenticated;
grant select (id, profile_id, label, created_at, expires_at, revoked_at)
  on public.officer_agent_tokens to authenticated;
grant insert (profile_id, label, token_hash) on public.officer_agent_tokens to authenticated;
grant update (revoked_at) on public.officer_agent_tokens to authenticated;
drop policy if exists "officers read own tokens" on public.officer_agent_tokens;
create policy "officers read own tokens" on public.officer_agent_tokens for select to authenticated
  using (profile_id = auth.uid() and public.is_officer());
drop policy if exists "officers issue own tokens" on public.officer_agent_tokens;
create policy "officers issue own tokens" on public.officer_agent_tokens for insert to authenticated
  with check (profile_id = auth.uid() and public.is_officer());
drop policy if exists "officers revoke own tokens" on public.officer_agent_tokens;
create policy "officers revoke own tokens" on public.officer_agent_tokens for update to authenticated
  using (profile_id = auth.uid() and public.is_officer())
  with check (profile_id = auth.uid() and public.is_officer() and revoked_at is not null);

-- Records the original payload to reject accidental request-ID reuse. Never public.
create table if not exists public.agent_event_requests (
  token_id uuid not null references public.officer_agent_tokens on delete cascade,
  request_id uuid not null,
  event_id uuid not null references public.events on delete cascade,
  payload jsonb not null,
  primary key (token_id, request_id)
);
alter table public.agent_event_requests enable row level security;
revoke all on public.agent_event_requests from public, anon, authenticated;

-- Internal helper. Lock the token so revocation and creation serialize; recheck
-- current officer status on EVERY operation, including retries.
create or replace function public.require_agent_token(p_token text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare token_id uuid;
begin
  select t.id into token_id from public.officer_agent_tokens t
  join public.profiles p on p.id = t.profile_id
  where t.token_hash = pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token, 'UTF8')), 'hex') and t.revoked_at is null
    and t.expires_at > now() and p.is_officer
  for update of t;
  if token_id is null then raise exception using errcode = 'PT401', message = 'Unauthorized'; end if;
  return token_id;
end;
$$;
revoke all on function public.require_agent_token(text) from public, anon, authenticated;

create or replace function public.verify_agent_token(p_token text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  perform public.require_agent_token(p_token);
  return true;
end;
$$;
revoke all on function public.verify_agent_token(text) from public;
grant execute on function public.verify_agent_token(text) to anon, authenticated;

create or replace function public.agent_list_events(p_token text, p_from timestamptz, p_until timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  perform public.require_agent_token(p_token);
  if p_from is null or p_until is null or p_until <= p_from or p_until - p_from > interval '93 days' then
    raise exception using errcode = 'PT400', message = 'Invalid date range';
  end if;
  select coalesce(jsonb_agg(to_jsonb(e) order by e.starts_at, e.id), '[]'::jsonb) into result
  from (select id, title, starts_at, ends_at, location, category, committee_id
    from public.events where starts_at >= p_from and starts_at < p_until
    order by starts_at, id limit 100) e;
  return result;
end;
$$;
revoke all on function public.agent_list_events(text, timestamptz, timestamptz) from public;
grant execute on function public.agent_list_events(text, timestamptz, timestamptz) to anon, authenticated;

create or replace function public.agent_create_event(p_token text, p_event jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_token_id uuid;
  previous public.agent_event_requests%rowtype;
  target public.events%rowtype;
  v_request_id uuid;
  start_time timestamptz;
  end_time timestamptz;
begin
  v_token_id := public.require_agent_token(p_token);
  if p_event is null or jsonb_typeof(p_event) <> 'object' then
    raise exception using errcode = 'PT400', message = 'Invalid event';
  end if;
  begin
    v_request_id := (p_event ->> 'request_id')::uuid;
    start_time := (p_event ->> 'starts_at')::timestamptz;
    end_time := (p_event ->> 'ends_at')::timestamptz;
  exception when invalid_text_representation or invalid_datetime_format or datetime_field_overflow then
    raise exception using errcode = 'PT400', message = 'Invalid event dates or request ID';
  end;
  if v_request_id is null or start_time is null or not isfinite(start_time)
    or (end_time is not null and (not isfinite(end_time) or end_time <= start_time))
    or coalesce(length(trim(p_event ->> 'title')), 0) not between 1 and 160
    or coalesce(length(p_event ->> 'location'), 0) > 240
    or coalesce(p_event ->> 'checkin_code', '') !~ '^[a-zA-Z0-9-]{4,64}$'
    or (p_event ->> 'category' is not null and p_event ->> 'category' not in ('workshop', 'social', 'gbm'))
    or (p_event ->> 'committee_id' is not null and p_event ->> 'committee_id' not in
      ('acm-icpc', 'acm-web', 'acm-ai', 'acm-hack', 'acm-data', 'acm-quantum')) then
    raise exception using errcode = 'PT400', message = 'Invalid event fields';
  end if;

  select * into previous from public.agent_event_requests r
    where r.token_id = v_token_id and r.request_id = v_request_id;
  if found then
    if previous.payload <> p_event then
      raise exception using errcode = 'PT409', message = 'Request ID already used for different event';
    end if;
    select * into target from public.events where id = previous.event_id;
    return jsonb_build_object('event', to_jsonb(target) - 'checkin_code', 'created', false);
  end if;

  begin
    insert into public.events (title, starts_at, ends_at, location, category, committee_id, checkin_code)
    values (trim(p_event ->> 'title'), start_time, end_time, p_event ->> 'location',
      p_event ->> 'category', p_event ->> 'committee_id', p_event ->> 'checkin_code') returning * into target;
  exception when unique_violation then
    raise exception using errcode = 'PT409', message = 'Check-in code already used';
  end;
  insert into public.agent_event_requests values (v_token_id, v_request_id, target.id, p_event);
  return jsonb_build_object('event', to_jsonb(target) - 'checkin_code', 'created', true);
end;
$$;
revoke all on function public.agent_create_event(text, jsonb) from public;
grant execute on function public.agent_create_event(text, jsonb) to anon, authenticated;

-- Existing public RLS allows selecting event rows. Restrict the column grants so
-- check-in codes cannot be read directly through the public Supabase REST API.
revoke select on public.events from public, anon, authenticated;
grant select (id, title, starts_at, ends_at, location, category, committee_id, created_at)
  on public.events to anon, authenticated;
