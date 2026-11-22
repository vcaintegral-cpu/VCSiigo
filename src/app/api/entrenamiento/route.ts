import { NextResponse } from "next/server";
import { auditar } from "@/lib/audit";
import { exigirRol, siigoDeOrg } from "@/lib/auth";
import { descargarHistorico, reconstruirReglas, sincronizarMaestros } from "@/lib/learning/train";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const maxDuration = 60;

/**
 * Entrenamiento por pasos reanudables. Llamar repetidamente hasta que `fase` sea "completado".
 * Body: { orgId, desde: "YYYY-MM-DD", reiniciar?: boolean }
 */
export async function POST(req: Request) {
  const { orgId, desde, reiniciar } = await req.json();
  if (!orgId || !/^\d{4}-\d{2}-\d{2}$/.test(desde ?? "")) {
    return NextResponse.json({ error: "orgId y desde (YYYY-MM-DD) son obligatorios" }, { status: 400 });
  }
  const g = await exigirRol(orgId, ["admin", "contador"]);
  if ("error" in g) return g.error;

  const db = supabaseAdmin();
  try {
    const siigo = await siigoDeOrg(orgId);
    if (reiniciar) await auditar({ orgId, userId: g.user.id, accion: "entrenamiento.iniciar", detalle: { desde } });

    const maestros = reiniciar ? await sincronizarMaestros(db, siigo, orgId) : undefined;
    const d = await descargarHistorico(db, siigo, orgId, { desde, reiniciar, presupuestoMs: 40_000 });
    if (!d.completo) return NextResponse.json({ fase: "descargando", maestros, descarga: d });

    const r = await reconstruirReglas(db, orgId);
    await db.from("entrenamiento_corridas").insert({
      org_id: orgId, iniciado_por: g.user.id, finalizada_en: new Date().toISOString(),
      documentos_leidos: r.documentos, lineas_analizadas: r.lineas, reglas_generadas: r.reglas,
      estado: "completada", detalle: { lineasSinCuenta: r.lineasSinCuenta, descarga: d.porRecurso },
    });
    await auditar({ orgId, userId: g.user.id, accion: "entrenamiento.completado", detalle: r });
    return NextResponse.json({ fase: "completado", descarga: d, resultado: r });
  } catch (e: any) {
    await auditar({ orgId, userId: g.user.id, accion: "entrenamiento.error", detalle: { error: e?.message } });
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}
