import { sincronizarBalance } from "../balance/sync";
import { descargarHistorico, reconstruirReglas, sincronizarMaestros, sincronizarNuevos } from "../learning/train";
import { siigoDeOrg } from "../siigo-org";
import { supabaseAdmin } from "../supabase/admin";
import { Breaker } from "./breaker";

export type Job = { id: number; org_id: string | null; tipo: string; payload: Record<string, any>; intentos: number };
export type Resultado = { ok: true; siguiente?: { tipo: string; payload: Record<string, any>; clave?: string } } | { ok: false; error: string; reintentarSeg?: number };

const breakers = new Map<string, Breaker>();
export const breakerDe = (orgId: string) => breakers.get(orgId) ?? breakers.set(orgId, new Breaker()).get(orgId)!;

type Handler = (job: Job) => Promise<Resultado>;

/** Registro de manejadores. Cada tipo de trabajo es idempotente y reanudable. */
export const HANDLERS: Record<string, Handler> = {
  "sistema.ping": async () => ({ ok: true }),

  "sync.maestros": async (job) => {
    if (!job.org_id) return { ok: false, error: "Falta org_id" };
    const resumen = await sincronizarMaestros(supabaseAdmin(), await siigoDeOrg(job.org_id), job.org_id);
    return Object.values(resumen).some((v) => typeof v === "string") ? { ok: false, error: JSON.stringify(resumen) } : { ok: true };
  },

  /** Sincronización nocturna incremental; si llegan documentos nuevos, re-encola la reconstrucción de reglas. */
  "sync.incremental": async (job) => {
    if (!job.org_id) return { ok: false, error: "Falta org_id" };
    const b = breakerDe(job.org_id);
    if (b.isOpen()) return { ok: false, error: "Disyuntor abierto para la empresa", reintentarSeg: Math.ceil(b.retryAfterMs() / 1000) };
    const r = await sincronizarNuevos(supabaseAdmin(), await siigoDeOrg(job.org_id), job.org_id);
    const errores = Object.entries(r).filter(([, v]) => v.error && v.error !== "entrenamiento inicial pendiente");
    b.record(errores.length === 0);
    if (errores.length) return { ok: false, error: JSON.stringify(errores) };
    const nuevos = Object.values(r).reduce((s, v) => s + v.nuevos, 0);
    return nuevos > 0 ? { ok: true, siguiente: { tipo: "aprendizaje.reconstruir", payload: {}, clave: `reglas:${job.org_id}` } } : { ok: true };
  },

  /** PUC + balance por tercero del año (payload.anio, por defecto el actual). */
  "sync.balance": async (job) => {
    if (!job.org_id) return { ok: false, error: "Falta org_id" };
    const b = breakerDe(job.org_id);
    if (b.isOpen()) return { ok: false, error: "Disyuntor abierto para la empresa", reintentarSeg: Math.ceil(b.retryAfterMs() / 1000) };
    try {
      await sincronizarBalance(supabaseAdmin(), await siigoDeOrg(job.org_id), job.org_id, Number(job.payload.anio) || new Date().getFullYear());
      b.record(true);
      return { ok: true };
    } catch (e: any) { b.record(false); return { ok: false, error: String(e?.message ?? e) }; }
  },

  "aprendizaje.reconstruir": async (job) => {
    if (!job.org_id) return { ok: false, error: "Falta org_id" };
    await reconstruirReglas(supabaseAdmin(), job.org_id);
    return { ok: true };
  },

  /** Descarga reanudable del histórico; se re-encola a sí mismo hasta terminar y luego reconstruye reglas. */
  "entrenamiento.paso": async (job) => {
    if (!job.org_id) return { ok: false, error: "Falta org_id" };
    const db = supabaseAdmin();
    const b = breakerDe(job.org_id);
    if (b.isOpen()) return { ok: false, error: "Disyuntor abierto para la empresa", reintentarSeg: Math.ceil(b.retryAfterMs() / 1000) };
    const d = await descargarHistorico(db, await siigoDeOrg(job.org_id), job.org_id, { desde: job.payload.desde, reiniciar: !!job.payload.reiniciar, presupuestoMs: 50_000 });
    b.record(!Object.values(d.porRecurso).some((r) => r.error && !r.completado));
    if (!d.completo) return { ok: true, siguiente: { tipo: "entrenamiento.paso", payload: { desde: job.payload.desde }, clave: `entrenamiento:${job.org_id}` } };
    await reconstruirReglas(db, job.org_id);
    return { ok: true };
  },
};
