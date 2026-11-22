import { supabaseAdmin } from "./supabase/admin";

export async function auditar(e: {
  orgId?: string | null; userId?: string | null; accion: string;
  entidad?: string; entidadId?: string; detalle?: Record<string, unknown>; ip?: string | null;
}) {
  const { error } = await supabaseAdmin().from("auditoria_log").insert({
    org_id: e.orgId ?? null, user_id: e.userId ?? null, accion: e.accion, entidad: e.entidad ?? null,
    entidad_id: e.entidadId ?? null, detalle: e.detalle ?? {}, ip: e.ip ?? null,
  });
  if (error) console.error("auditoria_log:", error.message);
}
