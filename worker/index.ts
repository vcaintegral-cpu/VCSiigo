/**
 * Worker 24/7. Ejecutar con:  npm run worker   (lee .env.local)
 * - Reclama trabajos de la cola en Postgres (SKIP LOCKED) y los ejecuta con reintentos exponenciales.
 * - Emite latidos para que la web/alertas detecten si se detiene.
 * - Apagado limpio con SIGTERM (el hosting lo envía al desplegar).
 */
import { supabaseAdmin } from "../src/lib/supabase/admin";
import { HANDLERS, type Job } from "../src/lib/worker/handlers";

const WORKER = `${process.env.HOSTNAME ?? "local"}-${process.pid}`;
const POLL_MS = 3_000;
const CONCURRENCIA = 3;
let parar = false;
process.on("SIGTERM", () => (parar = true));
process.on("SIGINT", () => (parar = true));

const db = supabaseAdmin();
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ejecutar(job: Job) {
  const h = HANDLERS[job.tipo];
  try {
    if (!h) throw new Error(`Tipo de trabajo desconocido: ${job.tipo}`);
    const r = await h(job);
    if (r.ok) {
      if (r.siguiente) {
        await db.from("jobs").insert({ org_id: job.org_id, tipo: r.siguiente.tipo, payload: r.siguiente.payload, clave_unica: r.siguiente.clave ?? null });
      }
      await db.rpc("terminar_job", { p_id: job.id, p_ok: true });
    } else {
      await db.rpc("terminar_job", { p_id: job.id, p_ok: false, p_error: r.error.slice(0, 2000), p_reintentar_seg: r.reintentarSeg ?? 60 });
    }
  } catch (e: any) {
    console.error(`[job ${job.id} ${job.tipo}]`, e?.message ?? e);
    await db.rpc("terminar_job", { p_id: job.id, p_ok: false, p_error: String(e?.message ?? e).slice(0, 2000) });
  }
}

async function main() {
  console.log(`[worker] ${WORKER} iniciado`);
  let ultimoLatido = 0;
  while (!parar) {
    if (Date.now() - ultimoLatido > 30_000) {
      await db.from("worker_latidos").upsert({ worker: WORKER, ultimo_latido: new Date().toISOString() });
      ultimoLatido = Date.now();
    }
    const { data, error } = await db.rpc("reclamar_jobs", { p_worker: WORKER, p_limite: CONCURRENCIA });
    if (error) { console.error("[worker] reclamar_jobs:", error.message); await dormir(10_000); continue; }
    if (!data?.length) { await dormir(POLL_MS); continue; }
    await Promise.all((data as Job[]).map(ejecutar));
  }
  console.log("[worker] detenido limpiamente");
}
main().catch((e) => { console.error(e); process.exit(1); });
