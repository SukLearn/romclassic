#!/bin/sh

set -eu

legacy_dir="${LEGACY_POSTGRES_DIR:-/legacy-postgres}"
target_dir="${POSTGRES_DATA_DIR:-/var/lib/postgresql/data}"
supported_major="16"

log() {
  printf '%s\n' "$*"
}

enable_checksums() {
  cluster_state="$(pg_controldata "$target_dir" 2>/dev/null | sed -n 's/^Database cluster state:[[:space:]]*//p')"
  if [ "$cluster_state" != "shut down" ] && [ "$cluster_state" != "shut down in recovery" ]; then
    log "PostgreSQL checksums remain unchanged because the cluster requires crash recovery first."
    return 0
  fi

  checksum_version="$(pg_controldata "$target_dir" 2>/dev/null | sed -n 's/^Data page checksum version:[[:space:]]*//p')"
  if [ "$checksum_version" != "0" ]; then
    log "PostgreSQL data checksums are already enabled."
    return 0
  fi

  log "Enabling PostgreSQL data checksums on the offline cluster."
  chown -R postgres:postgres "$target_dir"
  su-exec postgres pg_checksums --enable -D "$target_dir"
}

if [ -f "$target_dir/PG_VERSION" ]; then
  if [ "${ENABLE_CHECKSUMS_ONLY:-0}" = "1" ]; then
    enable_checksums
    exit 0
  fi
  log "PostgreSQL named volume is already initialized."
  exit 0
fi

if [ ! -f "$legacy_dir/PG_VERSION" ]; then
  log "No legacy PostgreSQL cluster was found; PostgreSQL will initialize a new named volume."
  exit 0
fi

legacy_major="$(tr -d '[:space:]' < "$legacy_dir/PG_VERSION")"
if [ "$legacy_major" != "$supported_major" ]; then
  log "Legacy PostgreSQL major version '$legacy_major' cannot be copied into PostgreSQL $supported_major."
  log "Use pg_dump/pg_restore to upgrade across PostgreSQL major versions."
  exit 1
fi

target_entry="$(find "$target_dir" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null || true)"
if [ -n "$target_entry" ]; then
  log "The PostgreSQL named volume is partially initialized; refusing to overwrite it."
  exit 1
fi

cluster_state="$(pg_controldata "$legacy_dir" 2>/dev/null | sed -n 's/^Database cluster state:[[:space:]]*//p')"
case "$cluster_state" in
  "shut down" | "shut down in recovery") ;;
  *)
    if [ "${ALLOW_CRASH_RECOVERY_COPY:-0}" != "1" ]; then
      log "Legacy PostgreSQL cluster state is '${cluster_state:-unknown}'."
      log "Run scripts/migrate-postgres-storage.ps1 so the old container is stopped before copying data."
      exit 1
    fi
    log "Copying a stopped cluster that requires PostgreSQL crash recovery."
    ;;
esac

log "Copying the legacy PostgreSQL cluster into the Docker named volume."
cp -a "$legacy_dir/." "$target_dir/"
rm -f "$target_dir/postmaster.pid"
chown -R postgres:postgres "$target_dir"
chmod 700 "$target_dir"
sync

if [ ! -f "$target_dir/PG_VERSION" ] || [ ! -f "$target_dir/global/pg_control" ]; then
  log "PostgreSQL data copy did not pass validation."
  exit 1
fi

enable_checksums
log "Legacy PostgreSQL cluster copied successfully."
