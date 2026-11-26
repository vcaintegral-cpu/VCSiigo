# Siigo API (Colombia) · notas verificadas

Fuente: https://developers.siigo.com/docs/siigoapi (leída el 22-nov-2026). Copia de las páginas por endpoint en `docs/siigo-api/` (texto extraído; el sitio puede cambiar).
Todo lo que está marcado **[PRUEBA REAL]** no está definido por la documentación y debe validarse con una empresa de prueba antes de automatizarlo.

## Reglas transversales
- Headers siempre: `Authorization: <access_token>` y `Partner-Id` (3–100 alfanuméricos, sin espacios; **el mismo valor para todas las empresas**; Siigo bloquea a quien envíe uno falso).
- **100 peticiones/minuto por empresa de Siigo.** Timeout recomendado ≥ 120 s en creaciones.
- `Idempotency-Key` (opcional, alfanumérico, ≤ 30 car., solo POST) en: invoices, credit-notes, journals, vouchers. Reintento seguro sin duplicar. (Para purchases, payment-receipts y DS la doc de idempotencia no lo lista → control propio de duplicados.)
- Bloqueo temporal del usuario API si >80 % de las peticiones fallan durante 7 días → el worker corta ante errores consecutivos.
- Errores: `{ Status, Errors:[{Code, Message, Params, Detail}] }`. Códigos relevantes: `already_exists`, `duplicated_document`, `blocked_transactions` (fecha ≤ bloqueo por fecha), `customer_settings` (tercero sin contactos), `document_settings`, `company_settings`, `header_required`, `invalid_array`, `documents_service` (reintentar luego).
- Paginación: `page`, `page_size`; respuesta `{ pagination:{page,page_size,total_results}, results:[] }`.
- Filtros de fecha en listados: `created_start/end`, `updated_start/end` y (invoices/journals/vouchers) `date_start/end`.

## Qué existe y qué NO existe
| Necesidad | Endpoint | Nota |
|---|---|---|
| Ventas | `GET/POST /v1/invoices`, `/{id}`, `/{id}/stamp`, `/annul`, `/pdf`, `/xml`, `/mail`, `/stamp/errors` | `stamp.send` y `mail.send` por defecto `false` |
| Notas crédito | `GET/POST /v1/credit-notes` | |
| Compras | `POST /v1/purchases`, `GET/PUT/DELETE /v1/purchases/{id}` | **Sin listado.** Líneas con `items.type` = `Product`, `FixedAsset` o `Account` (cuenta contable directa) |
| Documento soporte | `POST /v1/purchase-support-documents`, `GET/DELETE /{id}` | **Sin listado.** `stamp` opcional (por defecto no se envía a la DIAN) |
| Comprobantes contables | `GET/POST /v1/journals`, `/{id}` | Líneas con `account.code` + `movement` Debit/Credit, tercero, centro de costo, `due`, `tax` |
| Recibos de caja | `GET/POST /v1/vouchers`, `/{id}` | Tipos: `DebtPayment`, `AdvancePayment`, `MiscIncome` (el `Detailed` fue eliminado) |
| Recibos de pago/egreso | `GET/POST /v1/payment-receipts`, `/{id}` | Anticipo, abono a deuda o avanzado |
| Cartera por pagar | `GET /v1/accounts-payable` | JSON paginado. **No hay equivalente documentado de cuentas por cobrar** |
| Balance de prueba | `POST /v1/test-balance-report`, `/test-balance-report-by-thirdparty` | Devuelven `file_url` de un Excel (no JSON) |
| Catálogos | `/v1/taxes`, `/document-types?type=FV|FC|DS|RC|RP|CC|NC`, `/payment-types`, `/cost-centers`, `/account-groups`, `/users`, `/expenses`, `/misc-incomes`, `/fixed-assets`, `/warehouses`, `/price-lists` | |
| Terceros / productos | `/v1/customers`, `/v1/products` (CRUD) | |
| Webhooks | `POST/PUT/GET/DELETE /v1/webhooks` | Único tópico visto: `public.siigoapi.products.create` |
| **PUC (plan de cuentas)** | ❌ no existe | Se obtiene del balance de prueba / Excel |
| **Auxiliar contable** | ❌ no existe | Excel de Siigo cargado por el usuario, o reconstrucción desde journals+vouchers+payment-receipts |

## Consecuencias de diseño
1. Las líneas de facturas y compras **no traen cuenta contable**; solo journals, vouchers y payment-receipts. El aprendizaje de precedentes sale del **auxiliar/balance por tercero** (Excel) + esos tres documentos.
2. Para controlar la cuenta de cada gasto al crear una compra se usa `items.type = "Account"`.
3. Compras y DS no se pueden listar: la herramienta debe **guardar siempre el `id` devuelto por Siigo** y tratarlo como identidad remota inmutable.
4. `retentions` en compras acepta ids de ReteICA y ReteIVA; en ventas/DS también Autoretención. Cómo se registra la **retefuente en compras** **[PRUEBA REAL]**.
5. Cartera por cobrar: leerla del balance por tercero de la cuenta 1305 o de los `due` de journals/vouchers **[PRUEBA REAL]**.


