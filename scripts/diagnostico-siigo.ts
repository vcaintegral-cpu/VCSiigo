/**
 * DIAGNÓSTICO DE SOLO LECTURA de una empresa de Siigo (v2).
 *   npm run diagnostico            (más:  npm run diagnostico -- --balance)
 * Hace 1 POST /auth y peticiones GET. Con --balance hace además 1 POST /v1/test-balance-report (genera un Excel
 * en Siigo; NO crea ni modifica documentos contables y el archivo NO se descarga).
 * Guarda `diagnostico-siigo.json`: forma de las respuestas sin cifras/NIT/nombres + catálogos no sensibles
 * (impuestos y tipos de comprobante). Los datos crudos nunca se escriben a disco.
 */
import { writeFileSync } from "node:fs";
import { forma } from "../src/lib/diagnostico";
import { SIIGO_ENDPOINTS as E, siigoFromEnv } from "../src/lib/siigo";

const hoy = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const hace30 = iso(new Date(hoy.getTime() - 30 * 86400000));
const futuro = "2099-01-01";

type Q = Record<string, string | number>;
const pruebas: { nombre: string; ruta: string; query?: Q }[] = [
  ...["FV", "FC", "DS", "RC", "RP", "CC", "NC"].map((t) => ({ nombre: `tipos ${t}`, ruta: E.tiposComprobante, query: { type: t } })),
  ...["FC", "FV", "NC", "RC", "RP", "DS"].map((t) => ({ nombre: `medios de pago (${t})`, ruta: "/v1/payment-types", query: { document_type: t } })),
  { nombre: "centros de costo", ruta: E.centrosCosto },
  { nombre: "clientes/terceros", ruta: E.terceros, query: { page_size: 2 } },
  { nombre: "grupos de inventario", ruta: E.grupos },
  { nombre: "LISTADO compras", ruta: E.compras, query: { page_size: 2, created_start: hace30 } },
  { nombre: "LISTADO documentos soporte", ruta: E.documentosSoporte, query: { page_size: 2, created_start: hace30 } },
  { nombre: "facturas de venta", ruta: E.ventas, query: { page_size: 2, created_start: hace30 } },
  { nombre: "comprobantes contables", ruta: E.comprobantes, query: { page_size: 2, created_start: hace30 } },
  { nombre: "recibos de caja", ruta: E.recibosCaja, query: { page_size: 2, created_start: hace30 } },
  { nombre: "recibos de pago/egreso", ruta: E.recibosPago, query: { page_size: 2, created_start: hace30 } },
  { nombre: "notas crédito", ruta: E.notasCredito, query: { page_size: 2, created_start: hace30 } },
  { nombre: "cuentas por pagar", ruta: E.cuentasPorPagar, query: { page_size: 3 } },
];

// ¿Qué filtros de fecha respeta realmente cada listado? (total con fecha futura debe ser 0)
const filtros: { recurso: string; ruta: string; param: string; valor: string }[] = [];
for (const [recurso, ruta] of [["compras", E.compras], ["documentos soporte", E.documentosSoporte], ["comprobantes", E.comprobantes], ["facturas venta", E.ventas]] as const) {
  for (const param of ["created_start", "updated_start", "date_start"]) filtros.push({ recurso, ruta, param, valor: futuro });
}

