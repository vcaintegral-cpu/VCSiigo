/**
 * Lectores de los Excel que entrega POST /v1/test-balance-report y /v1/test-balance-report-by-thirdparty.
 * Estructura verificada con una empresa real (27-nov-2026):
 *   filas 1-4: título, nombre de la empresa, NIT (fila 3), periodo (fila 4)
 *   fila 5 (encabezado): Nivel | Transaccional | Código cuenta contable | Nombre Cuenta contable |
 *                        [Identificación | Sucursal | Nombre tercero] | Saldo Inicial | Movimiento Débito | Movimiento Crédito | Saldo final
 *   niveles: Clase, Grupo, Cuenta, Subcuenta, Auxiliar. El general trae ~500 filas; el de terceros ~12.000.
 */
import { normalizeHeader } from "../util/parse";

export type FilaPuc = { codigo: string; nombre: string; nivel: string; transaccional: boolean; saldoInicial: number; debito: number; credito: number; saldoFinal: number };
export type FilaBalanceTercero = { codigo: string; nombreCuenta: string; terceroNit: string; sucursal: string; terceroNombre: string; saldoInicial: number; debito: number; credito: number; saldoFinal: number };
export type BalanceParseado<T> = { nitEmpresa: string; periodo: string; filas: T[] };

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(String(v ?? "").replace(/[^0-9.-]/g, "")) || 0);
const digitos = (v: unknown) => String(v ?? "").replace(/\D/g, "");

function ubicarEncabezado(filas: unknown[][]) {
  const idx = filas.findIndex((f) => f.some((c) => /^codigocuentacontable$/.test(normalizeHeader(String(c ?? "")))));
  if (idx < 0) throw new Error('No se encontró el encabezado "Código cuenta contable": ¿es un balance de prueba de Siigo?');
  const col: Record<string, number> = {};
  filas[idx]!.forEach((c, i) => { const k = normalizeHeader(String(c ?? "")); if (k) col[k] = i; });
  const req = (k: string) => { if (col[k] === undefined) throw new Error(`Falta la columna "${k}" en el balance`); return col[k]!; };
  return { idx, col, req };
}

function cabecera(filas: unknown[][], idx: number) {
  const top = filas.slice(0, idx);
  const nit = top.map((f) => digitos(f[0])).find((d) => d.length >= 6 && d.length <= 10) ?? "";
  const periodo = top.map((f) => String(f[0] ?? "")).find((t) => /\d{4}/.test(t) && /\bal\b|-|a /i.test(t) && !/^\d+$/.test(t)) ?? "";
  return { nit, periodo };
}

/** Balance de prueba GENERAL → plan de cuentas (PUC) con nivel y si es transaccional. */
export function parseBalanceGeneral(filas: unknown[][]): BalanceParseado<FilaPuc> {
  const { idx, req } = ubicarEncabezado(filas);
  const c = { nivel: req("nivel"), trans: req("transaccional"), cod: req("codigocuentacontable"), nom: req("nombrecuentacontable"),
    si: req("saldoinicial"), d: req("movimientodebito"), cr: req("movimientocredito"), sf: req("saldofinal") };
  const out: FilaPuc[] = [];
  for (const f of filas.slice(idx + 1)) {
    const codigo = digitos(f[c.cod]);
    if (!codigo) continue;
    out.push({ codigo, nombre: String(f[c.nom] ?? "").trim(), nivel: String(f[c.nivel] ?? "").trim(),
      transaccional: /^s[ií]$/i.test(String(f[c.trans] ?? "").trim()),
      saldoInicial: num(f[c.si]), debito: num(f[c.d]), credito: num(f[c.cr]), saldoFinal: num(f[c.sf]) });
  }
  const { nit, periodo } = cabecera(filas, idx);
  return { nitEmpresa: nit, periodo, filas: out };
}

/** Balance de prueba POR TERCERO → saldos y movimientos por cuenta y tercero (incluye cartera 1305 y proveedores 22xx/23xx). */
export function parseBalanceTercero(filas: unknown[][]): BalanceParseado<FilaBalanceTercero> {
  const { idx, col, req } = ubicarEncabezado(filas);
  const c = { cod: req("codigocuentacontable"), nom: req("nombrecuentacontable"), id: req("identificacion"), nt: req("nombretercero"),
    si: req("saldoinicial"), d: req("movimientodebito"), cr: req("movimientocredito"), sf: req("saldofinal") };
  // la columna de sucursal está entre Identificación y Nombre tercero
  const suc = Object.entries(col).find(([, i]) => i > c.id && i < c.nt)?.[1];
  const out: FilaBalanceTercero[] = [];
  for (const f of filas.slice(idx + 1)) {
    const terceroNit = digitos(f[c.id]);
    const codigo = digitos(f[c.cod]);
    if (!terceroNit || !codigo) continue; // filas de totales por clase/grupo/cuenta no tienen tercero
    out.push({ codigo, nombreCuenta: String(f[c.nom] ?? "").trim(), terceroNit, sucursal: suc === undefined ? "" : String(f[suc] ?? "").trim(),
      terceroNombre: String(f[c.nt] ?? "").trim(), saldoInicial: num(f[c.si]), debito: num(f[c.d]), credito: num(f[c.cr]), saldoFinal: num(f[c.sf]) });
  }
  const { nit, periodo } = cabecera(filas, idx);
  return { nitEmpresa: nit, periodo, filas: out };
}
