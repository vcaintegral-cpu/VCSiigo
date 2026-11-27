import { SIIGO_ENDPOINTS, type SiigoClient } from "./siigo";

export type MedioPago = { id: number; name: string; type: string; active: boolean; dueDate: boolean };

/**
 * Medios de pago para EGRESOS (recibos de pago, `payment.id`).
 * `GET /v1/payment-types` solo acepta document_type = FV | NC | FC | RC | DS (RP responde 404: no es un valor válido).
 * Los medios tipo "Proveedor" de FC/DS son los de pago a proveedores (bancos, caja, tarjetas).
 * Verificado el 27-nov-2026 solo en cuanto a que FC y DS devuelven la misma lista; que `payment.id` de los RP reales
 * pertenezca a ella lo comprueba el diagnóstico (`verificacion_rp`).
 */
export async function mediosPagoEgreso(siigo: SiigoClient): Promise<MedioPago[]> {
  const r: any = await siigo.get("/v1/payment-types", { document_type: "FC" });
  const lista: any[] = Array.isArray(r) ? r : r?.results ?? [];
  return lista
    .filter((m) => m.active !== false && /proveedor/i.test(String(m.type ?? "")))
    .map((m) => ({ id: Number(m.id), name: String(m.name ?? ""), type: String(m.type), active: m.active !== false, dueDate: !!m.due_date }));
}
export { SIIGO_ENDPOINTS };
