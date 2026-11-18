import { calcularConfianza } from "./confidence";
import type { LineaContable, ReglaCalculada } from "./types";

const ROLES_CON_CONCEPTO = new Set(["gasto_costo", "ingreso", "activo"]);

function moda<T>(valores: T[]): T | null {
  if (!valores.length) return null;
  const m = new Map<T, number>();
  for (const v of valores) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Agrupa líneas por (tercero, tipo, rol, concepto) y por cada cuenta/naturaleza observada
 * genera una regla con su nivel de confianza.
 * Genera siempre la regla general (concepto = '') y, para gasto/ingreso/activo,
 * también reglas por concepto cuando la descripción existe.
 */
export function agregarReglas(lineas: LineaContable[], hoy = new Date()): ReglaCalculada[] {
  type Acum = { n: number; tarifas: number[]; ccs: string[]; min: string | null; max: string | null };
  const grupos = new Map<string, { total: number; patrones: Map<string, Acum>; meta: LineaContable }>();

  const agregar = (l: LineaContable, concepto: string) => {
    const gk = [l.terceroNit, l.tipoDocumento, l.rol, concepto].join("|");
    let g = grupos.get(gk);
    if (!g) {
      g = { total: 0, patrones: new Map(), meta: l };
      grupos.set(gk, g);
    }
    g.total++;
    const pk = `${l.cuenta}|${l.naturaleza}`;
    let a = g.patrones.get(pk);
    if (!a) {
      a = { n: 0, tarifas: [], ccs: [], min: null, max: null };
      g.patrones.set(pk, a);
    }
    a.n++;
    if (l.tarifa != null) a.tarifas.push(l.tarifa);
    if (l.centroCosto) a.ccs.push(l.centroCosto);
    if (l.fecha) {
      if (!a.min || l.fecha < a.min) a.min = l.fecha;
      if (!a.max || l.fecha > a.max) a.max = l.fecha;
    }
  };

  for (const l of lineas) {
    if (!l.terceroNit) continue;
    agregar(l, "");
    if (l.concepto && ROLES_CON_CONCEPTO.has(l.rol)) agregar(l, l.concepto);
  }

  const reglas: ReglaCalculada[] = [];
  for (const [gk, g] of grupos) {
    const concepto = gk.split("|")[3];
    for (const [pk, a] of g.patrones) {
      const [cuenta, naturaleza] = pk.split("|");
      reglas.push({
        terceroNit: g.meta.terceroNit,
        tipoDocumento: g.meta.tipoDocumento,
        rolLinea: g.meta.rol,
        concepto,
        cuentaPuc: cuenta,
        naturaleza: naturaleza as "D" | "C",
        tarifa: moda(a.tarifas),
        centroCosto: moda(a.ccs),
        evidenciaN: a.n,
        totalN: g.total,
        confianza: calcularConfianza(a.n, g.total, a.max, hoy),
        primeraVez: a.min,
        ultimaVez: a.max,
      });
    }
  }
  return reglas;
}
