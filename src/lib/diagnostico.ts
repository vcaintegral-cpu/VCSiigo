/**
 * Redactor para compartir la "forma" de las respuestas de Siigo sin datos del cliente:
 * conserva nombres de campos, tipos y valores NO sensibles de catálogo; oculta cifras,
 * identificaciones, nombres y textos.
 */
const CONSERVAR = new Set(["movement", "type", "prefix", "percentage", "currency", "stamp", "discount_type", "tax_included", "supplier_by_item", "active", "branch_office", "quote", "consecutive_manual", "automatic_number"]);

export function forma(valor: unknown, clave = "", profundidad = 0): unknown {
  if (valor === null || valor === undefined) return null;
  if (Array.isArray(valor)) {
    if (valor.length === 0) return [];
    return [forma(valor[0], clave, profundidad + 1), valor.length > 1 ? `...(+${valor.length - 1} mas)` : undefined].filter((x) => x !== undefined);
  }
  if (typeof valor === "object") {
    if (profundidad > 8) return "<objeto>";
    return Object.fromEntries(Object.entries(valor as Record<string, unknown>).map(([k, v]) => [k, forma(v, k, profundidad + 1)]));
  }
  if (CONSERVAR.has(clave) && (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean")) return valor;
  if (clave === "code" && typeof valor === "string" && /^\d{4,10}$/.test(valor)) return valor; // cuentas PUC (no personales)
  if (typeof valor === "number") return "<number>";
  if (typeof valor === "boolean") return valor;
  return `<string:${String(valor).length}>`;
}

const ENCABEZADO = /(cuenta|nombre|saldo|d[eé]bito|cr[eé]dito|tercero|identific|nit|c[oó]digo|descrip|movim|total|inicial|final|anterior|mes|a[nñ]o)/i;

/**
 * Forma de una hoja de Excel: conserva encabezados y SOLO los códigos de cuenta (columna cuyo encabezado
 * contiene "código cuenta"); oculta nombres, identificaciones (NIT/cédulas) y cifras.
 * (Una versión anterior conservaba cualquier número de 4-10 dígitos y dejó pasar NIT; corregido.)
 */
export function formaHoja(filas: unknown[][], max = 10): unknown[][] {
  const colCodigo = (() => {
    for (const f of filas) {
      const i = f.findIndex((c) => /c[oó]digo\s+cuenta/i.test(String(c ?? "")));
      if (i >= 0) return i;
    }
    return -1;
  })();
  return filas.slice(0, max).map((fila) =>
    fila.map((c, i) => {
      if (c === null || c === undefined || c === "") return null;
      if (typeof c === "number") return "<number>";
      const t = String(c).trim();
      if (i === colCodigo && /^\d{1,10}$/.test(t)) return t;
      if (t.length <= 30 && ENCABEZADO.test(t) && !/^\d+$/.test(t)) return t;
      return `<string:${t.length}>`;
    }),
  );
}
