# PLAN DE CONSTRUCCIÓN · ERP Contable + Piloto Automático sobre Siigo Nube

Rama de trabajo: `claude/erp-siigo-nube-colombia-646d0w` · Stack: Next.js 16 (App Router) · TypeScript · Tailwind 4 · Supabase · Siigo API v1

Leyenda: `[x]` hecho y probado · `[~]` hecho pero **pendiente de validar con su cuenta real de Siigo** · `[ ]` por hacer

## DECISIONES (22-nov-2026)
- Se reemplaza el Bloque 0 original: **no se usa hosting que duerma**. Web (Next.js) + **worker siempre encendido** + Supabase de pago. Ver `docs/ARQUITECTURA_NUCLEO.md`.
- Opción B elegida por la usuaria: núcleo nuevo en `VCSiigo`; `vccausacion` no se sigue usando (contiene datos de terceros, no se borra). Se podrán portar módulos puros propios (con sus pruebas) tras auditarlos.
- Documentación de Siigo leída y archivada: `docs/SIIGO_API_NOTAS.md` y `docs/siigo-api/`.
- Pendiente de la usuaria: repositorio de la herramienta de planos (GitHub), presupuesto, credenciales/host `api.siigo.com`, auxiliar y balance por tercero de ejemplo.

- Un solo repositorio al final: ver `docs/CONSOLIDACION_REPOS.md`.
- Costo: dominio propio reutilizado (sin costo); Supabase **nuevo gratuito y propio** (el de Lovable queda con Lovable); un servidor pequeño siempre encendido para web + worker (~US$5–10/mes según fuentes no oficiales, por confirmar). Backups propios porque el plan gratuito no los incluye.

## NÚCLEO 24/7 (en construcción)
- [x] Esquema: empresa_config, cola `jobs` (SKIP LOCKED, reintentos exponenciales), `documentos_causacion` con identidad remota inmutable (trigger), `excepciones`, latidos
- [x] Worker (`npm run worker`), limitador 90 req/min por empresa, disyuntor por empresa
- [x] Egresos: cruce banco↔pagos (portado y mejorado) + recibo de pago correcto `/v1/payment-receipts` tipo Detailed (19 pruebas)
- [ ] Cruce con retenciones: el movimiento bancario es el NETO; hoy el cruce compara contra el bruto (hallazgo de las pruebas)
- [ ] Cola → handlers de compras/DS/egresos con las 7 compuertas
- [ ] Bandeja de excepciones (UI) y modo sombra/backtesting
- [ ] Cartera por pagar vía `/v1/accounts-payable` (reemplaza listar `/v1/purchases`)

## BLOQUE 0 · Infraestructura (reemplazado, ver decisiones)
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
- [x] Documentación de Siigo leída (22-nov-2026): rate limit 100/min por empresa, Idempotency-Key, sin listado de compras/DS, sin PUC, líneas de facturas/compras sin cuenta contable
- [ ] **Rediseño del aprendizaje**: fuente primaria = Auxiliar/Balance por tercero (Excel vía `/v1/test-balance-report-by-thirdparty` o carga manual) + journals/RC/RP por API
- [ ] Decidir infraestructura 24/7 (ver respuesta en el chat; el Bloque 0 original con hosting "que duerme" queda reemplazado)
- [ ] Prueba real con su cuenta de Siigo y su proyecto Supabase

### Hallazgo clave (verificado en la documentación oficial)
Las facturas de venta y de compra **no devuelven la cuenta contable por línea**, y las compras/documentos soporte **no tienen listado**. Solo `journals`, `vouchers` y `payment-receipts` traen `account.code` por línea. Por eso el aprendizaje de precedentes debe basarse en el **auxiliar/balance por tercero**, no en los GET de facturas.

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
