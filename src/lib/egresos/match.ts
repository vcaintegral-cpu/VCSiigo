import { daysBetween, normalizeInvoiceNumber, round2 } from "../util/parse";
import { dueNumber, type BankMovement, type CxpDue, type PaymentRow, type Voucher, type VoucherLine } from "./types";

export type MatchResult = { vouchers: Voucher[]; unmatchedMovements: BankMovement[]; unmatchedPayments: PaymentRow[] };

/** Busca un subconjunto (≤ maxItems) cuya suma sea `target` ±1 peso. Evita explosión combinatoria. */
function subsetSum(items: PaymentRow[], target: number, maxItems = 8): PaymentRow[] | null {
  const list = items.slice(0, 20);
  const best: PaymentRow[][] = [];
  const walk = (i: number, picked: PaymentRow[], sum: number) => {
    if (best.length) return;
    if (picked.length && Math.abs(sum - target) < 1) return void best.push([...picked]);
    if (i >= list.length || picked.length >= maxItems || sum > target + 1) return;
    picked.push(list[i]!);
    walk(i + 1, picked, round2(sum + list[i]!.amount));
    picked.pop();
    walk(i + 1, picked, sum);
  };
  walk(0, [], 0);
  return best[0] ?? null;
}

/**
 * Cruza el extracto con los pagos de facturas: un egreso por movimiento bancario.
 * Orden: (1) referencia explícita, (2) por proveedor: suma exacta, un solo pago o subconjunto que sume.
 * Mejora frente al prototipo: el paso 2 ahora encuentra subconjuntos (un proveedor con 5 pagos
 * pero 3 en este movimiento) y exige ventana de fechas.
 */
export function matchPayments(movements: BankMovement[], payments: PaymentRow[], dues: CxpDue[], toleranceDays = 5): MatchResult {
  const dueByNumber = new Map<string, CxpDue>();
  for (const d of dues) dueByNumber.set(normalizeInvoiceNumber(dueNumber(d)), d);
  const findDue = (p: PaymentRow) => dueByNumber.get(normalizeInvoiceNumber(p.invoiceNumber));
  const supplierOf = (p: PaymentRow) => (p.supplierId || findDue(p)?.supplierId || "").trim();

  const available = new Set(payments.map((p) => p.id));
  const vouchers: Voucher[] = [];
  const unmatchedMovements: BankMovement[] = [];

  for (const movement of movements) {
    const pool = payments.filter((p) => available.has(p.id));
    let group = movement.reference
      ? pool.filter((p) => p.reference && normalizeInvoiceNumber(p.reference) === normalizeInvoiceNumber(movement.reference))
      : [];

    if (group.length === 0) {
      const bySupplier = new Map<string, PaymentRow[]>();
      for (const p of pool) {
        if (toleranceDays >= 0 && p.date && movement.date && daysBetween(p.date, movement.date) > toleranceDays) continue;
        const key = supplierOf(p) || "sin-proveedor";
        bySupplier.set(key, [...(bySupplier.get(key) ?? []), p]);
      }
      for (const candidates of bySupplier.values()) {
        const sum = round2(candidates.reduce((a, p) => a + p.amount, 0));
        if (Math.abs(sum - round2(movement.amount)) < 1) { group = candidates; break; }
        const single = candidates.find((p) => Math.abs(round2(p.amount) - round2(movement.amount)) < 1);
        if (single) { group = [single]; break; }
        const subset = subsetSum(candidates, round2(movement.amount));
        if (subset) { group = subset; break; }
      }
    }

    if (group.length === 0) { unmatchedMovements.push(movement); continue; }
    for (const p of group) available.delete(p.id);
    const lines: VoucherLine[] = group.map((payment) => ({ payment, due: findDue(payment) }));
    const total = round2(group.reduce((a, p) => a + p.amount, 0));
    const supplierId = supplierOf(group[0]!);
    vouchers.push({
      id: movement.id, movement, supplierId,
      supplierName: lines.find((l) => l.due)?.due?.supplierName ?? supplierId,
      lines, total, difference: round2(movement.amount - total),
    });
  }
  return { vouchers, unmatchedMovements, unmatchedPayments: payments.filter((p) => available.has(p.id)) };
}

/** Motivos por los que un egreso NO debe enviarse solo (va a excepciones). */
export function voucherIssues(v: Voucher): string[] {
  const issues: string[] = [];
  if (!v.supplierId) issues.push("Sin identificación del proveedor");
  if (Math.abs(v.difference) >= 1) issues.push(`Diferencia de ${v.difference} contra el banco`);
  const missing = v.lines.filter((l) => !l.due);
  if (missing.length) issues.push(`Factura(s) no encontrada(s) en cuentas por pagar: ${missing.map((l) => l.payment.invoiceNumber).join(", ")}`);
  const over = v.lines.filter((l) => l.due && l.payment.amount - l.due.balance > 1);
  if (over.length) issues.push(`Pago mayor al saldo en: ${over.map((l) => l.payment.invoiceNumber).join(", ")}`);
  if (new Set(v.lines.map((l) => l.due?.supplierId).filter(Boolean)).size > 1) issues.push("El movimiento mezcla varios proveedores");
  return issues;
}
