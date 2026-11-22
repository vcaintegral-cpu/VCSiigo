import { NextResponse } from "next/server";
import { auditar } from "@/lib/audit";
import { exigirRol } from "@/lib/auth";
import { agregarReglas } from "@/lib/learning/aggregate";
import { lineasDeAuxiliarCsv } from "@/lib/learning/auxiliar-csv";
import { guardarReglas } from "@/lib/learning/train";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Aprende desde el "Auxiliar" exportado de Siigo en CSV (multipart: orgId + archivo). */
export async function POST(req: Request) {
  const form = await req.formData();
  const orgId = String(form.get("orgId") ?? "");
  const archivo = form.get("archivo");
  if (!orgId || !(archivo instanceof File)) {
    return NextResponse.json({ error: "orgId y archivo son obligatorios" }, { status: 400 });
  }
  const g = await exigirRol(orgId, ["admin", "contador"]);
  if ("error" in g) return g.error;

  const { lineas, columnas, error, filas } = lineasDeAuxiliarCsv(await archivo.text());
  if (error) return NextResponse.json({ error, columnasDetectadas: columnas }, { status: 422 });
  const reglas = agregarReglas(lineas);
  const n = await guardarReglas(supabaseAdmin(), orgId, reglas, "auxiliar_csv", false);
  await auditar({ orgId, userId: g.user.id, accion: "entrenamiento.auxiliar_csv", detalle: { filas, reglas: n } });
  return NextResponse.json({ filas, reglas: n, columnasDetectadas: columnas });
}
