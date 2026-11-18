import { NextResponse } from "next/server";
import { auditar } from "@/lib/audit";
import { exigirRol } from "@/lib/auth";
import { cifrar } from "@/lib/crypto";
import { SiigoClient } from "@/lib/siigo";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Guarda (cifradas) las credenciales Siigo de una organización y prueba la conexión. Solo admin. */
export async function POST(req: Request) {
  const { orgId, username, accessKey, partnerId, baseUrl } = await req.json();
  if (!orgId || !username || !accessKey || !partnerId) {
    return NextResponse.json({ error: "orgId, username, accessKey y partnerId son obligatorios" }, { status: 400 });
  }
  const g = await exigirRol(orgId, ["admin"]);
  if ("error" in g) return g.error;

  try {
    const cliente = new SiigoClient({ username, accessKey, partnerId, baseUrl });
    const r = await cliente.probar();
    await supabaseAdmin().from("siigo_credenciales").upsert({
      org_id: orgId, base_url: baseUrl ?? "https://api.siigo.com", username_cifrado: cifrar(username),
      access_key_cifrada: cifrar(accessKey), partner_id: partnerId,
      ultima_prueba_ok: new Date().toISOString(), actualizado_en: new Date().toISOString(),
    });
    await auditar({ orgId, userId: g.user.id, accion: "siigo.probar", detalle: { ok: true } });
    return NextResponse.json(r);
  } catch (e: any) {
    await auditar({ orgId, userId: g.user.id, accion: "siigo.probar", detalle: { ok: false, status: e?.status } });
    return NextResponse.json({ ok: false, error: e?.message ?? "Error", status: e?.status }, { status: 502 });
  }
}
