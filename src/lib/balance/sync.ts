import type { SupabaseClient } from "@supabase/supabase-js";
import { hojasDeExcel } from "../excel-lector";
import { SIIGO_ENDPOINTS, type SiigoClient } from "../siigo";
import { parseBalanceGeneral, parseBalanceTercero } from "./parse";

const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

async function descargarExcel(siigo: SiigoClient, ruta: string, anio: number) {
  const r: any = await siigo.request("POST", ruta, { body: { account_start: "", account_end: "", year: anio, month_start: 1, month_end: 13, includes_tax_difference: false } });
  const url = new URL(String(r?.file_url ?? ""));
  if (url.protocol !== "https:" || !url.hostname.endsWith(".blob.core.windows.net")) throw new Error(`URL de reporte inesperada: ${url.hostname}`);
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`No se pudo descargar el balance (HTTP ${res.status})`);
  return hojasDeExcel(Buffer.from(await res.arrayBuffer()))[0]!.filas;
}

/**
 * Genera y guarda el balance de prueba del año: PUC (general) y saldos por tercero.
 * Verifica que el NIT del archivo coincida con el de la empresa (evita mezclar datos entre empresas).
 */
export async function sincronizarBalance(db: SupabaseClient, siigo: SiigoClient, orgId: string, anio: number) {
  const { data: org } = await db.from("organizaciones").select("nit").eq("id", orgId).maybeSingle();
  const nitOrg = String(org?.nit ?? "").replace(/\D/g, "");

  const general = parseBalanceGeneral(await descargarExcel(siigo, SIIGO_ENDPOINTS.balancePrueba, anio));
  if (nitOrg && general.nitEmpresa && general.nitEmpresa !== nitOrg) throw new Error(`El balance es del NIT ${general.nitEmpresa}, no del de la empresa (${nitOrg})`);
  const ahora = new Date().toISOString();
  for (const lote of chunk(general.filas, 500)) {
    const { error } = await db.from("siigo_puc").upsert(lote.map((f) => ({
      org_id: orgId, codigo: f.codigo, nombre: f.nombre, nivel: f.nivel, transaccional: f.transaccional,
      naturaleza: null, activa: true, crudo: { saldoInicial: f.saldoInicial, debito: f.debito, credito: f.credito, saldoFinal: f.saldoFinal }, sincronizado_en: ahora,
    })), { onConflict: "org_id,codigo" });
    if (error) throw new Error(error.message);
  }

  const terc = parseBalanceTercero(await descargarExcel(siigo, SIIGO_ENDPOINTS.balancePruebaTercero, anio));
  if (nitOrg && terc.nitEmpresa && terc.nitEmpresa !== nitOrg) throw new Error(`El balance por tercero es del NIT ${terc.nitEmpresa}, no del de la empresa`);
  await db.from("balance_tercero").delete().eq("org_id", orgId).eq("anio", anio);
  for (const lote of chunk(terc.filas, 1000)) {
    const { error } = await db.from("balance_tercero").insert(lote.map((f) => ({
      org_id: orgId, anio, cuenta: f.codigo, nombre_cuenta: f.nombreCuenta, tercero_nit: f.terceroNit, sucursal: f.sucursal, tercero_nombre: f.terceroNombre,
      saldo_inicial: f.saldoInicial, debito: f.debito, credito: f.credito, saldo_final: f.saldoFinal, generado_en: ahora,
    })));
    if (error) throw new Error(error.message);
  }
  return { puc: general.filas.length, pucTransaccionales: general.filas.filter((f) => f.transaccional).length, terceros: terc.filas.length, periodo: general.periodo };
}
