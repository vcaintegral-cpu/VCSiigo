import { describe, expect, it } from "vitest";
import { buildPaymentReceipt } from "../src/lib/egresos/payment-receipt";
import { matchPayments, voucherIssues } from "../src/lib/egresos/match";
import type { BankMovement, CxpDue, PaymentRow } from "../src/lib/egresos/types";
import { parseAmount, parseDate } from "../src/lib/util/parse";
import { Breaker } from "../src/lib/worker/breaker";
import { RateLimiter } from "../src/lib/worker/rate-limiter";

const due = (n: number, balance: number, supplier = "900111222"): CxpDue => ({
  prefix: "FC-1", consecutive: n, quote: 1, dueDate: "2026-11-30", balance, supplierId: supplier, supplierBranch: 0, supplierName: "PROVEEDOR " + supplier,
});
const pay = (id: string, n: number, amount: number, supplierId = "900111222", date = "2026-11-10"): PaymentRow => ({ id, invoiceNumber: `FC-1-${n}`, supplierId, amount, date, reference: "" });
const mov = (id: string, amount: number, date = "2026-11-11", reference = ""): BankMovement => ({ id, date, description: "PAGO", reference, amount });

describe("parse", () => {
  it("montos colombianos y anglosajones", () => {
    expect(parseAmount("1.234.567,89")).toBe(1234567.89);
    expect(parseAmount("1,234,567.89")).toBe(1234567.89);
    expect(parseAmount("1.234.567")).toBe(1234567);
    expect(parseAmount("1234,5")).toBe(1234.5);
    expect(parseAmount("-250.000")).toBe(250000);
    expect(parseAmount("$ 80.000,00")).toBe(80000);
  });
  it("fechas dd/mm/aaaa", () => {
    expect(parseDate("05/03/2026")).toBe("2026-03-05");
    expect(parseDate(46000)).toBe("2025-12-09");
  });
});

describe("cruce banco ↔ pagos", () => {
  const dues = [due(1, 100000), due(2, 50000), due(3, 70000)];
  it("suma exacta de varias facturas del mismo proveedor en un solo egreso", () => {
    const r = matchPayments([mov("m1", 150000)], [pay("p1", 1, 100000), pay("p2", 2, 50000)], dues);
    expect(r.vouchers).toHaveLength(1);
    expect(r.vouchers[0]!.lines).toHaveLength(2);
    expect(voucherIssues(r.vouchers[0]!)).toEqual([]);
  });
  it("encuentra el subconjunto cuando el proveedor tiene más pagos que el movimiento", () => {
    const r = matchPayments([mov("m1", 170000)], [pay("p1", 1, 100000), pay("p2", 2, 50000), pay("p3", 3, 70000)], dues);
    expect(r.vouchers[0]!.total).toBe(170000);
    expect(r.unmatchedPayments).toHaveLength(1);
  });
  it("movimiento sin pago queda sin cruzar y pago fuera de ventana de fechas no cruza", () => {
    const r = matchPayments([mov("m1", 999)], [pay("p1", 1, 100000, "900111222", "2026-01-01")], dues);
    expect(r.unmatchedMovements).toHaveLength(1);
    expect(matchPayments([mov("m2", 100000)], [pay("p1", 1, 100000, "900111222", "2026-01-01")], dues).vouchers).toHaveLength(0);
  });
  it("marca excepciones: factura inexistente, pago mayor al saldo", () => {
    const r = matchPayments([mov("m1", 120000)], [pay("p1", 1, 120000)], [due(1, 100000)]);
    expect(voucherIssues(r.vouchers[0]!).join()).toMatch(/mayor al saldo/);
    const r2 = matchPayments([mov("m1", 5000)], [pay("p9", 9, 5000)], dues);
    expect(voucherIssues(r2.vouchers[0]!).join()).toMatch(/no encontrada/);
  });
});

describe("recibo de pago/egreso (POST /v1/payment-receipts, Detailed)", () => {
  const setup = { documentId: 7714, bankAccountCode: "11100501", cxpAccountCode: "23359501" };
  it("débito a CxP con vencimiento y crédito al banco cuadrados", () => {
    const r = matchPayments([mov("m1", 150000)], [pay("p1", 1, 100000), pay("p2", 2, 50000)], [due(1, 100000), due(2, 50000)]);
    const body = buildPaymentReceipt(r.vouchers[0]!, setup);
    expect(body.type).toBe("Detailed");
    expect(body.items.filter((i) => i.account.movement === "Debit").reduce((s, i) => s + i.value, 0)).toBe(150000);
    expect(body.items.at(-1)).toMatchObject({ account: { code: "11100501", movement: "Credit" }, value: 150000 });
    expect(body.items[0]).toMatchObject({ due: { prefix: "FC-1", consecutive: 1, quote: 1 } });
  });
  it("con retención (crédito) y ajuste al peso el banco recibe el neto y cuadra", () => {
    const r = matchPayments([mov("m1", 100000)], [pay("p1", 1, 100000)], [due(1, 100000)]);
    const body = buildPaymentReceipt(r.vouchers[0]!, setup, [{ accountCode: "23652501", movement: "Credit", value: 2500, description: "Retefuente 2,5 %" }]);
    expect(body.items.at(-1)!.value).toBe(97500);
    const deb = body.items.filter((i) => i.account.movement === "Debit").reduce((s, i) => s + i.value, 0);
    const cre = body.items.filter((i) => i.account.movement === "Credit").reduce((s, i) => s + i.value, 0);
    expect(deb).toBe(cre);
  });
  it("no construye si falta el vencimiento en Siigo", () => {
    const r = matchPayments([mov("m1", 5000)], [pay("p9", 9, 5000)], []);
    expect(() => buildPaymentReceipt(r.vouchers[0]!, setup)).toThrow(/Sin vencimiento/);
  });
});

