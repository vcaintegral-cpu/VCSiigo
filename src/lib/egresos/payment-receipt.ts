import { round2 } from "../util/parse";
import type { Voucher } from "./types";

export type EgresoSetup = {
  /** Medio de pago de Siigo (GET /v1/payment-types) ligado al banco/caja; requerido para DebtPayment. */
  paymentMethodId?: number;
  documentId: number; // tipo de comprobante RP (GET /v1/document-types?type=RP)
  bankAccountCode: string; // cuenta de banco/caja a acreditar
  cxpAccountCode: string; // cuenta de proveedores/CxP a debitar (p. ej. 22050101 / 23359501), por empresa
  costCenter?: number;
  observations?: string;
};

export type Ajuste = { accountCode: string; movement: "Debit" | "Credit"; value: number; description: string; taxId?: number };

/**
 * Arma el recibo de pago/egreso para POST /v1/payment-receipts en modo "Detailed":
 *  - Débito a la cuenta por pagar por cada vencimiento (con su `due`),
 *  - Débitos/créditos de ajustes (retenciones, descuentos, ajuste al peso),
 *  - Crédito al banco por el neto.
 * Garantiza partida doble: si no cuadra al centavo, lanza error (nunca se envía descuadrado).
 * [PRUEBA REAL pendiente]: semántica de due.date (¿vencimiento o fecha de pago?) y de quote.
 */
export function buildPaymentReceipt(voucher: Voucher, setup: EgresoSetup, ajustes: Ajuste[] = []) {
  const lineItems = voucher.lines.map((l) => {
    if (!l.due) throw new Error(`Sin vencimiento en Siigo para ${l.payment.invoiceNumber}`);
    return {
      account: { code: setup.cxpAccountCode, movement: "Debit" as const },
      due: { prefix: l.due.prefix, consecutive: l.due.consecutive, quote: l.due.quote, date: l.due.dueDate },
      description: `Pago ${l.payment.invoiceNumber}`,
      value: round2(l.payment.amount),
    };
  });
  const adj = ajustes.map((a) => ({
    account: { code: a.accountCode, movement: a.movement },
    ...(a.taxId ? { tax: { id: a.taxId } } : {}),
    description: a.description,
    value: round2(a.value),
  }));
  const debits = round2([...lineItems, ...adj].filter((i) => i.account.movement === "Debit").reduce((s, i) => s + i.value, 0));
  const credits = round2(adj.filter((i) => i.account.movement === "Credit").reduce((s, i) => s + i.value, 0));
  const bank = round2(debits - credits);
  if (bank <= 0) throw new Error("El neto a pagar debe ser mayor que cero");

  return {
    document: { id: setup.documentId },
    date: voucher.movement.date,
    type: "Detailed" as const,
    supplier: { identification: voucher.supplierId, branch_office: 0 },
    ...(setup.costCenter ? { cost_center: setup.costCenter } : {}),
    items: [
      ...lineItems,
      ...adj,
      { account: { code: setup.bankAccountCode, movement: "Credit" as const }, description: `Pago ${voucher.movement.reference || voucher.movement.description}`.slice(0, 120), value: bank },
    ],
    observations: (setup.observations ?? `Pago ${voucher.movement.reference || voucher.movement.description}`).slice(0, 4000),
  };
}

/**
 * Recibo de pago "abono a deuda" (DebtPayment): es el formato que Siigo Nube usa por defecto y el que
 * aparece en los recibos reales de la empresa de prueba (items[{due, value}] + payment{id, value}).
 * La cuenta bancaria la define el medio de pago en Siigo. Sin retenciones ni ajustes.
 */
export function buildDebtPaymentReceipt(voucher: Voucher, setup: EgresoSetup) {
  if (!setup.paymentMethodId) throw new Error("Falta el medio de pago (payment-types) del banco");
  const items = voucher.lines.map((l) => {
    if (!l.due) throw new Error(`Sin vencimiento en Siigo para ${l.payment.invoiceNumber}`);
    return { due: { prefix: l.due.prefix, consecutive: l.due.consecutive, quote: l.due.quote, date: l.due.dueDate }, value: round2(l.payment.amount) };
  });
  const total = round2(items.reduce((s, i) => s + i.value, 0));
  const first = voucher.lines[0]!.due!;
  return {
    document: { id: setup.documentId },
    date: voucher.movement.date,
    type: "DebtPayment" as const,
    supplier: { identification: voucher.supplierId, branch_office: first.supplierBranch },
    ...(setup.costCenter ? { cost_center: setup.costCenter } : {}),
    items,
    payment: { id: setup.paymentMethodId, value: total },
    observations: (setup.observations ?? `Pago ${voucher.movement.reference || voucher.movement.description}`).slice(0, 4000),
  };
}

/** Elige el formato: simple (DebtPayment) si no hay ajustes; avanzado (Detailed) si hay retenciones/ajustes. */
export function construirEgreso(voucher: Voucher, setup: EgresoSetup, ajustes: Ajuste[] = []) {
  return ajustes.length === 0 && setup.paymentMethodId
    ? buildDebtPaymentReceipt(voucher, setup)
    : buildPaymentReceipt(voucher, setup, ajustes);
}
