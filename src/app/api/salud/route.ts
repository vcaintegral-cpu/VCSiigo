import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Salud para Fly.io y monitoreo: base de datos alcanzable y worker con latido reciente. */
export async function GET() {
  await connection();
  try {
    const { data, error } = await supabaseAdmin().from("worker_latidos").select("worker,ultimo_latido").order("ultimo_latido", { ascending: false }).limit(1);
    if (error) throw new Error(error.message);
    const ultimo = data?.[0]?.ultimo_latido ? new Date(data[0].ultimo_latido).getTime() : 0;
    const edadSeg = ultimo ? Math.round((Date.now() - ultimo) / 1000) : null;
    return Response.json({ web: "ok", db: "ok", worker_latido_hace_seg: edadSeg, worker: edadSeg !== null && edadSeg < 120 ? "ok" : "sin_latido" });
  } catch (e) {
    return Response.json({ web: "ok", db: "error", detalle: e instanceof Error ? e.message : String(e) }, { status: 503 });
  }
}
