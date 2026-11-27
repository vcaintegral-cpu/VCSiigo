import type { SupabaseClient } from "@supabase/supabase-js";
import { SIIGO_ENDPOINTS, type SiigoClient } from "../siigo";
import { agregarReglas } from "./aggregate";
import { lineasDeDocumento, nitDelDocumento } from "./extract";
import type { LineaContable, ReglaCalculada, TipoDocumento } from "./types";

type Obj = Record<string, any>;

/** Recursos históricos a descargar. `paramDesde` es el filtro de fecha de Siigo (VERIFICAR nombre en docs). */
export const RECURSOS_HISTORICOS: { recurso: TipoDocumento; path: string; /** filtro de fecha que SÍ respeta el listado (verificado 26-nov-2026); undefined = no filtra, se recorre todo */ paramDesde?: string }[] = [
  // Compras y DS: el listado NO está documentado, pero existe (verificado con una empresa real el 26-nov-2026).
  { recurso: "compra", path: SIIGO_ENDPOINTS.compras }, // sin filtro de fecha: se recorre completo
  { recurso: "documento_soporte", path: SIIGO_ENDPOINTS.documentosSoporte },
  { recurso: "venta", path: SIIGO_ENDPOINTS.ventas, paramDesde: "created_start" },
  { recurso: "nota_credito", path: SIIGO_ENDPOINTS.notasCredito, paramDesde: "created_start" },
  { recurso: "comprobante", path: SIIGO_ENDPOINTS.comprobantes, paramDesde: "created_start" }, // date_start NO filtra en journals
  { recurso: "recibo_caja", path: SIIGO_ENDPOINTS.recibosCaja, paramDesde: "created_start" },
  { recurso: "recibo_pago", path: SIIGO_ENDPOINTS.recibosPago, paramDesde: "created_start" },
];

export type ResultadoDescarga = {
  completo: boolean;
  documentos: number;
  porRecurso: Record<string, { descargados: number; completado: boolean; error?: string }>;
};

/** Fila de siigo_documentos a partir de un documento crudo de Siigo. */
const filaDocumento = (orgId: string, recurso: TipoDocumento, d: Obj) => ({
  org_id: orgId, tipo: recurso, siigo_id: String(d.id), nombre: d.name ?? null,
  fecha: d.date ? String(d.date).slice(0, 10) : null, tercero_nit: nitDelDocumento(d) || null, total: d.total ?? null, crudo: d,
});

const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

/** FASE 1 · Descarga reanudable del histórico (respeta un presupuesto de tiempo para serverless). */
export async function descargarHistorico(
  db: SupabaseClient,
  siigo: SiigoClient,
  orgId: string,
  opts: { desde: string; presupuestoMs?: number; reiniciar?: boolean } ,
): Promise<ResultadoDescarga> {
  const inicio = Date.now();
  const presupuesto = opts.presupuestoMs ?? 45_000;
  const out: ResultadoDescarga = { completo: true, documentos: 0, porRecurso: {} };

  if (opts.reiniciar) await db.from("sync_estado").delete().eq("org_id", orgId).in("recurso", RECURSOS_HISTORICOS.map((r) => r.recurso));

  for (const { recurso, path, paramDesde } of RECURSOS_HISTORICOS) {
    const { data: est } = await db.from("sync_estado").select("*").eq("org_id", orgId).eq("recurso", recurso).maybeSingle();
    if (est?.completado) {
      out.porRecurso[recurso] = { descargados: est.total_descargado, completado: true };
      continue;
    }
    let pagina = est?.pagina_siguiente ?? 1;
    let total = est?.total_descargado ?? 0;
    let terminado = false;
    let error: string | undefined;

    try {
      while (Date.now() - inicio < presupuesto) {
        const { results, hasMore } = await siigo.page<Obj>(path, pagina, paramDesde ? { [paramDesde]: opts.desde } : {}, 100);
        const filas = results
          .filter((d) => !d.date || String(d.date).slice(0, 10) >= opts.desde)
          .map((d) => filaDocumento(orgId, recurso, d));
        for (const lote of chunk(filas, 200)) {
          const { error: e } = await db.from("siigo_documentos").upsert(lote, { onConflict: "org_id,tipo,siigo_id" });
          if (e) throw new Error(e.message);
        }
        total += filas.length;
        out.documentos += filas.length;
        terminado = !hasMore || results.length === 0;
        pagina++;
        await db.from("sync_estado").upsert({
          org_id: orgId, recurso, pagina_siguiente: pagina, desde: opts.desde,
          completado: terminado, total_descargado: total, actualizado_en: new Date().toISOString(), error: null,
        });
        if (terminado) break;
      }
    } catch (e: any) {
      error = e?.message ?? String(e);
      // Un recurso sin acceso/ruta (404) no debe frenar a los demás: se marca y se sigue.
      const noExiste = /HTTP 404|HTTP 403/.test(error!);
      await db.from("sync_estado").upsert({
        org_id: orgId, recurso, pagina_siguiente: pagina, desde: opts.desde,
        completado: noExiste, total_descargado: total, actualizado_en: new Date().toISOString(), error,
      });
      terminado = noExiste;
    }
    out.porRecurso[recurso] = { descargados: total, completado: terminado, error };
    if (!terminado) out.completo = false;
    if (Date.now() - inicio >= presupuesto) { out.completo = false; break; }
  }
  return out;
}

