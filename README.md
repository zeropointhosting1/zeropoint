# ZeroPoint Lab Docs

Self-hosted infrastructure documentation for a home network/server lab —
inventory, IPAM, topology, runbooks and a change log. Everything is entered
manually; this is documentation, not monitoring, and it never stores
credentials, API keys or secrets.

**Public read, authenticated write.** This is meant to be published as a
homelab devlog anyone can browse — device inventory, VLANs, IPs, topology —
while only signed-in accounts (you) can add or edit anything. `/settings`
is the one page that still requires sign-in. Be aware that means your
network layout, device models, and internal IP scheme are visible to
whoever finds the URL; that's a deliberate trade-off for a public devlog,
not an oversight — if you ever want something private, keep it out of the
app (e.g. in a note you don't publish, or just don't document it here).

Status: **Phase 1** complete — app shell, auth, full database schema,
Overview, Devices, Virtual Machines, Services, VLANs. Rack, Network
Topology, Connections, IPAM, Runbooks, Change Log and Notes have their
tables ready but no UI yet (Phases 2–4).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui
- Self-hosted Supabase (Postgres + Auth + PostgREST + Studio) via Docker Compose
- All Supabase access happens server-side (Server Components / Server
  Actions) — no Supabase client or key ever ships to the browser

## Local development

1. Install Docker and Node 20.9+ (this repo was built against Node 26).
2. Generate secrets:
   ```
   node scripts/generate-keys.mjs
   ```
   Copy `.env.example` to `.env` and fill in the four generated values plus
   `SITE_URL` (e.g. `http://localhost:3000` for local dev).
3. Start the stack:
   ```
   cd docker
   docker compose up -d
   ```
4. Create the first user (becomes admin automatically — public sign-up is
   disabled):
   ```
   SUPABASE_URL=http://localhost:8000 \
   SUPABASE_SERVICE_ROLE_KEY=<from .env> \
   node scripts/create-admin.mjs you@example.com 'a-strong-password'
   ```
5. Visit `http://localhost:3000` and sign in.

To iterate on the Next.js app outside Docker (faster refresh), run
`npm run dev` inside `app/` with `SUPABASE_URL`, `SUPABASE_ANON_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` set in your shell/`.env.local`, while the
`db`/`auth`/`rest`/`kong` services from `docker compose` keep running.

## Deploying to the lab (Ubuntu VM)

Same steps as local development, run on the VM. Change `SITE_URL` and
`SUPABASE_PUBLIC_URL` in `.env` to the VM's address. Only the `app` service
(`APP_PORT`, default 3000) is published; Postgres, Auth, PostgREST and
Studio stay on the internal Docker network or loopback-only (see
`docker/docker-compose.yml` for the reasoning). Reach Studio via
`ssh -L 8000:localhost:8000 <vm>` if you need to browse the database directly.

### Actually putting it on the public internet

The compose file gets you a server listening on `APP_PORT` — it does not
add TLS or a domain. Before pointing a real domain at it:

- Put a reverse proxy (Caddy is the easiest — automatic HTTPS) in front of
  the `app` service; don't expose `APP_PORT` directly to the internet.
- Set `SITE_URL` and `GOTRUE_URI_ALLOW_LIST` to your real `https://` domain
  — GoTrue rejects auth flows that don't match.
- Regenerate `.env` secrets from scratch for the real deployment (don't
  reuse anything generated while testing locally).
- Keep Kong/Studio (port 8000) loopback-only or behind the VPN/SSH tunnel
  as configured — never put it on the reverse proxy alongside the app.

## Repository layout

```
app/                  Next.js application
  app/                routes (App Router)
  components/          UI components (components/ui = shadcn primitives)
  lib/
    actions/           Server Actions (all writes go through these)
    supabase/          server/admin Supabase clients + auth middleware
    types/              hand-written DB types (mirrors the schema)
    validations/        zod schemas per entity
supabase/
  migrations/          SQL schema + RLS, applied in order
  seed.sql             optional starter data
docker/
  docker-compose.yml    self-hosted Supabase + the app
  volumes/              Kong config, DB init script
scripts/
  generate-keys.mjs     derive POSTGRES_PASSWORD/JWT_SECRET/ANON_KEY/SERVICE_ROLE_KEY
  create-admin.mjs      create a user (bypasses disabled public sign-up)
```

## Permissions

Three roles: `admin`, `editor`, `viewer`. Reads are public (signed in or
not); `admin`/`editor` can write, `viewer` is read-only even signed in. The
first user ever created is auto-promoted to `admin`; an admin can change
other users' roles from Settings. Enforced by Postgres RLS policies, not
just the UI — confirmed by testing an anonymous write directly against
PostgREST, which is correctly rejected with a 401.
