import { naturalezaPorDefecto, normalizarConcepto, rolPorCuenta, soloDigitos } from "./puc";
import type { LineaContable, RolLinea, TipoDocumento } from "./types";

type Obj = Record<string, any>;

const fechaISO = (v: unknown): string | null => {
  const s = String(v ?? "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const centro = (v: any): string | null => {
  if (v == null) return null;
  if (typeof v === "object") return String(v.code ?? v.id ?? "") || null;
  return String(v) || null;
};

/** NIT del tercero principal del documento (Siigo cambia el nombre del campo según el tipo). */
export function nitDelDocumento(doc: Obj): string {
  return soloDigitos(
    doc.supplier?.identification ?? doc.customer?.identification ?? doc.provider?.identification ?? doc.third?.identification,
  );
}

function rolRetencion(r: Obj): RolLinea {
  const t = `${r.type ?? ""} ${r.name ?? ""}`.toLowerCase();
  if (/ica/.test(t)) return "reteica";
  if (/iva/.test(t)) return "reteiva";
  return "retefuente";
}

/**
 * Facturas de venta / compra / documento soporte.
 * Aprende CUENTA solo si el payload la trae (item.account.code); siempre aprende TARIFAS
 * de impuestos y retenciones cuando vienen en el documento.
 */
export function lineasDeFactura(tipo: TipoDocumento, doc: Obj): LineaContable[] {
  const nit = nitDelDocumento(doc);
  if (!nit) return [];
  const fecha = fechaISO(doc.date);
  const cc = centro(doc.cost_center);
  const esVenta = tipo === "venta";
  const out: LineaContable[] = [];
  const rolBase: RolLinea = esVenta ? "ingreso" : "gasto_costo";

  for (const it of (doc.items as Obj[]) ?? []) {
    const cuenta = soloDigitos(it.account?.code ?? it.accounting_account?.code ?? it.account_code);
    const rol = cuenta ? rolPorCuenta(cuenta) : rolBase;
    out.push({
      terceroNit: nit,
      tipoDocumento: tipo,
      fecha,
      cuenta,
      naturaleza: naturalezaPorDefecto(tipo, rol === "otro" ? rolBase : rol),
      valor: num(it.total ?? num(it.price) * (num(it.quantity) || 1)),
      rol: rol === "otro" ? rolBase : rol,
      concepto: normalizarConcepto(it.description),
      tarifa: null,
      centroCosto: cc,
    });
    for (const t of (it.taxes as Obj[]) ?? []) {
      const pct = t.percentage ?? t.rate;
      out.push({
        terceroNit: nit,
        tipoDocumento: tipo,
        fecha,
        cuenta: "",
        naturaleza: naturalezaPorDefecto(tipo, "iva"),
        valor: num(t.value),
        rol: "iva",
        concepto: "",
        tarifa: pct == null ? null : Math.round(num(pct) * 100) / 100,
        centroCosto: cc,
      });
    }
  }
  for (const r of ((doc.retentions ?? doc.withholdings) as Obj[]) ?? []) {
    const rol = rolRetencion(r);
    const pct = r.percentage ?? r.rate;
    out.push({
      terceroNit: nit,
      tipoDocumento: tipo,
      fecha,
      cuenta: "",
      naturaleza: naturalezaPorDefecto(tipo, rol),
      valor: num(r.value),
      rol,
      concepto: "",
      tarifa: pct == null ? null : Math.round(num(pct) * 100) / 100,
      centroCosto: cc,
    });
  }
  return out;
}

/**
 * Comprobantes contables, RC y RP: cada ítem trae cuenta y movimiento (Debit/Credit),
 * y normalmente su propio tercero. Es la fuente más fiel del auxiliar.
 */
export function lineasDeAsiento(tipo: TipoDocumento, doc: Obj): LineaContable[] {
  const nitDoc = nitDelDocumento(doc);
  const fecha = fechaISO(doc.date);
  const out: LineaContable[] = [];
  for (const it of (doc.items as Obj[]) ?? []) {
    const cuenta = soloDigitos(it.account?.code);
    if (!cuenta) continue;
    const mov = String(it.account?.movement ?? "").toLowerCase();
    const nit = soloDigitos(it.customer?.identification ?? it.supplier?.identification) || nitDoc;
    out.push({
      terceroNit: nit,
      tipoDocumento: tipo,
      fecha,
      cuenta,
      naturaleza: mov.startsWith("c") ? "C" : "D",
      valor: num(it.value),
      rol: rolPorCuenta(cuenta),
      concepto: normalizarConcepto(it.description),
      tarifa: null,
      centroCosto: centro(it.cost_center ?? doc.cost_center),
    });
  }
  return out;
}

export function lineasDeDocumento(tipo: TipoDocumento, doc: Obj): LineaContable[] {
  switch (tipo) {
    case "comprobante":
    case "recibo_caja":
    case "recibo_pago":
      return lineasDeAsiento(tipo, doc);
    default:
      return lineasDeFactura(tipo, doc);
  }
}

/** Calcula tarifas de IVA/retención faltantes a partir del valor / base del documento (auxiliar sin porcentajes). */
export function inferirTarifas(lineas: LineaContable[]): LineaContable[] {
  const base = lineas
    .filter((l) => l.rol === "gasto_costo" || l.rol === "ingreso")
    .reduce((s, l) => s + Math.abs(l.valor), 0);
  if (base <= 0) return lineas;
  return lineas.map((l) =>
    l.tarifa == null && ["iva", "retefuente", "reteica", "reteiva"].includes(l.rol)
      ? { ...l, tarifa: Math.round((Math.abs(l.valor) / base) * 10000) / 100 }
      : l,
  );
}
