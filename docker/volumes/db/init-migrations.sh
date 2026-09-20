#!/bin/bash
# Applies supabase/migrations/*.sql in order on first container start.
# Runs after the image's own /docker-entrypoint-initdb.d/migrate.sh, which
# provisions the auth/storage/extensions schemas our schema depends on
# (this script's mounted name, zz-app-migrate.sh, sorts after migrate.sh).
# docker-entrypoint-initdb.d only runs top-level files, so this script
# walks the mounted app-migrations/ directory itself.
set -euo pipefail

# The base image creates authenticator/supabase_auth_admin (and friends)
# with NO password — the official self-hosted compose sets these via a
# rendered /etc/postgresql.schema.sql we don't have, so set them here
# instead. Add more roles to this list if a later phase brings in Storage,
# Edge Functions or the connection pooler.
psql -v ON_ERROR_STOP=1 --username supabase_admin --dbname "$POSTGRES_DB" <<-EOSQL
  ALTER USER authenticator WITH PASSWORD '$POSTGRES_PASSWORD';
  ALTER USER supabase_auth_admin WITH PASSWORD '$POSTGRES_PASSWORD';
EOSQL

for f in /docker-entrypoint-initdb.d/app-migrations/*.sql; do
  echo "Applying migration: $f"
  psql -v ON_ERROR_STOP=1 --username supabase_admin --dbname "$POSTGRES_DB" -f "$f"
done
