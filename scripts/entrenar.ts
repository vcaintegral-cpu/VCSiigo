/**
 * Entrenamiento local sin límite de tiempo:
 *   npx tsx --env-file=.env.local scripts/entrenar.ts <orgId> <desde:YYYY-MM-DD> [--reiniciar]
 * Usa las credenciales SIIGO_* del .env.local (no las guardadas en BD).
 */
import { descargarHistorico, reconstruirReglas, sincronizarMaestros } from "../src/lib/learning/train";
import { siigoFromEnv } from "../src/lib/siigo";
import { supabaseAdmin } from "../src/lib/supabase/admin";

async function main() {
  const [orgId, desde] = process.argv.slice(2);
  const reiniciar = process.argv.includes("--reiniciar");
  if (!orgId || !desde) throw new Error("Uso: entrenar.ts <orgId> <desde YYYY-MM-DD> [--reiniciar]");
  const db = supabaseAdmin();
  const siigo = siigoFromEnv();
  console.log("Probando conexión…", await siigo.probar());
  console.log("Maestros:", await sincronizarMaestros(db, siigo, orgId));
  let primera = true;
  for (;;) {
    const d = await descargarHistorico(db, siigo, orgId, { desde, reiniciar: reiniciar && primera, presupuestoMs: 5 * 60_000 });
    primera = false;
    console.log("Descarga:", JSON.stringify(d.porRecurso));
    if (d.completo) break;
  }
  console.log("Reglas:", await reconstruirReglas(db, orgId));
}
main().catch((e) => { console.error(e); process.exit(1); });
