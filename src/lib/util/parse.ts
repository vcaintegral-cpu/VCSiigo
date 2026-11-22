/** Utilidades de normalización (portadas y corregidas del prototipo vcsiigo-fb57acc9). */

export const normalizeHeader = (header: string): string =>
  String(header).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** FV-123 == FV123 (para comparar números de factura). */
export const normalizeInvoiceNumber = (value: string): string => String(value).toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * Convierte montos en formato colombiano (1.234.567,89), anglosajón (1,234,567.89) o numérico.
 * Devuelve el valor ABSOLUTO (los extractos traen egresos con signo).
 */
export function parseAmount(raw: unknown): number {
  if (typeof raw === "number") return Math.abs(raw);
  let s = String(raw ?? "").trim().replace(/[^0-9,.-]/g, "");
  if (!s) return 0;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    // el último separador es el decimal
    s = lastComma > lastDot ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (lastComma >= 0) {
    // "1234,56" (decimal) vs "1,234" / "1,234,567" (miles)
    s = /,\d{1,2}$/.test(s) && (s.match(/,/g)?.length ?? 0) === 1 ? s.replace(",", ".") : s.replace(/,/g, "");
  } else if (lastDot >= 0) {
    // "1234.56" (decimal) vs "1.234" / "1.234.567" (miles)
    if ((s.match(/\./g)?.length ?? 0) > 1 || /\.\d{3}$/.test(s)) s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? Math.abs(n) : 0;
}

/** Fechas de Excel (serial, Date o texto dd/mm/aaaa) → ISO yyyy-mm-dd. Colombia usa día/mes/año. */
export function parseDate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  if (typeof raw === "number" && raw > 0) return new Date(Date.UTC(1899, 11, 30) + raw * 86400000).toISOString().slice(0, 10);
  const text = String(raw ?? "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const dmy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = y!.length === 2 ? `20${y}` : y;
    return `${year}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
  }
  return "";
}

export const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
export const daysBetween = (a: string, b: string) =>
  !a || !b ? 0 : Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000;
