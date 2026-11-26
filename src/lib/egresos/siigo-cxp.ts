import { SIIGO_ENDPOINTS, type SiigoClient } from "../siigo";
import type { CxpDue } from "./types";

type Obj = Record<string, any>;

/** Convierte un registro de GET /v1/accounts-payable (forma verificada con empresa real) a CxpDue. */
export function parseCxp(raw: Obj): CxpDue | null {
  const due = raw.due ?? {};
  const prov = raw.provider ?? {};
  const consecutive = Number(due.consecutive);
  if (!due.prefix || !Number.isFinite(consecutive) || !prov.identification) return null;
  return {
    prefix: String(due.prefix),
    consecutive,
    quote: Number(due.quote ?? 1) || 1,
    dueDate: String(due.date ?? "").slice(0, 10),
    balance: Number(due.balance ?? 0),
    supplierId: String(prov.identification).replace(/\D/g, ""),
    supplierBranch: Number(prov.branch_office ?? prov.brach_office ?? 0) || 0, // la doc oficial tiene "brach_office" (errata)
    supplierName: String(prov.name ?? ""),
    costCenter: raw.cost_center?.code != null ? Number(raw.cost_center.code) : undefined,
  };
}

/** Descarga toda la cartera por pagar (paginada, respetando el limitador del cliente). */
export async function leerCuentasPorPagar(siigo: SiigoClient, filtros: { proveedor?: string; vencimientoDesde?: string; vencimientoHasta?: string } = {}) {
  const out: CxpDue[] = [];
  for await (const { items } of siigo.paginate<Obj>(SIIGO_ENDPOINTS.cuentasPorPagar, {
    provider_identification: filtros.proveedor, due_date_start: filtros.vencimientoDesde, due_date_end: filtros.vencimientoHasta,
  })) {
    for (const r of items) { const d = parseCxp(r); if (d) out.push(d); }
  }
  return out;
}
