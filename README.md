# Furniture Shop Inventory

## Start on Windows

1. Install Docker Desktop and enable **Start Docker Desktop when you log in**.
2. Copy `.env.example` to `.env`, replace passwords and `JWT_SECRET`.
3. Run `docker compose up -d --build` once. Containers use `restart: unless-stopped`, so they return after Docker Desktop starts.
4. Open `http://localhost:3000` (or `http://<laptop-ip>:3000` on the shop LAN). Keep Windows Firewall's private-network prompt enabled.

After every update (`git pull`), run `docker compose up -d --build` again. Without `--build` the containers keep running the previously built code, and new database migrations are not applied.

`POSTGRES_PASSWORD` is applied only when PostgreSQL creates an empty data volume. Changing it in `.env` later does not change the database password; see Troubleshooting.

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

## Troubleshooting

**The backend keeps restarting and `docker compose logs backend` shows `password authentication failed for user "inventory"` (code `28P01`).** The password stored in the database volume no longer matches `POSTGRES_PASSWORD` in `.env`. This happens when `.env` is recreated or edited after the volume was created, or when the volume was filled from a cluster created with a different `.env` (`data/postgres`, a restore, another computer). The postgres container still reports healthy because its healthcheck uses the local socket, and the frontend never starts because it waits for a healthy backend. Scheduled backups fail too (empty `.part` directories in `data/backups`).

Re-apply the password from `.env` (no table data is changed):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-postgres-password.ps1
```

On Linux or macOS run `sh scripts/sync-postgres-password.sh`. `scripts/check-database.ps1` also verifies this password login.

## Local development without Docker

- Backend: `cd backend && npm ci`, then start it with a reachable database, for example `DATABASE_URL=postgres://user:password@127.0.0.1:5432/furniture_inventory npm run dev`. The backend does not read the project-root `.env` (that file configures Docker Compose); outside Docker it uses `DATABASE_URL` or the standard `PG*` variables.
- Frontend: `cd frontend && npm ci && npm run dev`. The Vite dev server forwards `/api` and `/uploads` to `http://127.0.0.1:4000`; set `VITE_API_PROXY_TARGET` to use another backend address.
- Tests: `npm test` in `backend` runs the unit tests. The API integration tests also run when `TEST_DATABASE_URL` points to a disposable PostgreSQL database whose name contains `test` (instructions at the top of `backend/src/api.integration.test.ts`). `npm test` in `frontend` type-checks the UI.

## Architecture

Express owns validation, RBAC and transactional inventory operations; React is only the UI. Versioned PostgreSQL migrations run automatically at backend startup for both new and existing databases. API reference is in `backend/API.md`.