/** FASE 2 · Reconstruye la memoria contable leyendo lo descargado. */
export async function reconstruirReglas(db: SupabaseClient, orgId: string) {
  const lineas: LineaContable[] = [];
  let docs = 0;
  let sinCuenta = 0;
  for (const { recurso } of RECURSOS_HISTORICOS) {
    let desde = 0;
    for (;;) {
      const { data, error } = await db
        .from("siigo_documentos").select("crudo")
        .eq("org_id", orgId).eq("tipo", recurso)
        .order("siigo_id").range(desde, desde + 999);
      if (error) throw new Error(error.message);
      if (!data?.length) break;
      for (const r of data) {
        docs++;
        const ls = lineasDeDocumento(recurso, r.crudo as Obj);
        for (const l of ls) { if (!l.cuenta && l.rol !== "iva" && !l.rol.startsWith("rete")) sinCuenta++; }
        lineas.push(...ls);
      }
      if (data.length < 1000) break;
      desde += 1000;
    }
  }
  const reglas = agregarReglas(lineas);
  const guardadas = await guardarReglas(db, orgId, reglas, "historico", true);
  return { documentos: docs, lineas: lineas.length, lineasSinCuenta: sinCuenta, reglas: guardadas };
}

/** Guarda reglas respetando las bloqueadas (fijadas por el contador). */
export async function guardarReglas(
  db: SupabaseClient, orgId: string, reglas: ReglaCalculada[],
  origen: "historico" | "auxiliar_csv", reemplazar: boolean,
) {
  if (reemplazar) await db.from("reglas_contables").delete().eq("org_id", orgId).eq("bloqueada", false).eq("origen", origen);
  const { data: bloq } = await db.from("reglas_contables").select("tercero_nit,tipo_documento,rol_linea,concepto,cuenta_puc,naturaleza,impuesto_id").eq("org_id", orgId).eq("bloqueada", true);
  const k = (a: string[]) => a.join("|");
  const bloqueadas = new Set((bloq ?? []).map((b) => k([b.tercero_nit, b.tipo_documento, b.rol_linea, b.concepto, b.cuenta_puc, b.naturaleza, b.impuesto_id])));
  const filas = reglas
    .filter((r) => !bloqueadas.has(k([r.terceroNit, r.tipoDocumento, r.rolLinea, r.concepto, r.cuentaPuc, r.naturaleza, r.impuestoId])))
    .map((r) => ({
      org_id: orgId, tercero_nit: r.terceroNit, tipo_documento: r.tipoDocumento, rol_linea: r.rolLinea,
      concepto: r.concepto, cuenta_puc: r.cuentaPuc, naturaleza: r.naturaleza, tarifa: r.tarifa, impuesto_id: r.impuestoId,
      centro_costo: r.centroCosto, evidencia_n: r.evidenciaN, total_n: r.totalN, confianza: r.confianza,
      primera_vez: r.primeraVez, ultima_vez: r.ultimaVez, origen, actualizada_en: new Date().toISOString(),
    }));
  for (const lote of chunk(filas, 500)) {
    const { error } = await db.from("reglas_contables").upsert(lote, { onConflict: "org_id,tercero_nit,tipo_documento,rol_linea,concepto,cuenta_puc,naturaleza,impuesto_id" });
    if (error) throw new Error(error.message);
  }
  return filas.length;
}

