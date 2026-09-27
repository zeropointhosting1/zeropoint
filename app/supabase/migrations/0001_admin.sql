-- Admin dashboard schema: leads inbox, live chat, and client uptime
-- monitoring. Apply against the Supabase project referenced by
-- NEXT_PUBLIC_SUPABASE_URL (Dashboard SQL editor, or `supabase db push`
-- once `supabase link` is run from app/) — this repo has no way to run it
-- for you since the app is a static export with no server-side access to
-- your project credentials.
--
-- After applying:
--   1. Create your own user (Dashboard -> Authentication -> Add user).
--   2. insert into public.admins (id, email) values ('<that user's uuid>', 'you@example.com');
--   3. Dashboard -> Database -> Replication -> confirm chat_messages is
--      enabled for realtime (the `alter publication` below does this, but
--      some projects need it re-confirmed in the UI after first apply).

create extension if not exists "pgcrypto";

-- ==================================================
-- ADMINS
-- ==================================================
-- Membership is managed by hand via the SQL editor (see step 2 above) --
-- there's exactly one admin (you) today, so no self-serve UI for this.

create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy admins_select_self on public.admins
  for select to authenticated using (auth.uid() = id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ==================================================
-- LEADS  (Contact + Estimate form submissions)
-- ==================================================

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact', 'estimate')),
  name text not null,
  email text not null,
  message text not null,
  help text,
  details jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Public forms submit with no session — anon and authenticated can insert,
-- nobody but an admin can read, update, or delete.
create policy leads_insert on public.leads
  for insert to anon, authenticated with check (true);

create policy leads_admin_all on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ==================================================
-- LIVE CHAT
-- ==================================================
-- Visitors sign in anonymously (supabase.auth.signInAnonymously()) before
-- their first message — that still yields a real `authenticated` JWT with
-- a stable auth.uid(), just no email/password, which is what lets RLS scope
-- a conversation to "whoever started it" without any visitor-facing login.

create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references auth.users (id) on delete cascade,
  visitor_name text,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

create policy chat_conversations_visitor on public.chat_conversations
  for all to authenticated
  using (auth.uid() = visitor_id or public.is_admin())
  with check (auth.uid() = visitor_id or public.is_admin());

create policy chat_messages_visitor on public.chat_messages
  for all to authenticated
  using (
    public.is_admin()
    or conversation_id in (select id from public.chat_conversations where visitor_id = auth.uid())
  )
  with check (
    (sender = 'admin' and public.is_admin())
    or (sender = 'visitor' and conversation_id in (
      select id from public.chat_conversations where visitor_id = auth.uid()
    ))
  );

-- Bumping last_message_at on every insert is what the admin console's
-- conversation list sorts/unread-badges by.
create or replace function public.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

create trigger chat_messages_touch_conversation
  after insert on public.chat_messages
  for each row execute function public.touch_conversation();

alter publication supabase_realtime add table public.chat_messages;

-- ==================================================
-- CLIENTS + UPTIME CHECKS
-- ==================================================
-- No visitor access at all here. client_checks is written by the
-- scheduled GitHub Actions job using the service-role key, which bypasses
-- RLS entirely — the admin-only policy below is for the dashboard's own
-- reads/writes (adding/editing a client), not the checker.

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  site_url text not null,
  notes text,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  last_status text not null default 'unknown' check (last_status in ('up', 'down', 'unknown')),
  last_checked_at timestamptz,
  last_response_ms integer,
  created_at timestamptz not null default now()
);

create table public.client_checks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  checked_at timestamptz not null default now(),
  is_up boolean not null,
  status_code integer,
  response_ms integer,
  error text
);

alter table public.clients enable row level security;
alter table public.client_checks enable row level security;

create policy clients_admin_all on public.clients
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy client_checks_admin_all on public.client_checks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create index client_checks_client_id_checked_at_idx on public.client_checks (client_id, checked_at desc);
