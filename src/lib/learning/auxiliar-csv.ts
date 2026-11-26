import Papa from "papaparse";
import { inferirTarifas } from "./extract";
import { normalizarConcepto, rolPorCuenta, soloDigitos } from "./puc";
import type { LineaContable, TipoDocumento } from "./types";

/**
 * Importa el "Auxiliar por tercero / por cuenta" exportado de Siigo (CSV; para Excel, guardar como CSV UTF-8).
 * Mapeador flexible: detecta columnas por sinónimos. Agrupa por comprobante+número para inferir tarifas.
 */
const SINONIMOS: Record<string, string[]> = {
  fecha: ["fecha", "fecha elaboracion", "fecha de elaboracion"],
  comprobante: ["comprobante", "tipo comprobante", "tipo", "tipo de comprobante"],
  numero: ["numero", "número", "consecutivo", "doc", "documento", "no"],
  cuenta: ["cuenta", "codigo cuenta", "código cuenta", "cuenta contable", "codigo"],
  nit: ["nit", "identificacion", "identificación", "tercero", "nit tercero", "id tercero"],
  debito: ["debito", "débito", "debe", "debitos"],
  credito: ["credito", "crédito", "haber", "creditos"],
  detalle: ["detalle", "descripcion", "descripción", "concepto", "observaciones"],
  centro: ["centro de costo", "centro costo", "centro", "cc"],
};

const quitaTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function detectarColumnas(headers: string[]): Partial<Record<keyof typeof SINONIMOS, string>> {
  const res: Partial<Record<keyof typeof SINONIMOS, string>> = {};
  for (const [campo, sins] of Object.entries(SINONIMOS)) {
    const h = headers.find((x) => sins.map(quitaTildes).includes(quitaTildes(x)));
    if (h) res[campo as keyof typeof SINONIMOS] = h;
  }
  return res;
}

const monto = (v: unknown): number => {
  let s = String(v ?? "").trim().replace(/[$\s]/g, "");
  if (!s) return 0;
  // 1.234.567,89 -> 1234567.89 ; 1,234,567.89 -> 1234567.89
  if (/,\d{1,2}$/.test(s) && s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/,\d{1,2}$/.test(s)) s = s.replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const fechaFlex = (v: unknown): string | null => {
  const s = String(v ?? "").trim();
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/); // dd/mm/yyyy (Colombia)
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return null;
};

function tipoPorComprobante(c: string): TipoDocumento {
  const x = c.toUpperCase();
  if (/^FV|VENTA/.test(x)) return "venta";
  if (/^FC|COMPRA/.test(x)) return "compra";
  if (/^DS|SOPORTE/.test(x)) return "documento_soporte";
  if (/^RC|CAJA|INGRESO/.test(x)) return "recibo_caja";
  if (/^RP|EGRESO|PAGO/.test(x)) return "recibo_pago";
  if (/^NC|CREDITO/.test(x)) return "nota_credito";
  return "auxiliar";
}

export function lineasDeAuxiliarCsv(csv: string, tipoForzado?: TipoDocumento) {
  const parsed = Papa.parse<Record<string, string>>(csv.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: true,
  });
  const headers = parsed.meta.fields ?? [];
  const col = detectarColumnas(headers);
  const faltan = (["cuenta", "nit", "debito", "credito"] as const).filter((k) => !col[k]);
  if (faltan.length) {
    return { lineas: [] as LineaContable[], columnas: col, error: `Faltan columnas: ${faltan.join(", ")}`, filas: 0 };
  }
  const porDoc = new Map<string, LineaContable[]>();
  let filas = 0;
  for (const r of parsed.data) {
    const cuenta = soloDigitos(r[col.cuenta!]);
    const nit = soloDigitos(r[col.nit!]);
    const d = monto(r[col.debito!]);
    const c = monto(r[col.credito!]);
    if (!cuenta || !nit || (d === 0 && c === 0)) continue;
    filas++;
    const comp = col.comprobante ? String(r[col.comprobante]) : "";
    const key = `${comp}|${col.numero ? r[col.numero] : filas}`;
    const l: LineaContable = {
      terceroNit: nit,
      tipoDocumento: tipoForzado ?? tipoPorComprobante(comp),
      fecha: col.fecha ? fechaFlex(r[col.fecha]) : null,
      cuenta,
      naturaleza: d > 0 ? "D" : "C",
      valor: d > 0 ? d : c,
      rol: rolPorCuenta(cuenta),
      concepto: col.detalle ? normalizarConcepto(r[col.detalle]) : "",
      tarifa: null,
      impuestoId: null,
      centroCosto: col.centro ? String(r[col.centro] || "") || null : null,
    };
    (porDoc.get(key) ?? porDoc.set(key, []).get(key)!).push(l);
  }
  const lineas = [...porDoc.values()].flatMap(inferirTarifas);
  return { lineas, columnas: col, error: null as string | null, filas };
}