## ✅ Verificado con una empresa real (diagnóstico de solo lectura, 26-nov-2026)
Corrige algunas conclusiones previas basadas solo en la documentación.
- **Los listados de compras (`GET /v1/purchases`) y de documentos soporte (`GET /v1/purchase-support-documents`) SÍ existen** aunque no estén documentados (6.954 y 439 resultados en la empresa de prueba). Siguen siendo "no documentados": pueden cambiar sin aviso.
- **Las líneas de compra/DS con `items[].type = "Account"` traen la cuenta contable en `items[].code`** (p. ej. `51959501`). Las de `type = "Product"` no: su cuenta depende del grupo contable del producto.
- **Impuestos y retenciones por línea:** `items[].taxes[]` trae `type` (`IVA`, `Retefuente`, ...), `percentage` y `value`. En DS y notas crédito se vio `Retefuente` 3,5 % y 2,5 % **como impuesto de línea**. `retentions[]` a nivel de documento existe (ReteICA/ReteIVA) pero vino vacío.
- **Facturas de venta, notas crédito, comprobantes, RC y RP** listan correctamente. Los comprobantes contables traen cuenta, tercero, `tax{base_value}` y valor por línea.
- **Recibos de pago/egreso reales usan `type: "DebtPayment"`:** `items:[{due:{prefix,consecutive,quote,date}, value}]` + `payment:{id,name,value,due_date}`. Es el formato que debe usar el módulo de egresos por defecto; `Detailed` queda para retenciones y ajustes.
- **Cartera por pagar:** `due{prefix,consecutive,quote,date,balance}` + `provider{id,identification,name}` (sin sucursal en el ejemplo; el centro de costo es opcional). El prefijo del vencimiento puede ser el de la factura del proveedor (p. ej. `Q5F6`), no el `FC-1` interno: se usa tal cual lo entrega Siigo.
- **`GET /v1/payment-types?document_type=RP` devuelve 404**; el parámetro solo se confirma para `FV`/`NC`/`FC` (el diagnóstico v2 prueba todos).
- **Catálogos:** 42 impuestos, tipos FV/FC/DS/RC/RP/CC activos e inactivos mezclados (hay que filtrar `active`), tipos de comprobante con `automatic_number`, `cost_center`, `reteiva`, `reteica` configurables por tipo.
- **Terceros:** `/v1/customers` devolvió 5.347 registros, con `contacts[]` (requisito `customer_settings`).
- **Pendiente de verificar (diagnóstico v2):** qué filtro de fecha respeta cada listado (`created_start`, `updated_start`, `date_start`): el total con fecha futura debe ser 0. En la corrida v1 con `created_start` de hace 30 días el total fue 6.954 compras, lo que sugiere que el filtro no se aplicó o que esa empresa cargó todo recientemente.

## ✅ Diagnóstico v2 (26-nov-2026): filtros, catálogos y medios de pago
- **Filtros de fecha reales:** `compras` y `documentos soporte` **ignoran** `created_start`, `updated_start` y `date_start` (el total no cambia con fecha futura): hay que recorrer todo el listado (≈70 páginas de 100 para 6.954 compras, ~1 minuto con el límite de 100/min). `comprobantes` respeta `created_start` y `updated_start` pero **no** `date_start`. `facturas de venta` respeta los tres.
- **El detalle por id no trae campos adicionales** frente al listado: no hace falta una petición por documento.
- **Medios de pago:** `GET /v1/payment-types?document_type=FC` (y `DS`) devuelve los medios tipo "Proveedor" (cuentas bancarias, caja, tarjetas, crédito). Son los que se usan en `payment.id` de los recibos de pago. `document_type=RP` → 404. Hay medios inactivos (`active:false`): filtrar.
- **Varios impuestos con el mismo porcentaje:** hay 4 IVA al 19 % (ids 8977 "IVA compras", 41566 "IVA Servicios", 41617 "IVA Gastos", 42965 "IVA importación") e incluso "IVA Servicios 5%" e "IVA Gastos 5%" figuran con `percentage: 19`. **La tarifa no identifica el impuesto**: el aprendizaje guarda el `impuesto_id` que cada proveedor ha usado.
- **Tipos de comprobante:** cada empresa tiene varios por clase, activos e inactivos; se elige por configuración (`active:true`). Esta empresa registra egresos también como comprobante contable "Comprobante Egreso" (CC código 9), "Ajuste de tesorería" (ADT) y "Traslado de dinero" (9901), útiles para la conciliación bancaria.
- **Retefuente en línea:** ids como 8979 "Honorarios 11%", 8982 "Servicios 4%", 8983 "Compras 2.5%", 8994 "Servicios 3.5%". ReteICA y ReteIVA existen como impuestos separados.
