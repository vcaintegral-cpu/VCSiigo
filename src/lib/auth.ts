import { NextResponse } from "next/server";
import { descifrar } from "./crypto";
import { SiigoClient } from "./siigo";
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

/** Construye el cliente Siigo de una organización con sus credenciales cifradas. */
export async function siigoDeOrg(orgId: string) {
  const { data, error } = await supabaseAdmin().from("siigo_credenciales").select("*").eq("org_id", orgId).maybeSingle();
  if (error || !data) throw new Error("La organización no tiene credenciales de Siigo configuradas");
  return new SiigoClient({
    username: descifrar(data.username_cifrado), accessKey: descifrar(data.access_key_cifrada),
    partnerId: data.partner_id, baseUrl: data.base_url,
  });
}
