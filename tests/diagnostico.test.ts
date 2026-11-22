import { describe, expect, it } from "vitest";
import { forma } from "../src/lib/diagnostico";

describe("forma (redactor)", () => {
  it("oculta cifras, NIT y nombres pero conserva estructura y cuentas", () => {
    const r: any = forma([{ id: "abc-123", supplier: { identification: "900123456", name: "ACME SAS" }, total: 119000,
      items: [{ account: { code: "23359501", movement: "Credit" }, value: 119000 }, { x: 1 }] }]);
    const txt = JSON.stringify(r);
    expect(txt).not.toMatch(/900123456|ACME|119000/);
    expect(r[0].items[0].account).toEqual({ code: "23359501", movement: "Credit" });
    expect(r[0].supplier.identification).toMatch(/^<string:/);
  });
});
