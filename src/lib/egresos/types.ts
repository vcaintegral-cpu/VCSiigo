/** Vencimiento por pagar tal como lo entrega GET /v1/accounts-payable. */
export type CxpDue = {
  prefix: string;
  consecutive: number;
  quote: number;
  dueDate: string; // yyyy-mm-dd
  balance: number;
  supplierId: string;
  supplierBranch: number;
  supplierName: string;
  costCenter?: number;
};
export const dueNumber = (d: Pick<CxpDue, "prefix" | "consecutive">) => `${d.prefix}-${d.consecutive}`;

export type BankMovement = { id: string; date: string; description: string; reference: string; amount: number };
export type PaymentRow = { id: string; invoiceNumber: string; supplierId: string; amount: number; date: string; reference: string };
export type VoucherLine = { payment: PaymentRow; due: CxpDue | undefined };
export type Voucher = {
  id: string;
  movement: BankMovement;
  supplierId: string;
  supplierName: string;
  lines: VoucherLine[];
  total: number;
  difference: number;
};
