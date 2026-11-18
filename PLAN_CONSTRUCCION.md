# PLAN DE CONSTRUCCIÓN · ERP Contable + Piloto Automático sobre Siigo Nube

Rama de trabajo: `claude/erp-siigo-nube-colombia-646d0w` · Stack: Next.js 16 (App Router) · TypeScript · Tailwind 4 · Supabase · Siigo API v1

Leyenda: `[x]` hecho y probado · `[~]` hecho pero **pendiente de validar con su cuenta real de Siigo** · `[ ]` por hacer

## BLOQUE 0 · Infraestructura gratuita
- [x] Investigación y tabla comparativa → `docs/BLOQUE0_INFRAESTRUCTURA.md`
- [x] Stack definido (Render + Supabase + QStash + Resend + WhatsApp Cloud API)
- [ ] Confirmar en páginas oficiales Koyeb / Railway / Cloudflare (no verificados)

## BLOQUE 1 · Cimientos, multiusuario, Siigo y aprendizaje histórico
- [x] Proyecto Next.js + TypeScript + Tailwind (compila, lint limpio)
- [x] `supabase/schema.sql`: organizaciones, perfiles, membresías con roles (admin/contador/auxiliar), RLS, auditoría de solo inserción
- [x] Espejo de maestros: PUC, terceros, productos, impuestos, centros de costo, tipos de comprobante
- [x] `reglas_contables` (memoria por NIT + tipo de documento + rol + concepto, con confianza)
- [x] Cliente `src/lib/siigo.ts`: `POST /auth`, renovación automática, `Partner-Id`, reintentos 429/5xx, paginación (probado con mocks)
- [x] Credenciales Siigo cifradas AES-256-GCM por organización
- [x] Motor de aprendizaje: descarga reanudable → líneas contables → reglas con confianza (8 pruebas unitarias)
- [x] Importador alterno del **Auxiliar en CSV** exportado de Siigo (mapeador flexible de columnas)
- [~] Rutas exactas de `purchase-support-documents`, `payment-receipts`, `accounts` (PUC) y parámetro de filtro por fecha (`date_start`)
- [~] Qué campos de cuenta contable devuelve cada GET de Siigo (ver riesgo abajo)
- [ ] Prueba real con su cuenta de Siigo y su proyecto Supabase

### ⚠️ Riesgo conocido del Bloque 1
No pude leer `developers.siigo.com` desde esta sesión (host bloqueado por la red). Si los GET de facturas/compras **no devuelven la cuenta contable por línea**, el motor aprende de ellos solo **tarifas** de IVA/retenciones; las **cuentas** se aprenden de comprobantes, RC y RP (que sí traen `account.code`) o del **Auxiliar en CSV**. El resultado de su primera corrida (`lineasSinCuenta`) lo dirá con certeza.

## BLOQUE 2 · Causación, pre-validación DIAN y nómina electrónica
- [ ] Importar Excel/CSV/PDF con vista previa editable
- [ ] Ventas, compras, documentos soporte, nómina y provisiones
- [ ] Bandeja "Auditoría Pre-DIAN" (`stamp.send=false`) y envío masivo
- [ ] Archivo de Nómina Electrónica

## BLOQUE 3 · Recibos de caja y egresos avanzados
- [ ] Cartera abierta CxC/CxP en tiempo real · pago masivo · anticipos · retenciones, descuentos, diferencia en cambio y ajuste al peso

## BLOQUE 4 · Nube y conciliaciones
- [ ] Google Drive / OneDrive · conciliación bancaria y de caja · conciliación Token DIAN

## BLOQUE 5 · Piloto automático y reportes
- [ ] Worker (QStash) · bandeja de excepciones · conciliación diaria · reporte por Resend y WhatsApp
