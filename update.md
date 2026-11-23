# Codebase Audit, Bug Fixes and Optimization — 2026-11-23

This report covers the technical audit of the furniture-shop inventory system: the local-only backend failure, the other bugs found, the optimizations made, how everything was tested, and what remains open. No secrets are reproduced here. Passwords were compared only by hash prefix.

---

## A. Project Overview

| Layer | Technology | Notes |
| --- | --- | --- |
| Backend | Node 22, Express 4, TypeScript, `pg`, `zod`, JWT (`jsonwebtoken`), `bcryptjs`, `multer` | One file holds the whole API (`backend/src/server.ts`, ~3,200 lines). All stock changes run in PostgreSQL transactions with row locks (`FOR UPDATE`). |
| Database | PostgreSQL 16 (Docker, `postgres:16-alpine`) | 27 versioned SQL migrations in `backend/migrations`, applied automatically at backend startup under an advisory lock (`backend/src/migrate.ts`). Triggers enforce case- and whitespace-insensitive unique product and supplier names. |
| Frontend | React 18, React Router 7, Vite 8, TypeScript | A single-page app (`frontend/src/main.tsx`) plus a DOM-level English/Georgian translation layer (`frontend/src/i18n.ts`). |
| Serving | nginx (frontend container) | Serves the built SPA and proxies `/api` and `/uploads` to `backend:4000`. |
| Operations | Docker Compose | Five services: `postgres-data-init`, `postgres`, `backend`, `backup`, `frontend`. A one-shot init container copies a legacy `data/postgres` cluster into the named volume `romclassic_postgres_data`. A backup daemon writes verified `pg_dump` archives to `data/backups`. Windows PowerShell scripts handle backup, health checks and storage migration. |

**Inventory model.** Products hold `current_quantity` and `reserved_quantity`. Per-warehouse stock (Showroom, Galovani, Isani) lives in `product_location_stock`. Every change writes a `stock_movements` row. Invoice provenance is tracked per batch and warehouse (`inventory_batches`, `inventory_batch_locations`) with FIFO consumption. Reservations (`inventory_reservations`) hold stock until they are completed (sold) or cancelled. Eligible movements can be reversed.

**Frontend–backend communication.** The browser calls relative `/api/...` URLs with a bearer token kept in `localStorage`. nginx proxies these in production. Errors use `{ error: { code, message } }`, and the UI shows the (translated) message.

**Tests before this work.** One backend unit-test file (6 tests for date, stock and invoice helpers). The frontend `test` script is only `tsc --noEmit`. There were no API or database tests.

---

## B. Bugs Discovered

