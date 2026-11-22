Crear Factura de compra
Crear una nueva factura de compra o gasto.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo previamnete, se puede consultar por: Consultar tipos de factura de compra
datedateFecha de comprobante.Campo obligatorio, debe ser en formato YYYY-MM-DD.
numbernumberConsecutivo/número del comprobanteEl campo opcional, si se envia debe ser un consecutivo que no exista en Nube.
supplier.identificationstringNúmero de identificación del proveedor.Campo obligatorio, el tercero debe existir en Siigo Nube, debe estar activo.
supplier.branch_officenumberNúmero de Sucursal del proveedor.Campo opcional, si no se envia toma por defecto el 0.
discount_typestringIndica el tipo de descuento que se maneja en este tipo de factura "Percentage" o "Value".Campo opcional, solo permite los valores "Percentage" o "Value".
supplier_by_itemBooleanIndica si la factura maneja proveedor por item.Campo opcional, Si envia "true" podra enviar el campo items.supplier si no se envia o se envia en false no admitira el campo en la petición.
tax_includedBooleanIndica si la factura maneja precios con impuesto incluido.Campo opcional, Si envia "true" el sistema realizara el calculo del valor + Impuesto, si no se envia o se envia en false el impuesto se calculara sobre price.
observationsstringComentarios u observaciones de la factura.Campo opcional, tiene un limite de 4.000 carácteres.
retentionsarrayArray con los id de los impuestos tipo ReteICA, ReteIVA.Campo opcional, se puede consultar por la ruta: /taxes
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
currency.codestringCódigo de moneda.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envia toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envia toma por defecto la moneda local, debe existir en Siigo Nube.
items.typestringTipo de ítem: Product, FixedAsset o Account.Campo obligatorio, solo admite los valores Product, FixedAsset, Account.
items.codestringCódigo único del producto.Campo obligatorio, debe existir en Siigo Nube y estar activo, alfanumérico.
items.descriptionstringNombre o descripción del producto/servicio.Campo opcional, toma el nombre o la descripción configurada del producto según corresponda.
items.quantitynumberCantidad.Campo obligatorio, numérico de máximo 2 decimales.
items.pricenumberPrecio del producto / Valor unitario.Campo obligatorio, numérico de máximo 6 decimales.
items.discountnumberValor de descuento del producto.Campo opcional, puede ser por valor o porcentaje dependiendo del campo discount_type.
items.suppliernumberIdentificador del proveedor asociado a cada ítem de la factura.Este campo se mostrará cuando la factura tenga la marca de la opción de proveedor por ítem.
items.warehousenumberIdentificador de la bodega/almacén asociada al producto.Campo opcional, si se envía debe existir en Siigo Nube y estar activo.
items.taxes.idnumberIdentificador único del impuesto.Campo opcional, es numérico sin decimales.
payments.idnumberID del medio de pago.Campo obligatorio, debe existir en Siigo Nube y estar activo, se puede consultar por la ruta: /payment-types  con el filtro de FC.
payments.valuenumberValor asociado al medio de pago.Campo obligatorio, numérico, máximo 2 decimales.
payments.due_datestringFecha de vencimiento del pago.Si el payments.id maneja vencimiento, es obligatorio enviar este campo con la fecha en formato yyyy-MM-dd.
¿Como crear facturas de compra en Siigo Nube?
POST/v1/purchases
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
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
curl -X POST "https://api.siigo.com/v1/purchases" \
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
201
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

