# Bloque 0 · Infraestructura gratuita (investigación al 18-nov-2026)

**Metodología y límites de esta investigación:** consulté la web el 18-nov-2026. Los datos de Vercel, Supabase, Render, Resend, Upstash QStash y WhatsApp Cloud API salen de las búsquedas de esta sesión (fuentes abajo); varias son blogs de terceros, no las páginas oficiales. **Koyeb, Railway y Cloudflare Workers no los verifiqué en esta sesión**, por eso no los recomiendo como base. Antes de contratar, confirme cada cifra en la página oficial del proveedor: los planes gratuitos cambian.

## Tabla comparativa

| Necesidad | Opción | Capa gratuita (lo verificado) | Costo oculto / riesgo | Veredicto |
|---|---|---|---|---|
| App Next.js | **Vercel Hobby** | Cron máx. 1 vez al día; el plan Hobby es solo para uso **no comercial** ([docs cron](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing), [plan Hobby](https://vercel.com/docs/accounts/plans/hobby)) | Un despacho contable es uso comercial → requiere Pro | ❌ No para producción |
| App Next.js | **Render (Web Service gratis)** | 750 h/mes; se "duerme" tras 15 min sin tráfico y tarda hasta ~1 min en despertar ([docs](https://render.com/docs/free)) | Si lo mantiene despierto con pings gasta las 750 h; los cron jobs propios de Render se facturan por minuto según guías de terceros (fuentes en conflicto). No verifiqué si los términos permiten producción comercial | ✅ Para piloto/pruebas |
| Tareas programadas | **Upstash QStash** | 1.000 mensajes/día, 10 schedules, sin tarjeta ([precios](https://upstash.com/docs/qstash/overall/pricing)) | Reintentos podrían contar; una fuente de terceros dice 500/día | ✅ Dispara los endpoints del worker (también despierta Render) |
| BD + Auth + Storage | **Supabase Free** | 500 MB BD, 50.000 MAU, 1 GB archivos, 2 proyectos ([guía](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/)) | **Se pausa tras 7 días sin actividad**; sin backups gestionados; 500 MB se llenan con el JSON crudo de documentos | ✅ Con cron diario que lo mantenga activo |
| Correo | **Resend Free** | 100 correos/día y 3.000/mes ([límites](https://resend.com/docs/knowledge-base/resend-sending-limits)) | Necesita dominio propio verificado (DNS) para enviar a terceros | ✅ Suficiente para reportes diarios |
| WhatsApp | **Meta WhatsApp Cloud API** | Mensajes de servicio (el usuario escribe primero) gratis; plantillas utility/marketing se cobran por mensaje desde 2025–2026; Colombia ≈ US$0,0008–0,001 por utilidad según terceros ([Meta](https://developers.facebook.com/docs/whatsapp/pricing)) | Requiere cuenta Meta Business verificada y plantilla aprobada; el reporte automático diario lo inicia usted → es plantilla de pago (centavos) | ✅ Casi gratis, no 100 % gratis |

## Stack definido

1. **Next.js (App Router) en Render Web Service gratis** para pruebas y piloto. Para producción real con clientes: pasar a Render de pago o Vercel Pro (~US$20/mes) — el código no cambia.
2. **Supabase Free** (Postgres + Auth + Storage). Las credenciales de Siigo se guardan **cifradas con AES-256-GCM** antes de entrar a la BD.
3. **Upstash QStash** como "reloj": llama a los endpoints del piloto automático (Bloque 5). Cada endpoint es **reanudable** (cursor en `sync_estado`), así que ningún proceso depende de un tiempo de ejecución largo.
4. **Resend** para correo y **Meta WhatsApp Cloud API** para WhatsApp (Bloque 5).

Un cron diario hacia Supabase evita su pausa por inactividad.

### Qué NO puedo garantizar
- Que los términos de Render gratis permitan uso comercial en producción (no lo pude verificar).
- Los precios exactos de WhatsApp para Colombia hoy (fuentes de terceros discrepan).
