-- Sponsor inquiries from /sponsor (Figma "Sponsor inquiry / single contact panel", 494:193).
-- Anyone can submit; only officers can read. Safe to re-run.

create table if not exists public.sponsor_inquiries (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now(),
  constraint sponsor_inquiries_email_check
    check (length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint sponsor_inquiries_message_check
    check (length(btrim(message)) between 1 and 5000)
);

create index if not exists sponsor_inquiries_created_at_idx on public.sponsor_inquiries (created_at desc);

alter table public.sponsor_inquiries enable row level security;

drop policy if exists "anyone can submit sponsor inquiries" on public.sponsor_inquiries;
create policy "anyone can submit sponsor inquiries" on public.sponsor_inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "officers read sponsor inquiries" on public.sponsor_inquiries;
create policy "officers read sponsor inquiries" on public.sponsor_inquiries
  for select to authenticated using (public.is_officer());

-- Visitors may only insert these two columns; ids and timestamps come from defaults.
revoke all on public.sponsor_inquiries from public, anon, authenticated;
grant insert (email, message) on public.sponsor_inquiries to anon, authenticated;
grant select on public.sponsor_inquiries to authenticated;
