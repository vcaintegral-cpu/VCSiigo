import { describe, expect, it, vi } from "vitest";
import { SiigoClient } from "../src/lib/siigo";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });

describe("SiigoClient", () => {
  it("autentica con Partner-Id, cachea el token y lo renueva ante 401", async () => {
    let auths = 0;
    const f = vi.fn(async (url: any, init: any) => {
      if (String(url).endsWith("/auth")) {
        auths++;
        expect(init.headers["Partner-Id"]).toBe("miapp");
        return json({ access_token: `tok${auths}`, expires_in: 86400 });
      }
      expect(init.headers["Partner-Id"]).toBe("miapp");
      if (init.headers.Authorization === "tok1") return json({}, 401);
      return json({ results: [{ id: 1 }], pagination: { page: 1, page_size: 100, total_results: 1 } });
    });
    const c = new SiigoClient({ username: "u", accessKey: "k", partnerId: "miapp", minIntervalMs: 0, fetchImpl: f as any });
    const r = await c.page("/v1/customers", 1);
    expect(r.results).toHaveLength(1);
    expect(auths).toBe(2);
    await c.get("/v1/customers");
    expect(auths).toBe(2);
  });

  it("pagina hasta agotar resultados", async () => {
    const f = vi.fn(async (url: any) => {
      if (String(url).endsWith("/auth")) return json({ access_token: "t", expires_in: 86400 });
      const p = Number(new URL(String(url)).searchParams.get("page"));
      return json({ results: Array(p < 3 ? 2 : 1).fill({ id: p }), pagination: { total_results: 5 } });
    });
    const c = new SiigoClient({ username: "u", accessKey: "k", partnerId: "p", minIntervalMs: 0, fetchImpl: f as any });
    let n = 0;
    for await (const { items } of c.paginate("/v1/x", {}, 2)) n += items.length;
    expect(n).toBe(5);
  });
});
