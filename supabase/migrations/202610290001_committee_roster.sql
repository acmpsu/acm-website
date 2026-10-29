-- Committee roster from the 2026–27 Figma: Hackathon (acm-hack) is retired and
-- Dev (acm-dev) joins. Keep this list in sync with COMMITTEES in src/lib/constants.ts.
-- Existing acm-hack memberships and event tags are left in place.

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
      ('acm-icpc', 'acm-web', 'acm-ai', 'acm-quantum', 'acm-dev', 'acm-data')) then
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
