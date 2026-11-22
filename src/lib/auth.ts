import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabase/admin";
import { supabaseServer } from "./supabase/server";

export type Rol = "admin" | "contador" | "auxiliar";

/** Exige sesión + membresía en la organización con uno de los roles permitidos. */
export async function exigirRol(orgId: string, permitidos: Rol[]) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "No autenticado" }, { status: 401 }) } as const;
  const { data: m } = await supabaseAdmin().from("miembros").select("rol").eq("org_id", orgId).eq("user_id", user.id).maybeSingle();
  if (!m || !permitidos.includes(m.rol as Rol)) {
    return { error: NextResponse.json({ error: "Sin permiso" }, { status: 403 }) } as const;
  }
  return { user, rol: m.rol as Rol } as const;
}

export { siigoDeOrg } from "./siigo-org";