/** Sincroniza maestros (terceros, productos, impuestos, centros de costo, tipos de comprobante). */
export async function sincronizarMaestros(db: SupabaseClient, siigo: SiigoClient, orgId: string) {
  const ahora = new Date().toISOString();
  const resumen: Record<string, number | string> = {};
  const jobs: { tabla: string; path: string; map: (x: Obj) => Obj }[] = [
    { tabla: "siigo_terceros", path: SIIGO_ENDPOINTS.terceros, map: (x) => ({
        siigo_id: String(x.id), nit: String(x.identification ?? "").replace(/\D/g, ""), dv: x.check_digit ?? null,
        nombre: Array.isArray(x.name) ? x.name.join(" ") : x.name ?? null, tipo: x.type ?? null,
        ciudad: x.address?.city?.city_name ?? null, email: x.contacts?.[0]?.email ?? null,
        responsabilidades: x.fiscal_responsibilities ?? null }) },
    { tabla: "siigo_productos", path: SIIGO_ENDPOINTS.productos, map: (x) => ({
        siigo_id: String(x.id), codigo: x.code ?? null, nombre: x.name ?? null, grupo_cuentas: x.account_group?.name ?? null }) },
    { tabla: "siigo_impuestos", path: SIIGO_ENDPOINTS.impuestos, map: (x) => ({
        siigo_id: String(x.id), nombre: x.name ?? null, tipo: x.type ?? null, porcentaje: x.percentage ?? null, activo: x.active ?? true }) },
    { tabla: "siigo_centros_costo", path: SIIGO_ENDPOINTS.centrosCosto, map: (x) => ({
        siigo_id: String(x.id), codigo: x.code ?? null, nombre: x.name ?? null, activo: x.active ?? true }) },
    { tabla: "siigo_tipos_comprobante", path: SIIGO_ENDPOINTS.tiposComprobante, map: (x) => ({
        siigo_id: String(x.id), codigo: x.code ?? null, nombre: x.name ?? null, tipo: x.type ?? null,
        consecutivo_automatico: x.automatic_number ?? null }) },
  ];
  for (const j of jobs) {
    try {
      let n = 0;
      for await (const { items } of siigo.paginate<Obj>(j.path)) {
        const filas = items.map((x) => ({ org_id: orgId, ...j.map(x), crudo: x, sincronizado_en: ahora }));
        const { error } = await db.from(j.tabla).upsert(filas, { onConflict: "org_id,siigo_id" });
        if (error) throw new Error(error.message);
        n += filas.length;
      }
      resumen[j.tabla] = n;
    } catch (e: any) {
      resumen[j.tabla] = `error: ${e?.message ?? e}`;
    }
  }
  // La API de Siigo NO expone el PUC: se obtiene del balance de prueba (Excel) o de la carga manual.
  return resumen;
}

/**
 * Sincronización NOCTURNA incremental (verificado 26/27-nov-2026):
 *  - compras y documentos soporte se listan de MÁS NUEVO a MÁS ANTIGUO y no admiten filtro de fecha:
 *    se leen páginas desde la 1 hasta encontrar una página completa ya conocida.
 *  - el resto (ventas, comprobantes, RC, RP, notas crédito) respeta `created_start`.
 * Requiere que el entrenamiento inicial (descargarHistorico) haya terminado.
 */
export async function sincronizarNuevos(db: SupabaseClient, siigo: SiigoClient, orgId: string, opts: { maxPaginas?: number } = {}) {
  const maxPaginas = opts.maxPaginas ?? 40;
  const out: Record<string, { nuevos: number; paginas: number; error?: string }> = {};
  for (const { recurso, path, paramDesde } of RECURSOS_HISTORICOS) {
    const { data: est } = await db.from("sync_estado").select("completado,actualizado_en").eq("org_id", orgId).eq("recurso", recurso).maybeSingle();
    if (!est?.completado) { out[recurso] = { nuevos: 0, paginas: 0, error: "entrenamiento inicial pendiente" }; continue; }
    const desde = new Date(new Date(est.actualizado_en).getTime() - 2 * 86400000).toISOString().slice(0, 10);
    let nuevos = 0, paginas = 0;
    try {
      for (let pagina = 1; pagina <= maxPaginas; pagina++) {
        const { results, hasMore } = await siigo.page<Obj>(path, pagina, paramDesde ? { [paramDesde]: desde } : {}, 100);
        paginas++;
        if (!results.length) break;
        const ids = results.map((d) => String(d.id));
        const { data: conocidos } = await db.from("siigo_documentos").select("siigo_id").eq("org_id", orgId).eq("tipo", recurso).in("siigo_id", ids);
        const sabidos = new Set((conocidos ?? []).map((c) => c.siigo_id));
        nuevos += ids.filter((i) => !sabidos.has(i)).length;
        const { error } = await db.from("siigo_documentos").upsert(results.map((d) => filaDocumento(orgId, recurso, d)), { onConflict: "org_id,tipo,siigo_id" });
        if (error) throw new Error(error.message);
        if (!hasMore) break;
        if (!paramDesde && sabidos.size === ids.length) break; // página completa ya conocida: no hay más nuevos
      }
      await db.from("sync_estado").update({ actualizado_en: new Date().toISOString(), error: null, total_descargado: undefined }).eq("org_id", orgId).eq("recurso", recurso);
      out[recurso] = { nuevos, paginas };
    } catch (e: any) {
      out[recurso] = { nuevos, paginas, error: e?.message ?? String(e) };
    }
  }
  return out;
}
