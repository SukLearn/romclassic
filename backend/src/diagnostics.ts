// Turns common startup failures into actionable guidance for the operator.
export function startupHint(startupError: unknown): string | undefined {
  const code = (startupError as { code?: unknown } | null)?.code;
  if (code === "28P01")
    return (
      "PostgreSQL rejected the database password. The postgres image applies " +
      "POSTGRES_PASSWORD only when it creates an empty data volume, so a .env " +
      "that was recreated or edited later (or a volume copied from another " +
      "installation) no longer matches the stored password. Run " +
      "scripts/sync-postgres-password.sh (or .ps1 on Windows) to re-apply the " +
      "password from .env."
    );
  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "EAI_AGAIN")
    return (
      "PostgreSQL is not reachable. Outside Docker, set DATABASE_URL (or " +
      "PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE) to a reachable server."
    );
  return undefined;
}
