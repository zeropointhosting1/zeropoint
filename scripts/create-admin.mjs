#!/usr/bin/env node
// Creates the first (or an additional) user directly via the Supabase Auth
// admin API, bypassing public signup (which is disabled — see
// GOTRUE_DISABLE_SIGNUP in docker/docker-compose.yml). The first user ever
// created is auto-promoted to 'admin' by the handle_new_user() trigger.
//
// Usage:
//   SUPABASE_URL=http://localhost:8000 \
//   SUPABASE_SERVICE_ROLE_KEY=... \
//   node scripts/create-admin.mjs you@example.com 'a-strong-password'

const [, , email, password] = process.argv;
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}
if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment (see .env)."
  );
  process.exit(1);
}

const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  },
  body: JSON.stringify({ email, password, email_confirm: true }),
});

const body = await res.json();
if (!res.ok) {
  console.error("Failed to create user:", body);
  process.exit(1);
}

console.log(`Created user ${body.email} (${body.id}).`);
console.log(
  "If this was the first user created, their profile role is 'admin'."
);