describe("protecciones del worker", () => {
  it("la cubeta limita a N por minuto y espera", async () => {
    let t = 0; const waits: number[] = [];
    const rl = new RateLimiter(2, () => t, async (ms) => { waits.push(ms); t += ms; });
    await rl.take("e"); await rl.take("e"); await rl.take("e");
    expect(waits.length).toBeGreaterThan(0);
  });
  it("el disyuntor se abre con fallos seguidos y se cierra tras el enfriamiento", () => {
    let t = 0;
    const b = new Breaker({ maxConsecutive: 3, windowMs: 60000, minSample: 10, maxFailRatio: 0.5, cooldownMs: 1000 }, () => t);
    b.record(false); b.record(false); expect(b.isOpen()).toBe(false);
    b.record(false); expect(b.isOpen()).toBe(true);
    t = 1500; expect(b.isOpen()).toBe(false);
  });
});

import { buildDebtPaymentReceipt, construirEgreso } from "../src/lib/egresos/payment-receipt";
import { parseCxp } from "../src/lib/egresos/siigo-cxp";

describe("formas reales de Siigo (empresa de prueba, 26-nov-2026)", () => {
  it("parsea accounts-payable (proveedor sin sucursal)", () => {
    const d = parseCxp({ due: { prefix: "Q5F6", consecutive: 1234, quote: 1, date: "2026-12-05T12:00:00.0000000+00:00", balance: 250000 }, provider: { id: "x", identification: "900123456", name: "ACME" } });
    expect(d).toMatchObject({ prefix: "Q5F6", consecutive: 1234, dueDate: "2026-12-05", supplierId: "900123456", supplierBranch: 0, balance: 250000 });
    expect(parseCxp({ due: {}, provider: {} })).toBeNull();
  });
  it("DebtPayment: items[{due,value}] + payment{id,value}", () => {
    const dues = [due(1, 100000), due(2, 50000)];
    const r = matchPayments([mov("m1", 150000)], [pay("p1", 1, 100000), pay("p2", 2, 50000)], dues);
    const body = buildDebtPaymentReceipt(r.vouchers[0]!, { documentId: 7714, paymentMethodId: 5636, bankAccountCode: "", cxpAccountCode: "" });
    expect(body).toMatchObject({ type: "DebtPayment", payment: { id: 5636, value: 150000 } });
    expect(body.items).toHaveLength(2);
    expect(body.items[0]).toEqual({ due: { prefix: "FC-1", consecutive: 1, quote: 1, date: "2026-11-30" }, value: 100000 });
    expect(() => buildDebtPaymentReceipt(r.vouchers[0]!, { documentId: 1, bankAccountCode: "", cxpAccountCode: "" })).toThrow(/medio de pago/);
  });
  it("construirEgreso: simple sin ajustes, avanzado con ajustes", () => {
    const r = matchPayments([mov("m1", 100000)], [pay("p1", 1, 100000)], [due(1, 100000)]);
    const setup = { documentId: 1, paymentMethodId: 9, bankAccountCode: "11100501", cxpAccountCode: "23359501" };
    expect(construirEgreso(r.vouchers[0]!, setup).type).toBe("DebtPayment");
    expect(construirEgreso(r.vouchers[0]!, setup, [{ accountCode: "23652501", movement: "Credit", value: 4000, description: "Rete" }]).type).toBe("Detailed");
  });
});

import { diaLocal, enVentana } from "../src/lib/worker/scheduler";
describe("programador nocturno (hora de Colombia, UTC-5)", () => {
  it("ventana 18:00–07:00 cruza la medianoche", () => {
    expect(enVentana(new Date("2026-11-27T04:12:00Z"), "18:00", "07:00")).toBe(true); // 23:12 Bogotá
    expect(enVentana(new Date("2026-11-27T11:30:00Z"), "18:00", "07:00")).toBe(true); // 06:30 Bogotá
    expect(enVentana(new Date("2026-11-27T12:30:00Z"), "18:00", "07:00")).toBe(false); // 07:30 Bogotá
  });
  it("fuera de la ventana de día", () => {
    expect(enVentana(new Date("2026-11-27T17:00:00Z"), "18:00", "07:00")).toBe(false); // 12:00 Bogotá
    expect(enVentana(new Date("2026-11-27T23:30:00Z"), "18:00", "07:00")).toBe(true); // 18:30 Bogotá
  });
  it("el día local usa la zona de Colombia", () => {
    expect(diaLocal(new Date("2026-11-27T03:00:00Z"))).toBe("2026-11-26"); // 22:00 del 26
  });
});
