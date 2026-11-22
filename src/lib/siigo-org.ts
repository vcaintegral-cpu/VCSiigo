import { descifrar } from "./crypto";
import { SiigoClient } from "./siigo";
import { supabaseAdmin } from "./supabase/admin";

const cache = new Map<string, { client: SiigoClient; stamp: string }>();

/** Cliente Siigo de una empresa (credenciales cifradas en BD). Se reutiliza para conservar el token y el ritmo. */
export async function siigoDeOrg(orgId: string): Promise<SiigoClient> {
  const { data, error } = await supabaseAdmin().from("siigo_credenciales").select("*").eq("org_id", orgId).maybeSingle();
  if (error || !data) throw new Error("La empresa no tiene credenciales de Siigo configuradas");
  const hit = cache.get(orgId);
  if (hit && hit.stamp === data.actualizado_en) return hit.client;
  const client = new SiigoClient({
    username: descifrar(data.username_cifrado),
    accessKey: descifrar(data.access_key_cifrada),
    partnerId: process.env.SIIGO_PARTNER_ID || data.partner_id,
    baseUrl: data.base_url,
  });
  cache.set(orgId, { client, stamp: data.actualizado_en });
  return client;
}
