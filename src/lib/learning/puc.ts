import type { RolLinea, TipoDocumento } from "./types";

/** Clasifica una cuenta del PUC colombiano (Decreto 2650/93) según su rol en el asiento. */
export function rolPorCuenta(cuenta: string): RolLinea {
  const c = cuenta.replace(/\D/g, "");
  if (!c) return "otro";
  if (c.startsWith("2408")) return "iva";
  if (c.startsWith("2365") || c.startsWith("135515")) return "retefuente";
  if (c.startsWith("2367") || c.startsWith("135517")) return "reteiva";
  if (c.startsWith("2368") || c.startsWith("135518")) return "reteica";
  if (c.startsWith("11")) return "banco_caja";
  if (c.startsWith("2205") || c.startsWith("2335") || c.startsWith("2105") || c.startsWith("2210")) {
    return "contrapartida_cxp";
  }
  if (c.startsWith("1305") || c.startsWith("1310") || c.startsWith("1315")) return "contrapartida_cxc";
  if (c.startsWith("4")) return "ingreso";
  if (/^[567]/.test(c)) return "gasto_costo";
  if (/^(14|15|16|17)/.test(c)) return "activo";
  return "otro";
}

/** Naturaleza esperada de un rol dentro de un tipo de documento (para payloads sin débito/crédito). */
export function naturalezaPorDefecto(tipo: TipoDocumento, rol: RolLinea): "D" | "C" {
  const esVenta = tipo === "venta";
  switch (rol) {
    case "gasto_costo":
    case "activo":
      return "D";
    case "ingreso":
      return "C";
    case "iva":
      return esVenta ? "C" : "D";
    case "retefuente":
    case "reteica":
    case "reteiva":
      return esVenta ? "D" : "C"; // venta: retención a favor; compra: retención por pagar
    case "impoconsumo":
      return esVenta ? "C" : "D";
    case "autorretencion":
      return "C";
    case "contrapartida_cxp":
      return "C";
    case "contrapartida_cxc":
      return "D";
    default:
      return "D";
  }
}

export const soloDigitos = (s: unknown): string => String(s ?? "").replace(/\D/g, "");

export function normalizarConcepto(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0-9]+/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 6)
    .join(" ");
}

/** Clasifica un impuesto/retención de Siigo (taxes[].type o nombre) en un rol de línea. */
export function rolPorTipoImpuesto(tipo: unknown, nombre: unknown = ""): RolLinea {
  const t = `${tipo ?? ""} ${nombre ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/reteiva|rete iva|iva retenido/.test(t)) return "reteiva";
  if (/reteica|rete ica|ica retenido/.test(t)) return "reteica";
  if (/autoret|autorret/.test(t)) return "autorretencion";
  if (/retefuente|rete fuente|retencion en la fuente|retencion/.test(t)) return "retefuente";
  if (/consumo|impoconsumo|\binc\b/.test(t)) return "impoconsumo";
  if (/\biva\b/.test(t)) return "iva";
  return "otro";
}
