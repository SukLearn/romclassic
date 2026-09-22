# Furniture Shop Inventory

## Start on Windows

1. Install Docker Desktop and enable **Start Docker Desktop when you log in**.
2. Copy `.env.example` to `.env`, replace passwords and `JWT_SECRET`.
3. Run `docker compose up -d --build` once. Containers use `restart: unless-stopped`, so they return after Docker Desktop starts.
4. Open `http://localhost:3000` (or `http://<laptop-ip>:3000` on the shop LAN). Keep Windows Firewall's private-network prompt enabled.

For an installation created before named-volume database storage was added, run this once instead:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\migrate-postgres-storage.ps1
```

The script creates a logical backup, stops PostgreSQL cleanly, copies the existing `data/postgres` cluster into the Docker named volume, enables page checksums, restarts the application, and verifies the database and latest backup. If PostgreSQL cannot start to make a new backup, first confirm that a completed backup exists in `data/backups`, then run the script with `-SkipBackup`.

## Data and backups

The live PostgreSQL cluster is stored in the Docker named volume `romclassic_postgres_data`. Keeping live relation files out of the Windows filesystem avoids file-locking and permission failures after a reboot. Uploaded files remain in `data/uploads`. The legacy `data/postgres` directory is retained as a migration source and can be archived after the migration has been verified.

The `backup` container starts with the application and stores portable logical backups in `data/backups`:

- Weekly on Wednesday.
- Monthly on the first day of the month.
- Yearly on December 31.
- At startup when the last successful backup is more than seven days old or no backup exists.
- Hourly stale checks create a catch-up backup if a scheduled run was missed.

Each atomic backup directory contains `database.dump`, `uploads.tar.gz`, `SHA256SUMS`, and `manifest.txt`. A dump must be readable by `pg_restore` before it is marked successful. Incomplete `.part` directories are never considered successful backups. Backup history is retained until an administrator removes it.

Run a manual backup with `powershell -ExecutionPolicy Bypass -File .\scripts\backup.ps1`.

Run a database, index, container, and latest-backup check with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\check-database.ps1
```

To restore, stop the application services, validate `SHA256SUMS`, extract `uploads.tar.gz` into `data/uploads`, start PostgreSQL, copy or mount `database.dump` into the PostgreSQL container, and run `pg_restore -U inventory -d furniture_inventory --clean --if-exists --exit-on-error database.dump`. Test restoration on a separate named volume before replacing live data.

## Architecture

Express owns validation, RBAC and transactional inventory operations; React is only the UI. Versioned PostgreSQL migrations run automatically at backend startup for both new and existing databases. API reference is in `backend/API.md`.
