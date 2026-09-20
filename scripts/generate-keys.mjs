#!/usr/bin/env node
// Generates POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY and SERVICE_ROLE_KEY for
// a fresh self-hosted Supabase deployment. No dependencies — HS256 JWTs are
// signed by hand with Node's built-in crypto.
//
// Usage: node scripts/generate-keys.mjs > .env.generated
// Then merge the values into your .env (see .env.example).

import { randomBytes, createHmac } from "node:crypto";

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signJwt(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const jwtSecret = randomBytes(32).toString("hex");
const postgresPassword = randomBytes(24).toString("base64url");

const issuedAt = Math.floor(Date.now() / 1000);
const tenYears = 10 * 365 * 24 * 60 * 60;

const anonKey = signJwt(
  { role: "anon", iss: "supabase", iat: issuedAt, exp: issuedAt + tenYears },
  jwtSecret
);
const serviceRoleKey = signJwt(
  {
    role: "service_role",
    iss: "supabase",
    iat: issuedAt,
    exp: issuedAt + tenYears,
  },
  jwtSecret
);

console.log(`POSTGRES_PASSWORD=${postgresPassword}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`ANON_KEY=${anonKey}`);
console.log(`SERVICE_ROLE_KEY=${serviceRoleKey}`);
