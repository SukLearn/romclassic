// End-to-end API tests against a real PostgreSQL database.
//
// They start the actual server (including migrations) as a child process and
// therefore only run when TEST_DATABASE_URL is set, e.g.
//   docker run -d --name inventory-testdb -e POSTGRES_PASSWORD=test \
//     -e POSTGRES_DB=inventory_test -p 127.0.0.1:55432:5432 postgres:16-alpine
//   TEST_DATABASE_URL=postgres://postgres:test@127.0.0.1:55432/inventory_test npm test
// The database name must contain "test"; the suite writes data to it.
import { spawn, type ChildProcess } from "child_process";
import { mkdtempSync, rmSync } from "fs";
import net from "net";
import os from "os";
import path from "path";
import bcrypt from "bcryptjs";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.TEST_DATABASE_URL;
const databaseName = databaseUrl ? new URL(databaseUrl).pathname.slice(1) : "";
const enabled = Boolean(databaseUrl);
if (enabled && !/test/i.test(databaseName))
  throw new Error(
    `Refusing to run integration tests against "${databaseName}": the database name must contain "test".`,
  );

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address() as net.AddressInfo;
      probe.close(() => resolve(port));
    });
  });

describe.skipIf(!enabled)("inventory API (integration)", () => {
  let server: ChildProcess;
  let serverOutput = "";
  let baseUrl = "";
  let token = "";
  let db: Client;
  let uploadDir = "";
  const suffix = `${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);
  const warehouses: Record<string, string> = {};
  let categoryId = "";
  let supplierId = "";

  const call = async (
    method: string,
    route: string,
    body?: unknown,
    rawBody?: string,
  ) => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined || rawBody !== undefined)
      headers["Content-Type"] = "application/json";
    const response = await fetch(baseUrl + route, {
      method,
      headers,
      body: rawBody ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
    const text = await response.text();
    return {
      status: response.status,
      data: text ? JSON.parse(text) : null,
    };
  };
  const newProduct = async (name: string) => {
    const created = await call("POST", "/api/products", {
      name: `${name} ${suffix}`,
      categoryId,
      supplierId,
    });
    expect(created.status).toBe(201);
    return created.data.id as string;
  };
  const importStock = (productId: string, warehouseId: string, quantity: number) =>
    call("POST", "/api/inventory/import", {
      productId,
      warehouseId,
      quantity,
      importDate: today,
      invoiceCode: "7001",
    });

  beforeAll(async () => {
    uploadDir = mkdtempSync(path.join(os.tmpdir(), "inventory-uploads-"));
    const port = await freePort();
    baseUrl = `http://127.0.0.1:${port}`;
    server = spawn(
      process.execPath,
      [path.resolve("node_modules/tsx/dist/cli.mjs"), "src/server.ts"],
      {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
          PORT: String(port),
          UPLOAD_DIR: uploadDir,
          JWT_SECRET: "integration-test-secret",
          MIGRATIONS_DIR: path.resolve("migrations"),
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    server.stdout!.on("data", (chunk) => (serverOutput += chunk));
    server.stderr!.on("data", (chunk) => (serverOutput += chunk));
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Server did not start:\n${serverOutput}`)),
        45_000,
      );
      const check = () => {
        if (serverOutput.includes("API listening")) {
          clearTimeout(timer);
          resolve();
        }
      };
      server.stdout!.on("data", check);
      server.once("exit", (code) =>
        reject(new Error(`Server exited (${code}):\n${serverOutput}`)),
      );
    });

    // A dedicated administrator so the suite never touches existing accounts.
    db = new Client({ connectionString: databaseUrl });
    await db.connect();
    await db.query(
      "INSERT INTO users(name,username,password_hash,role) VALUES($1,$2,$3,'ADMIN')",
      ["Integration Admin", `it_admin_${suffix}`, await bcrypt.hash("it-password", 4)],
    );
    const login = await call("POST", "/api/auth/login", {
      username: `it_admin_${suffix}`,
      password: "it-password",
    });
    expect(login.status).toBe(200);
    token = login.data.token;

    for (const warehouse of (await call("GET", "/api/warehouses")).data)
      warehouses[warehouse.slug] = warehouse.id;
    categoryId = (await call("GET", "/api/categories")).data[0].id;
    supplierId = (
      await call("POST", "/api/suppliers", { name: `IT Supplier ${suffix}` })
    ).data.id;
  }, 60_000);

  afterAll(async () => {
    await db?.end();
    if (server && server.exitCode === null) {
      const exited = new Promise<number | null>((resolve) =>
        server.once("exit", (code) => resolve(code)),
      );
      server.kill("SIGTERM");
      // Graceful shutdown closes the HTTP server and the pool, then exits 0.
      expect(await exited).toBe(0);
    }
    rmSync(uploadDir, { recursive: true, force: true });
  });

  describe("request validation", () => {
    it.each([
      "/api/inventory/products?productId=abc",
      "/api/inventory/products?supplierId=abc",
      "/api/inventory/products?categoryId=abc",
      "/api/inventory/products?type=NOT_A_TYPE",
      "/api/inventory/movements?productId=abc",
      "/api/inventory/movements?supplierId=abc",
      "/api/inventory/movements?type=NOT_A_TYPE",
      "/api/inventory/movements?from=2026-02-30",
    ])("rejects malformed filter %s with 400", async (route) => {
      const result = await call("GET", route);
      expect(result.status).toBe(400);
      expect(result.data.error.code).toBe("VALIDATION");
    });

    it("rejects malformed JSON with a validation error", async () => {
      const result = await call("POST", "/api/categories", undefined, "{bad");
      expect(result.status).toBe(400);
      expect(result.data.error.code).toBe("VALIDATION");
    });

    it("rejects oversized request bodies with 413", async () => {
      const result = await call("POST", "/api/categories", {
        name: "x".repeat(1_100_000),
      });
      expect(result.status).toBe(413);
      expect(result.data.error.code).toBe("PAYLOAD_TOO_LARGE");
    });

    it("rejects quantities beyond the integer column range", async () => {
      const productId = await newProduct("Huge Quantity");
      const result = await importStock(productId, warehouses.showroom, 99_999_999_999);
      expect(result.status).toBe(400);
      expect(result.data.error.message).toBe("Enter a smaller number");
    });

    it("rejects blank and whitespace-duplicate category names", async () => {
      const blank = await call("POST", "/api/categories", { name: "   " });
      expect(blank.status).toBe(400);
      const name = `IT Category ${suffix}`;
      expect((await call("POST", "/api/categories", { name })).status).toBe(201);
      const padded = await call("POST", "/api/categories", { name: `  ${name} ` });
      expect(padded.status).toBe(409);
      expect(padded.data.error.message).toBe("A category with this name already exists.");
    });

    it("reports a missing referenced record instead of 'in use'", async () => {
      const result = await call("POST", "/api/products", {
        name: `Orphan ${suffix}`,
        categoryId: "00000000-0000-4000-8000-000000000000",
        supplierId,
      });
      expect(result.status).toBe(400);
      expect(result.data.error.code).toBe("REFERENCE_NOT_FOUND");
    });
  });

  describe("stock rules", () => {
    it("never sells reserved or missing stock", async () => {
      const productId = await newProduct("Reserved Sofa");
      expect((await importStock(productId, warehouses.showroom, 5)).status).toBe(201);
      const reserve = await call("POST", "/api/inventory/adjust", {
        productId,
        warehouseId: warehouses.showroom,
        quantity: 3,
        type: "RESERVED",
        businessDate: today,
      });
      expect(reserve.status).toBe(201);
      for (const type of ["SOLD", "TRANSPORT"]) {
        const attempt = await call("POST", "/api/inventory/adjust", {
          productId,
          warehouseId: warehouses.showroom,
          destinationWarehouseId: type === "TRANSPORT" ? warehouses.isani : null,
          quantity: 3,
          type,
          businessDate: today,
        });
        expect(attempt.status).toBe(400);
        expect(attempt.data.error.code).toBe("INSUFFICIENT_STOCK");
      }
      const product = (await call("GET", `/api/products/${productId}`)).data;
      expect(product).toMatchObject({
        current_quantity: 5,
        reserved_quantity: 3,
        available_quantity: 2,
      });
    });

    it("serializes concurrent sales of the last units", async () => {
      const productId = await newProduct("Last Units");
      await importStock(productId, warehouses.galovani, 2);
      const results = await Promise.all(
        Array.from({ length: 8 }, () =>
          call("POST", "/api/inventory/adjust", {
            productId,
            warehouseId: warehouses.galovani,
            quantity: 1,
            type: "SOLD",
            businessDate: today,
          }),
        ),
      );
      expect(results.filter((r) => r.status === 201)).toHaveLength(2);
      expect(results.filter((r) => r.status === 400)).toHaveLength(6);
      const product = (await call("GET", `/api/products/${productId}`)).data;
      expect(product.current_quantity).toBe(0);
    });

    it("lists every warehouse on the dashboard with consistent totals", async () => {
      const dashboard = (await call("GET", "/api/dashboard")).data;
      expect(dashboard.locations.map((l: any) => l.slug).sort()).toEqual([
        "galovani",
        "isani",
        "showroom",
      ]);
      for (const location of dashboard.locations) {
        const listed = location.products_table.reduce(
          (sum: number, row: any) => sum + row.quantity,
          0,
        );
        expect(location.stock).toBe(listed);
        expect(location.products).toBe(location.products_table.length);
      }
    });

    it("keeps stored totals consistent with locations, reservations and invoices", async () => {
      const violations = await db.query(`
        SELECT
          (SELECT count(*) FROM products p WHERE p.current_quantity <>
             COALESCE((SELECT sum(quantity) FROM product_location_stock s WHERE s.product_id=p.id),0))::int totals,
          (SELECT count(*) FROM products p WHERE p.reserved_quantity <>
             COALESCE((SELECT sum(quantity) FROM inventory_reservations r
                       WHERE r.product_id=p.id AND r.status='PENDING' AND r.holds_stock),0))::int reserved,
          (SELECT count(*) FROM product_location_stock s WHERE s.quantity <
             COALESCE((SELECT sum(l.quantity) FROM inventory_batch_locations l
                       JOIN inventory_batches b ON b.id=l.batch_id
                       WHERE b.product_id=s.product_id AND l.warehouse_id=s.warehouse_id),0))::int invoices`);
      expect(violations.rows[0]).toEqual({ totals: 0, reserved: 0, invoices: 0 });
    });
  });
});
