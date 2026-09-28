-- Visitor context shown in the admin chat console: device/OS/browser are
-- parsed client-side from navigator.userAgent (no privacy tradeoff, see
-- app/lib/user-agent.ts) and sent with the conversation insert. `ip` is
-- filled in separately by the chat-capture-ip Edge Function, which is the
-- only place that can see the visitor's real request IP — deliberately
-- just the bare address, no geolocation lookup (no third party involved).

alter table public.chat_conversations
  add column device text,
  add column os text,
  add column browser text,
  add column ip text;
