#!/bin/sh
# Re-applies POSTGRES_PASSWORD from .env to the existing PostgreSQL role.
#
# PostgreSQL keeps the role password inside the data volume and reads
# POSTGRES_PASSWORD only when it initializes an empty volume. When .env is
# recreated or edited afterwards, or the volume is filled from a cluster that
# was created with another .env (data/postgres, a restore, another computer),
# the backend and backup services fail with
#   password authentication failed for user "inventory"   (SQLSTATE 28P01)
# while the postgres healthcheck still passes, because it uses the local socket.
#
# The ALTER ROLE statement runs over the container's local socket, which the
# official image trusts, so the old password is not needed. No table data is
# changed. Run from anywhere: sh scripts/sync-postgres-password.sh
set -eu

cd "$(dirname "$0")/.."

echo "Starting PostgreSQL with the current .env values..."
docker compose up -d --wait postgres

echo "Applying POSTGRES_PASSWORD from .env to the database role..."
docker compose exec -T postgres sh -ec \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -q' <<'SQL'
\getenv role POSTGRES_USER
\getenv password POSTGRES_PASSWORD
ALTER ROLE :"role" WITH PASSWORD :'password';
SQL

echo "Verifying a password login over the network, as the backend connects..."
docker compose run --rm --no-deps backup psql -v ON_ERROR_STOP=1 -tAc 'SELECT 1' >/dev/null

echo "Starting the remaining services..."
docker compose up -d

echo "Database password synchronized with .env."
