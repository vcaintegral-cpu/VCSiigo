"use client";
import { useState } from "react";

type Org = { id: string; nombre: string; nit?: string; rol: string };

export function PanelSiigo({ org }: { org: Org }) {
  const [f, setF] = useState({ username: "", accessKey: "", partnerId: "" });
  const [desde, setDesde] = useState(`${new Date().getFullYear() - 1}-01-01`);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const add = (s: string) => setLog((l) => [...l, s]);

  async function probar() {
    setBusy(true);
    const r = await fetch("/api/siigo/probar", { method: "POST", body: JSON.stringify({ orgId: org.id, ...f }) });
    add(`Conexión: ${JSON.stringify(await r.json())}`);
    setBusy(false);
  }

  async function entrenar() {
    setBusy(true);
    let reiniciar = true;
    for (let i = 0; i < 200; i++) {
      const r = await fetch("/api/entrenamiento", { method: "POST", body: JSON.stringify({ orgId: org.id, desde, reiniciar }) });
      const j = await r.json();
      reiniciar = false;
      add(`${j.fase ?? "error"}: ${JSON.stringify(j.resultado ?? j.descarga?.porRecurso ?? j.error)}`);
      if (j.fase !== "descargando") break;
    }
    setBusy(false);
  }

  const puede = org.rol !== "auxiliar";
  return (
    <section className="space-y-3 rounded border p-4">
      <h2 className="font-medium">{org.nombre} <span className="text-sm text-gray-500">({org.rol})</span></h2>
      {org.rol === "admin" && (
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="rounded border p-2" placeholder="Usuario API Siigo" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} />
          <input className="rounded border p-2" placeholder="Access key" type="password" value={f.accessKey} onChange={(e) => setF({ ...f, accessKey: e.target.value })} />
          <input className="rounded border p-2" placeholder="Partner-Id" value={f.partnerId} onChange={(e) => setF({ ...f, partnerId: e.target.value })} />
          <button disabled={busy} onClick={probar} className="rounded bg-black p-2 text-white sm:col-span-3">Guardar y probar conexión</button>
        </div>
      )}
      {puede && (
        <div className="flex gap-2">
          <input type="date" className="rounded border p-2" value={desde} onChange={(e) => setDesde(e.target.value)} />
          <button disabled={busy} onClick={entrenar} className="flex-1 rounded bg-blue-700 p-2 text-white">Entrenar con histórico de Siigo</button>
        </div>
      )}
      <pre className="max-h-64 overflow-auto rounded bg-gray-100 p-2 text-xs">{log.join("\n")}</pre>
    </section>
  );
}
