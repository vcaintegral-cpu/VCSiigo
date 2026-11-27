import type { SupabaseClient } from "@supabase/supabase-js";

/** ¿`ahora` cae dentro de la ventana [inicio, fin) en la zona horaria dada? Admite ventanas que cruzan la medianoche. */
export function enVentana(ahora: Date, inicio: string, fin: string, tz = "America/Bogota"): boolean {
  const hm = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(ahora);
  const a = inicio.slice(0, 5), b = fin.slice(0, 5);
  return a <= b ? hm >= a && hm < b : hm >= a || hm < b;
}

export const diaLocal = (ahora: Date, tz = "America/Bogota") => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(ahora); // YYYY-MM-DD

/**
 * Encola, una vez por noche y por empresa, la sincronización de lectura.
 * (El envío a Siigo del piloto automático es independiente y sigue apagado hasta activar `piloto_activo`.)
 */
export async function programar(db: SupabaseClient, ahora = new Date()) {
  const { data: cfgs } = await db.from("empresa_config").select("org_id,hora_inicio,hora_fin").eq("sync_activo", true);
  let encolados = 0;
  for (const c of cfgs ?? []) {
    if (!enVentana(ahora, c.hora_inicio ?? "18:00", c.hora_fin ?? "07:00")) continue;
    const clave = `sync:${c.org_id}:${diaLocal(ahora)}`;
    const { data: ya } = await db.from("jobs").select("id").eq("clave_unica", clave).limit(1);
    if (ya?.length) continue;
    const { error } = await db.from("jobs").insert({ org_id: c.org_id, tipo: "sync.incremental", payload: {}, clave_unica: clave });
    if (!error) encolados++;
  }
  return encolados;
}
