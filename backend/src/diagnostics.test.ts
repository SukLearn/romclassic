import { describe, expect, it } from "vitest";
import { startupHint } from "./diagnostics";

describe("startup diagnostics", () => {
  it("explains a database password that no longer matches .env", () => {
    const hint = startupHint({ code: "28P01" });
    expect(hint).toContain("POSTGRES_PASSWORD");
    expect(hint).toContain("sync-postgres-password");
  });

  it("explains an unreachable database server", () => {
    expect(startupHint({ code: "ECONNREFUSED" })).toContain("DATABASE_URL");
    expect(startupHint({ code: "ENOTFOUND" })).toContain("not reachable");
  });

  it("stays silent for unrelated errors", () => {
    expect(startupHint(new Error("boom"))).toBeUndefined();
    expect(startupHint(undefined)).toBeUndefined();
    expect(startupHint(null)).toBeUndefined();
  });
});