| # | Problem | Root cause | Location | Impact | Fix |
|---|---|---|---|---|---|
| 1 | **Local backend crash loop; app unreachable** | The database role password differs from `POSTGRES_PASSWORD` in `.env` (see section C) | Local environment (`.env` vs. Docker volume) | Backend exits at startup (SQLSTATE `28P01`), the frontend never starts, scheduled backups fail | Password re-synchronized; new `scripts/sync-postgres-password.{sh,ps1}`; startup HINT; health-check coverage; README troubleshooting |
| 2 | Local containers ran outdated code | Images were built 13 minutes *before* the `git pull` of 2026-10-08 and never rebuilt | Local Docker images | Migration `026_activity_indexes.sql` was never applied; the running API differed from the source | Images rebuilt; README now says to run `--build` after every update |
| 3 | Invalid IDs, enum values or dates in query strings returned **500** and leaked PostgreSQL error codes | `productId`, `supplierId`, `categoryId`, `from` and `to` went to SQL unvalidated in two endpoints (all other endpoints validate them) | `GET /api/inventory/products`, `GET /api/inventory/movements` | 500 responses and server-log noise; internal `22P02` code exposed | Validated with the same `id`/`dateOnly` schemas used elsewhere; `22P02` now maps to 400 as a safety net |
| 4 | A very large quantity (e.g. 99,999,999,999) returned **500** | No upper bound below the PostgreSQL `integer` limit | Quantity schema (`positiveInteger`) | Unhandled exception (`22003`) | Limit of 2,147,483,647 with the message "Enter a smaller number"; `22003` maps to 400 |
| 5 | Blank category names (`"   "`) and whitespace duplicates (`" Beds "` next to `"Beds"`) were accepted | Category schemas used `z.string().min(1)` without `.trim()` (product and supplier schemas trim) | `POST` and `PATCH /api/categories` | Unusable or duplicate categories | Names are trimmed and must be non-blank; duplicates return "A category with this name already exists." |
| 6 | Creating or updating a product with a category or supplier that does not exist answered **409 "This record is still used by another part of the application"** | Every foreign-key violation (`23503`) was treated as "row is referenced" | Error handler | Misleading message (for example, after another user deleted the category) | Insert/update violations now return `400 REFERENCE_NOT_FOUND` ("A selected record no longer exists. Refresh the page and try again."); delete-side violations keep `409 RECORD_IN_USE` |
| 7 | Malformed JSON → `400` with code `SERVER_ERROR`; body over 1 MB → `413` with code `SERVER_ERROR` and an English parser message | Body-parser errors have `status`/`type` but no `code` | Error handler | Inconsistent API contract; untranslated messages | `400 VALIDATION` and `413 PAYLOAD_TOO_LARGE` with translatable messages |
| 8 | Unexpected 500 errors returned the raw PostgreSQL SQLSTATE as `code` | The handler used `e.code` for every error | Error handler | Internal detail leak | 500s now always return `SERVER_ERROR` |
| 9 | A failed `ROLLBACK` hid the original error and returned a broken connection to the pool | `tx()` awaited `ROLLBACK` without its own error handling and always called `release()` normally | `backend/src/db.ts` | On a dropped connection, misleading errors plus a bad pooled client for later requests | The original error is always rethrown; a client whose rollback failed is destroyed (`release(err)`) |
| 10 | Sorting most numeric and date columns did nothing or gave the wrong order | The table sorted by rendered output: React elements (`<StockValue>`, `<StatusValue>`) sorted as `""`, and dates sorted as `dd/mm/yyyy` text (by day first) | `T` component and date columns (History, Product activity, Reserved, Supplier actions) | Quantity/Available/In stock and Date sorting broken across the app | `T` reads the sortable `value` prop of these cells; date columns get timestamp sort keys |
| 11 | Tables jumped back to page 1 while the user typed in a form on the same page | `T` resets to page 1 when its `rows` array changes; `MovementTable` and `Dashboard` built a new array on every render | Import page (Actions table), Dashboard | Losing your place in the action list while recording an adjustment | Row arrays memoized (`useMemo`) |
| 12 | Filtering by invoice code could show results for an older keystroke; warehouse-page errors never cleared | One request per keystroke with no ordering guard; the error state was set but never reset | Products page, Showroom/Galovani/Isani pages | Stale or wrong rows; a permanent error banner after a single failure | Responses to superseded requests are ignored; errors clear on success; table and page errors are tracked separately |
| 13 | Users were logged out whenever the backend was briefly unreachable at page load | Session restore deleted the token on *any* `/auth/me` failure | `App` in `main.tsx` | Forced re-login after every backend restart or outage (very visible during the crash loop in #1) | The token is removed only on a 401 (already handled in `api()`); temporary failures keep the session |
| 14 | `npm run dev` (frontend) could not talk to the API | `vite.config.ts` had no proxy; nginx does this in production only | `frontend/vite.config.ts` | The local frontend dev server was unusable | Dev/preview proxy for `/api` and `/uploads` (target overridable with `VITE_API_PROXY_TARGET`); production build unaffected |
| 15 | `check-database.ps1` reported success while the app could not log in to the database | All its SQL uses the trusted local socket, like the postgres healthcheck | `scripts/check-database.ps1` | False "healthy" during exactly the failure in #1 | Adds a network password-login check with a remediation message |
| 16 | Known vulnerabilities in runtime dependencies | Outdated transitive packages | `backend`: `proxy-addr` (critical, used by `trust proxy`), `body-parser`, `qs`; `frontend`: Vite dev server and related packages | Security exposure (the Vite dev server listens on `0.0.0.0`) | `npm audit fix` (patch/minor updates only, lockfiles only); `zod` is left for later (needs a major upgrade, see G) |

Verified as **correct**, with no change needed: negative-stock prevention, reservation holds, transport limits, FIFO invoice consumption, reversal rules, duplicate product and supplier names (including concurrent creates), and concurrent sales of the last units. See section E.

---

## C. Backend Investigation (local-only failure)

### Symptoms

- `docker ps`: `backend` was in `Restarting (1)`, `frontend` was stuck in `Created`, and `postgres` reported **healthy**.
- Backend log on every attempt: `API startup failed error: password authentication failed for user "inventory"` (`28P01`), raised inside `runMigrations()` (the first database call).
- PostgreSQL log: `FATAL: password authentication failed … Connection matched pg_hba.conf line 128: "host all all all scram-sha-256"`.

### Root cause

**The `inventory` role password stored inside the database volume did not match `POSTGRES_PASSWORD` in the local `.env`.** The official postgres image reads `POSTGRES_PASSWORD` *only when it initializes an empty data directory*. After that, the password lives inside the cluster, and editing or recreating `.env` changes nothing in the database.

Evidence gathered (secrets compared only by hash, never printed):

1. The local `.env` is **byte-identical to `.env.example`**, so it carries the public placeholder password and JWT secret. Its timestamp (2026-10-08 20:36:33) is the exact second of the `git pull --rebase` that applied commit `54d3e35 "Delete .env"` (which removed the previously tracked `.env` from the working tree).
2. The database cluster was created on this machine on 2026-09-10 in `data/postgres` (the original bind-mount layout). Logging in over the network with the password from the **originally committed** `.env` (commit `6158759`, quotes stripped the way Compose strips them) **succeeds**. The current `.env` password fails, and so does a control value.
3. The Compose labels on the running containers show they were started from the tracked `docker-compose.yml` and project `.env`. The backend's actual `PGPASSWORD` hash equals the current `.env` value.
4. The named volume `romclassic_postgres_data` was created today (21:13). `postgres-data-init` copied the legacy `data/postgres` cluster into it, and that cluster's stored password came along.
5. The postgres healthcheck (`pg_isready` + `psql` over the **local socket**, which `pg_hba.conf` trusts) passes regardless of the password. So Compose saw a healthy database, while every TCP client (backend and backup) was rejected.
6. `data/backups` holds bursts of `.part` directories with **0-byte** `database.dump` files at every startup since 2026-10-14: the backup service hit the same authentication failure repeatedly.

### Why production was unaffected

Production's database cluster was initialized with production's own `.env`, and that `.env` was never replaced by a placeholder copy, so the two still agree. The mechanism is entirely per-machine: the volume and `.env` never leave the computer. I had no access to the production machine, so this part is inferred from the mechanism and from your report that production works. It was not observed directly.

### Not established

The local database was evidently used successfully earlier today (an admin LOGIN audit row at 17:50, cluster shut down cleanly at 17:52). I could not determine which configuration made that possible despite the mismatched `.env`. Shell history was off-limits, and the Docker event history no longer covered that period. It does not change the fix.

### Changes made

| Change | Purpose |
| --- | --- |
| Backup before any change: `data/backups/manual_2026-11-23_213345` (made with the project's own `backup.sh`, verified with `pg_restore --list`) | Safety net |
| Compared the volume with the latest pre-existing backup (`catchup_2026-11-19`) by restoring it into a scratch database (dropped afterwards) | Confirmed no data loss: every table matches; the live volume additionally contains one newer audit row (today's login) |
| `scripts/sync-postgres-password.sh` and `.ps1` (new) | Re-apply `POSTGRES_PASSWORD` from `.env` to the role through the trusted local socket (`ALTER ROLE … PASSWORD` with psql `\getenv`, so the password never appears on a command line), verify a network login the way the backend connects, then start the stack. Opt-in; no table data touched; no production configuration changed. |
| Ran the `.sh` script locally | The local role password now matches the local `.env` |
| Startup HINT (`backend/src/diagnostics.ts`, used in `server.ts`) | On `28P01` the log explains the cause and names the script; on `ECONNREFUSED`/`ENOTFOUND` it explains `DATABASE_URL`/`PG*` |
| `scripts/check-database.ps1` | Now fails with a remediation message when the network password login fails |
| Rebuilt and recreated the local images (`docker compose up -d --build`) | Applied migration 026 (indexes only) and deployed the current code |
| README: rebuild after updates, troubleshooting entry, local development without Docker | Prevent recurrence |

`docker-compose.yml`, `nginx.conf`, the Dockerfiles and the production `.env` were **not modified**.

### Verification

- Backend logged `API listening on port 4000` on its first restart after the sync. All containers are `healthy`, and the frontend container (previously never started) is up.
- Through nginx on `:3000`: SPA `200`, SPA fallback routes `200`, `/api/*` proxied correctly (login error handling, 401 without token).
- A backup over the network login now succeeds: `data/backups/manual_2026-11-23_215147`.
- Recovery test: I deliberately set a random wrong role password on the local DB. The new check reported the failure with its hint, and `sync-postgres-password.ps1` (run under PowerShell 7) fully restored service. A one-off backend container started with a wrong password prints the new HINT.
- Graceful shutdown: `docker compose restart backend` logs `SIGTERM received; closing the API safely` and is back in ~0.6 s.
- Data invariants on the real local DB (stock totals = sum of locations, reserved = pending holds, invoice stock ≤ location stock, movement totals = stock): **0 violations**.

---

## D. Code Optimizations

**Database / backend**

- **Dashboard query** (`GET /api/dashboard`). It used to build one row per *warehouse × every active product* and run three correlated subqueries per row, only to discard the rows without stock in JavaScript. It now joins only stocked (warehouse, active product) pairs. A warehouse without stock still yields one row, so its card and empty table render as before. On a seeded 62-product test DB: planner cost **≈480,000 → ≈7,900**; `EXPLAIN ANALYZE` execution **≈43 ms → ≈3 ms**. Output is **byte-for-byte identical** to the old query (compared on the dashboard and six other endpoints).
- **PostgreSQL JIT disabled for the API's sessions** (`-c jit=off` in the pool options). The inflated estimate above had triggered JIT compilation, which took ≈23 ms of the ≈43 ms. All API queries are short transactional queries, where JIT only adds latency. Verified to apply with both `DATABASE_URL` and `PG*` configuration; the timezone option still applies.
- `tx()` no longer recycles broken connections (bug #9).

**API communication**

- Consistent error contract: `VALIDATION`, `REFERENCE_NOT_FOUND`, `PAYLOAD_TOO_LARGE`, `SERVER_ERROR` (documented in `backend/API.md`). New messages have Georgian translations.

**Frontend**

- Memoized row arrays: no pagination resets, and no re-sorting on unrelated re-renders.
- Ignoring superseded filter responses avoids rendering stale data while typing.
- Dev/preview proxy makes `npm run dev` usable.

**Maintainability**

- Startup diagnostics live in a small tested module (`diagnostics.ts`).
- README documents the password behavior, troubleshooting and running without Docker.

**Not changed on purpose:** no new runtime dependencies, no schema changes (no new migrations), and no architectural rewrite. `ProductDetails` in `main.tsx` is never rendered, but a nearby flag comment indicates it is being kept for a future image UI, so it was left in place.

---

## E. Edge Cases & Testing

All API edge-case and concurrency testing ran against a **separate, disposable PostgreSQL container** with its own admin account, never against your data. It was removed afterwards.

### Edge cases investigated

- **Validation:** malformed JSON; bodies over 1 MB; invalid UUID, enum and calendar-date query parameters; quantities of 0, −3, 1.5 and 99,999,999,999; non-digit invoice codes; impossible dates (2026-02-29); blank and whitespace/duplicate names; references to missing categories; settings values over 200 characters; unknown routes; missing reversal reason.
- **Stock rules:** overselling; selling at an empty location; selling, transporting or decreasing stock that is reserved; correction without a direction; transport to the same warehouse; archiving a product with pending reservations.
- **Lifecycle:** complete a reservation → complete it again → reverse the resulting sale (reservation re-opened, hold restored) → reverse again → reverse an import after sales (correctly refused) → cancel the re-opened reservation.
- **Concurrency:** 10 parallel sales of 1 unit with 2 available → exactly **2** succeed; 8 parallel creates of the same product name → exactly **1** succeeds; 8 parallel transports in opposite directions → no deadlock and correct totals.
- **Integrity after all of the above:** 0 invariant violations in the test DB and in the real local DB.
- **Fresh install:** all 27 migrations apply cleanly to an empty database.

### Tests executed and results

| Suite | Result |
| --- | --- |
| Backend type-check (`tsc --noEmit`) | ✅ pass |
| Backend unit tests (`npm test`, no DB) | ✅ 9 passed; 17 integration tests skipped by design |
| Backend unit + **integration** tests (`TEST_DATABASE_URL` set) | ✅ **26/26 passed**, including a graceful-shutdown exit-code check |
| Integration suite against the **original** code (regression check) | 12 of 17 fail as expected (the bugs above). The 4 stock-rule tests pass on both versions, confirming unchanged business behavior; the 5th passing test (an impossible `from` date) was already rejected by PostgreSQL before |
| Frontend type-check (`npm test`) | ✅ pass |
| Frontend production build (`vite build`) | ✅ pass |
| Docker image builds (`docker compose build`) | ✅ pass, then redeployed |
| Headless browser checks (Firefox via `puppeteer-core`, against the **production bundle**) | ✅ 6/6: numeric sort ascending/descending, chronological date sort across 2025–2026, pagination kept on the Import page, session kept on a temporary API failure and restored afterwards. **The same checks fail on the original `main.tsx`.** |
| Headless browser smoke test | ✅ All 14 pages render with no console errors; a real import and a real sale through the UI forms update stock correctly |
| PowerShell scripts | ✅ All four parse cleanly (PowerShell 7.7); the sync script was exercised end to end |
| `npm audit --omit=dev` | Frontend: 0 vulnerabilities. Backend: 1 remaining (`zod`, see G) |

### New tests

- `backend/src/api.integration.test.ts`: 17 end-to-end API tests that start the real server (including migrations) against a database named in `TEST_DATABASE_URL`. The suite refuses to run unless the database name contains "test", and it creates its own admin user. It covers the validation bugs above, reservation and stock rules, concurrent last-unit sales, dashboard consistency and data invariants.
- `backend/src/diagnostics.test.ts`: 3 unit tests for the startup hints.

The browser checks were run ad hoc from a temporary folder and are **not** committed, because keeping them would add a browser-automation dependency to the project.

---

## G. Remaining Issues

1. **Credentials: action recommended.**
   - The local `.env` uses the public placeholders from `.env.example` for both `POSTGRES_PASSWORD` and `JWT_SECRET`. Exposure is limited (the backend is bound to 127.0.0.1 and PostgreSQL is not published), but the frontend listens on all interfaces. Set unique values in the local `.env`, then run `sh scripts/sync-postgres-password.sh`. Changing `JWT_SECRET` signs everyone out.
   - A real `.env` was committed in `6158759`/`27d7ac7` and only deleted later (`54d3e35`), so it **remains in git history** and on the remote. If production uses any of those values, rotate the DB password (edit `.env`, then run `scripts\sync-postgres-password.ps1`) and the JWT secret. Removing it from history would require a history rewrite, which I did not do.
   - Migrations `001`/`014`/`022` hard-code the root administrator's bcrypt hash. Make sure the production admin password has been changed from that initial value.
2. **`.env.example` is deleted in the working tree.** This uncommitted change was already present before this work and was left untouched. The README still says to copy `.env.example`. Run `git restore .env.example` if the deletion was unintended.
3. **`zod` advisory (GHSA-mrhx-c7xc-m3w5).** The fix requires zod v4, a breaking major upgrade affecting every schema. Exploitability here is low: request bodies are capped at 1 MB and the app does not validate large collections. Plan this as a separate task.
4. **History endpoint scalability.** `GET /api/stock-movements` loads every movement, event, audit and reservation and filters them in JavaScript, and the History page filters again client-side. That is fine at the current size (a few hundred rows, ~20 ms), but it grows without bound. Next step: server-side filtering and pagination.
5. **Category names are unique only case-sensitively** ("Beds" and "beds" can coexist), unlike products and suppliers, which have normalized-uniqueness triggers. Whitespace variants are now blocked. A trigger migration like `024`/`025` would close this if desired; it was not added because it extends a business rule.
6. **Abandoned backup fragments.** 18 `data/backups/.*.part` directories with 0-byte dumps from the failed backups. They are harmless and ignored by the restore tooling. I did not delete them; remove them after review if you like.
7. **Georgian wording.** The 4 new translations should be reviewed by a native speaker.
8. **Minor housekeeping (not changed):** `frontend/tsconfig.tsbuildinfo` is tracked in git; the backend image ships dev dependencies (`npm prune --omit=dev` after the build would shrink it); the backend `tsc` build also compiles test files into `dist`; warehouse pages share one component instance, so filters persist when switching between Showroom, Galovani and Isani (existing behavior, kept).

---

## H. Final Status

- **Application stability:** Good. The core inventory engine (locking, reservations, FIFO invoice tracking, reversals) behaved correctly in every edge-case and concurrency test, and data invariants hold. The fixed defects were input handling, error reporting and UI-state issues, not stock-math errors.
- **Backend reliability:** Improved. Malformed input no longer produces 500s, internal error codes are no longer exposed, broken connections are discarded, and startup failures explain themselves.
- **Local development environment:** Working. The crash loop is resolved and verified, the stack runs the current code, backups succeed again, the Vite dev server works, and a documented, tested script recovers from this failure mode on Linux and Windows.
- **Build and test results:** All backend and frontend type-checks, builds, Docker builds, 26/26 backend tests (unit + integration) and all browser checks pass.
- **Remaining risks:** Credential hygiene (G1) is the most important open item, followed by the `zod` major upgrade (G3) and the unbounded History endpoint (G4). Production was neither accessed nor changed; the production-side explanation in section C is inferred, not observed.
