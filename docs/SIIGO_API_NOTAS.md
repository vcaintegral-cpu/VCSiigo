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
