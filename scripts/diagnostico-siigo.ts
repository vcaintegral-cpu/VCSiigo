/**
 * DIAGNÓSTICO DE SOLO LECTURA de una empresa de Siigo.
 *   npx tsx --env-file=.env.local scripts/diagnostico-siigo.ts
 * Hace únicamente: 1 POST /auth y varias peticiones GET. NO crea, edita ni borra nada en Siigo.
 * Guarda `diagnostico-siigo.json` con la FORMA de las respuestas (sin cifras, NIT ni nombres) para revisar
 * y compartir. Los datos crudos nunca se escriben a disco.
 */
import { writeFileSync } from "node:fs";
import { forma } from "../src/lib/diagnostico";
import { SIIGO_ENDPOINTS as E, siigoFromEnv } from "../src/lib/siigo";

const hoy = new Date();
const hace30 = new Date(hoy.getTime() - 30 * 86400000).toISOString().slice(0, 10);

const pruebas: { nombre: string; ruta: string; query?: Record<string, string | number> }[] = [
  { nombre: "tipos FV", ruta: E.tiposComprobante, query: { type: "FV" } },
  { nombre: "tipos FC", ruta: E.tiposComprobante, query: { type: "FC" } },
  { nombre: "tipos DS", ruta: E.tiposComprobante, query: { type: "DS" } },
  { nombre: "tipos RC", ruta: E.tiposComprobante, query: { type: "RC" } },
  { nombre: "tipos RP", ruta: E.tiposComprobante, query: { type: "RP" } },
  { nombre: "tipos CC", ruta: E.tiposComprobante, query: { type: "CC" } },
  { nombre: "impuestos", ruta: E.impuestos },
  { nombre: "medios de pago", ruta: "/v1/payment-types", query: { document_type: "RP" } },
  { nombre: "centros de costo", ruta: E.centrosCosto },
  { nombre: "clientes/terceros", ruta: E.terceros, query: { page_size: 2 } },
  { nombre: "productos", ruta: E.productos, query: { page_size: 2 } },
  // ¿Existe el listado de compras/DS aunque no esté documentado?
  { nombre: "LISTADO compras (no documentado)", ruta: E.compras, query: { page_size: 2, created_start: hace30 } },
  { nombre: "LISTADO documentos soporte (no documentado)", ruta: E.documentosSoporte, query: { page_size: 2, created_start: hace30 } },
  { nombre: "facturas de venta", ruta: E.ventas, query: { page_size: 2, created_start: hace30 } },
  { nombre: "comprobantes contables", ruta: E.comprobantes, query: { page_size: 2, created_start: hace30 } },
  { nombre: "recibos de caja", ruta: E.recibosCaja, query: { page_size: 2, created_start: hace30 } },
  { nombre: "recibos de pago/egreso", ruta: E.recibosPago, query: { page_size: 2, created_start: hace30 } },
  { nombre: "notas crédito", ruta: E.notasCredito, query: { page_size: 2, created_start: hace30 } },
  { nombre: "cuentas por pagar", ruta: E.cuentasPorPagar, query: { page_size: 3 } },
];

async function main() {
  const siigo = siigoFromEnv();
  const salida: Record<string, unknown> = { generado: hoy.toISOString(), pruebas: {} };
  console.log("Autenticando…");
  await siigo.getToken(true);
  console.log("Autenticación OK\n");
  for (const p of pruebas) {
    try {
      const r: any = await siigo.get(p.ruta, p.query);
      const results = Array.isArray(r) ? r : r?.results;
      (salida.pruebas as any)[p.nombre] = {
        ok: true,
        total_resultados: r?.pagination?.total_results ?? (Array.isArray(r) ? r.length : undefined),
        forma: forma(Array.isArray(results) ? results.slice(0, 2) : r),
      };
      console.log(`✔ ${p.nombre}`);
    } catch (e: any) {
      (salida.pruebas as any)[p.nombre] = { ok: false, http: e?.status, error: JSON.stringify(e?.body ?? e?.message).slice(0, 300) };
      console.log(`✘ ${p.nombre} → HTTP ${e?.status ?? "?"}`);
    }
  }
  writeFileSync("diagnostico-siigo.json", JSON.stringify(salida, null, 2));
  console.log("\nListo: diagnostico-siigo.json (sin cifras, NIT ni nombres). Revíselo y compártalo.");
}
main().catch((e) => { console.error("Falló:", e?.message ?? e); process.exit(1); });
