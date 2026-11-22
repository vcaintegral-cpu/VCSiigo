Edición de Facturas de compra
Dentro de el manejo de este endpoint es importante tener en cuenta que hay varios campos que no será posible poder modificarlos como por ejemplo el document.id, supplier.identification, currency.code y number.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, no se puede modificar y debe existir en Siigo previamente. Se puede consultar por: /document-types
numbernumberConsecutivo/número del comprobante.Campo opcional u obligatorio dependiendo la configuración de Siigo Nube. Si se envía debe ser el mismo consecutivo de la factura.
supplier.identificationstringNúmero de identificación del proveedor.Campo obligatorio, el tercero debe existir en Siigo Nube y estar activo.
supplier.branch_officenumberNúmero de Sucursal del proveedor.Campo opcional, si no se envía toma por defecto el 0.
supplier_by_itembooleanIndica si la factura maneja proveedor por ítem.Campo opcional. Si se envía "true" se podrá enviar el campo items.supplier. Si no se envía o es false, no se admite el campo en la petición.
discount_typestringTipo de descuento: "Percentage" o "Value".Campo opcional. Solo permite los valores "Percentage" o "Value".
tax_includedbooleanIndica si la factura maneja precios con impuesto incluido.Campo opcional. Si se envía "true", el sistema calculará el valor + impuesto. Si no se envía o se envía "false", el impuesto se calcula en base al price.
observationsstringComentarios u observaciones de la factura.Campo opcional, límite de 4000 caracteres.
retentionsarrayIDs de los impuestos tipo ReteICA, ReteIVA o Autoretención.Campo opcional. Se puede consultar por la ruta: /taxes.
cost_centernumberIdentificador del Centro de Costos.Campo opcional. Debe existir en Siigo Nube y estar activo.
provider_invoice.prefixstringPrefijo de la factura de compra del proveedor.Campo obligatorio. Alfanumérico de máximo 6 caracteres.
provider_invoice.numberstringConsecutivo de la factura de compra del proveedor.Campo obligatorio. Solo admite números y debe tener máximo 11 dígitos.
currency.codestringCódigo de moneda.Campo opcional. No se puede modificar. Debe tener marcada la opción de moneda extranjera. Si no se envía, toma por defecto la moneda local.
currency.exchange_ratenumberTasa o valor en moneda extranjera.Campo opcional. Aplica solo si la empresa maneja moneda extranjera.
items.typestringTipo de ítem: "Product", "FixedAsset" o "Account".Campo obligatorio. Solo admite los valores mencionados.
items.codestringCódigo único del producto.Campo obligatorio. Debe existir en Siigo Nube y estar activo. Alfanumérico.
items.descriptionstringNombre o descripción del producto/servicio.Campo opcional. Si no se maneja descripción larga, se toma el nombre del producto. Si sí se maneja y no se envía, se toma desde la configuración.
items.quantitynumberCantidad del producto.Campo obligatorio. Numérico con máximo 2 decimales.
items.pricenumberPrecio unitario del producto.Campo obligatorio. Numérico con máximo 6 decimales.
items.discountnumberValor de descuento del producto.Campo opcional. Puede ser por valor o porcentaje dependiendo del campo discount_type.
items.suppliernumberID del proveedor asociado a cada ítem.Campo visible solo si supplier_by_item es true.
items.warehousenumberID de la bodega/almacén asociada al producto.Campo opcional. Debe existir en Siigo Nube y estar activa.
payments.idnumberID del medio de pago.Campo obligatorio. Debe existir en Siigo Nube y estar activo. Se consulta con /payment-types usando el filtro FC.
payments.valuenumberValor asociado al medio de pago.Campo obligatorio. Numérico con máximo 2 decimales.
payments.due_datestringFecha de vencimiento del pago.Obligatorio si payments.id maneja vencimiento. Formato yyyy-MM-dd.
¿Como editar facturas de compra en Siigo Nube?
PUT/v1/purchases/{id}
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Represents the request with the purchase information.
documentRequired
object
Show Attributes
datestring
supplierRequired
object
Show Attributes
provider_invoiceRequired
object
Show Attributes
itemsarray<object>
Show Attributes
paymentsarray<object>
Show Attributes
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of invoice, this value must be a Guidwith the next format 00000000-0000-0000-0000-000000000000.
curl -X PUT "https://api.siigo.com/v1/purchases/string" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 58246
    },
    "date": "2024-05-22",
    "supplier": {
      "identification": "101020201",
      "branch_office": 0
    },
    "provider_invoice": {
      "prefix": "VEN",
      "number": "987"
    },
    "items": [
      {
        "type": "Product",
        "code": "SGNB002",
        "description": "Prod SiigoNube_Mod 002",
        "quantity": 8,
        "price": 1000
      }
    ],
    "payments": [
      {
        "id": 51279,
        "value": 8000,
        "name": "MercadoPago"
      }
    ]
  }'
200
Success
Response
{
  "id": "dd3ee2cf-c313-4f13-ac9c-b5aa8db5f41c",
  "document": {
    "id": 58246
  },
  "number": 73,
  "name": "FC-1-73",
  "date": "2024-05-22",
  "supplier": {
    "id": "17eca20f-9c14-4e75-8a72-8ac8bdca6d2c",
    "identification": "1065600600",
    "branch_office": 10
  },
  "total": 3000,
  "balance": 0,
  "provider_invoice": {
    "prefix": "VEN",
    "number": "987"
  },
  "items": [
    {
      "id": "ab491976-9bd8-49fc-b8a0-caacd700efc6",
      "type": "item",
      "code": "SGNB002",
      "quantity": 3,
      "price": 1000,
      "description": "Prod SiigoNube_Mod 002",
      "total": 3000
    }
  ],
  "payments": [
    {
      "id": 51279,
      "name": "MercadoPago",
      "value": 3000
    }
  ],
  "metadata": {
    "created": "2024-05-23T12:57:42.0000000+00:00"
  }
}
TypeScript

