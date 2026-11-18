export const instant = false; // página dinámica (sesión por cookies)

import { supabaseServer } from "@/lib/supabase/server";
import { PanelSiigo } from "./panel";

export default async function Dashboard() {
  const sb = await supabaseServer();
  const { data: miembros } = await sb.from("miembros").select("rol, organizaciones(id, nombre, nit)");
  const orgs = (miembros ?? []).map((m: any) => ({ ...m.organizaciones, rol: m.rol }));
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Panel · Bloque 1</h1>
      {orgs.length === 0 && <p>No perteneces a ninguna organización. Crea una con la función SQL <code>crear_organizacion()</code> (ver LEEME_BLOQUE1).</p>}
      {orgs.map((o: any) => <PanelSiigo key={o.id} org={o} />)}
    </main>
  );
}