async function main() {
  const siigo = siigoFromEnv();
  const salida: Record<string, any> = { version: 2, generado: hoy.toISOString(), pruebas: {}, filtros: {}, detalle: {}, catalogos: {} };
  console.log("Autenticando...");
  await siigo.getToken(true);
  console.log("Autenticacion OK\n");

  const muestras: Record<string, string | undefined> = {};
  for (const p of pruebas) {
    try {
      const r: any = await siigo.get(p.ruta, p.query);
      const results = Array.isArray(r) ? r : r?.results;
      salida.pruebas[p.nombre] = { ok: true, total_resultados: r?.pagination?.total_results ?? (Array.isArray(r) ? r.length : undefined), forma: forma(Array.isArray(results) ? results.slice(0, 2) : r) };
      if (Array.isArray(results) && results[0]?.id) muestras[p.nombre] = String(results[0].id);
      if (p.nombre.startsWith("tipos ") && Array.isArray(results)) {
        salida.catalogos[p.nombre] = results.map((t: any) => ({ id: t.id, code: t.code, name: t.name, active: t.active, automatic_number: t.automatic_number, consecutive: t.consecutive, cost_center: t.cost_center, cost_center_mandatory: t.cost_center_mandatory, reteiva: t.reteiva, reteica: t.reteica }));
      }
      if (p.nombre.startsWith("medios de pago") && Array.isArray(results)) salida.catalogos[p.nombre] = results.map((m: any) => ({ id: m.id, name: m.name, type: m.type, active: m.active, due_date: m.due_date }));
      console.log(`OK    ${p.nombre}`);
    } catch (e: any) {
      salida.pruebas[p.nombre] = { ok: false, http: e?.status, error: JSON.stringify(e?.body ?? e?.message).slice(0, 300) };
      console.log(`FALLA ${p.nombre} -> HTTP ${e?.status ?? "?"}`);
    }
  }

  // Catálogo completo de impuestos (id, nombre genérico, tipo, %): no es información del cliente.
  try {
    const imp: any[] = [];
    for await (const { items } of siigo.paginate<any>(E.impuestos)) imp.push(...items);
    salida.catalogos.impuestos = imp.map((t) => ({ id: t.id, name: t.name, type: t.type, percentage: t.percentage, active: t.active }));
    console.log(`OK    catalogo de impuestos (${imp.length})`);
  } catch (e: any) { salida.catalogos.impuestos = { error: e?.status }; }

  for (const f of filtros) {
    try {
      const r: any = await siigo.get(f.ruta, { page_size: 1, [f.param]: f.valor });
      salida.filtros[`${f.recurso} · ${f.param}=${f.valor}`] = { total: r?.pagination?.total_results ?? (Array.isArray(r?.results) ? r.results.length : null) };
    } catch (e: any) { salida.filtros[`${f.recurso} · ${f.param}=${f.valor}`] = { error: e?.status }; }
  }
  console.log("OK    prueba de filtros de fecha");

  // Orden de los listados sin filtro de fecha y tamano maximo de pagina (para sincronizar solo lo nuevo)
  for (const [nombre, ruta] of [["compras", E.compras], ["documentos soporte", E.documentosSoporte]] as const) {
    try {
      const p1: any = await siigo.get(ruta, { page: 1, page_size: 200 });
      const total = p1?.pagination?.total_results ?? 0;
      const ult: any = await siigo.get(ruta, { page: Math.max(1, Math.ceil(total / 100)), page_size: 100 });
      const f = (d: any) => d ? { date: d.date, created: d.metadata?.created, number: d.number } : null;
      salida.orden = { ...(salida.orden ?? {}), [nombre]: {
        page_size_200_devuelve: p1?.results?.length, total,
        primer_documento_pagina_1: f(p1?.results?.[0]),
        ultimo_documento_ultima_pagina: f(ult?.results?.[ult.results.length - 1]),
      } };
      console.log(`OK    orden de ${nombre}`);
    } catch (e: any) { salida.orden = { ...(salida.orden ?? {}), [nombre]: { error: e?.status } }; }
  }

  // Detalle por id (forma completa de un documento)
  for (const [nombre, base, key] of [["compra", E.compras, "LISTADO compras"], ["documento soporte", E.documentosSoporte, "LISTADO documentos soporte"], ["comprobante contable", E.comprobantes, "comprobantes contables"], ["recibo de pago", E.recibosPago, "recibos de pago/egreso"]] as const) {
    const id = muestras[key];
    if (!id) continue;
    try { salida.detalle[nombre] = forma(await siigo.get(`${base}/${id}`)); console.log(`OK    detalle ${nombre}`); }
    catch (e: any) { salida.detalle[nombre] = { error: e?.status }; }
  }

  if (process.argv.includes("--balance")) {
    try {
      const r: any = await siigo.request("POST", E.balancePrueba, { body: { account_start: "", account_end: "", year: hoy.getFullYear(), month_start: 1, month_end: 13, includes_tax_difference: false } });
      salida.balance = { ok: true, devuelve_url: !!r?.file_url, campos: Object.keys(r ?? {}) };
      console.log("OK    balance de prueba (solo se verifica que devuelva enlace)");
    } catch (e: any) { salida.balance = { ok: false, http: e?.status, error: JSON.stringify(e?.body ?? e?.message).slice(0, 300) }; console.log(`FALLA balance -> HTTP ${e?.status}`); }
  }

  writeFileSync("diagnostico-siigo.json", JSON.stringify(salida, null, 2), "utf8");
  console.log("\nListo: diagnostico-siigo.json");
}
main().catch((e) => { console.error("Fallo:", e?.message ?? e); process.exit(1); });
