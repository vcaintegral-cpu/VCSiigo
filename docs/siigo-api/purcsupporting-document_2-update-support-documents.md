On this pageEdición de documentos soporte
Edición de documentos soporte
Dentro de el manejo de este endpoint es importante tener en cuenta que hay varios campos que no será posible poder modificarlos como por ejemplo el document.id, supplier.identification, currency.code y number.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo previamnete, se puede consultar por: /document-types
datedateFecha de comprobante.Campo obligatorio, debe ser en formato YYYY-MM-DD.
numbernumberConsecutivo/número del comprobanteEl campo opcional u obligatorio dependiendiendo la configuración de Siigo Nube, si se envia debe ser el mismo consecutivo del documento soporte.
supplier.identificationstringNúmero de identificación del proveedor.Campo obligatorio, no se puede modificar, debe estar activo.
supplier.branch_officenumberNúmero de Sucursal del proveedor.Campo opcional, si no se envia toma por defecto el 0.
Supplier_receipt_number.prefixstringPrefijo del documento soporte del proveedor.Campo obligatorio, alfanúmerico de máximo 6 caracteres.
Supplier_receipt_number.numberstringConsecutivo del documento soporte del proveedor.Campo obligatorio, solo admite números y debe ser de 11 enteros.
discount_typestringIndica el tipo de descuento que se maneja en este tipo de factura "Percentage" o "Value" de esto depende la forma en la que envias un descuento en un ítem al crear facturas.Campo opcional.
stampobjectObjeto con el dato para envío del documento soporte a la DIAN .Campo opcional,se debe enviar en "true" para enviarlo a la DIAN, si no se envia toma por defecto "false".
observationsstringComentarios u observaciones del documento soporte.Campo opcional, tiene un limite de 4.000 carácteres.
retentionsarrayArray con los id de los impuestos tipo ReteICA, ReteIVA o Autoretención.Campo opcional, se puede consultar por la ruta: /taxes
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
currency.codestringCódigo de moneda.Campo opcional, no se puede modificar, debe tener la marcación de manejo de moneda extranjera, si no se envia toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envia toma por defecto la moneda local, debe existir en Siigo Nube.
items.typestringEste campo indica el tipo de item. Si es Product (producto), FixedAsset (activo) o Account (cuenta contable)Campo obligatorio, solo admite los 3 valores ya mencionados de Product (producto) FixedAsset (activo) Account (cuenta).
items.codestringCódigo único del producto.Campo obligatorio, debe existir en Siigo Nube y estar activo, alfanúmerico.
items.descriptionstringNombre o descripción del producto/servicio.Campo opcional, si no maneja descripción larga en la configuración y se envia toma el nombre del producto. Si maneja descripción larga en la configuración del producto y no se envia debe tomar la descipción de la configuración del producto. Si se envia y viene vacio lo tomara así en el documento.
items.quantitynumberCantidad. En Siigo Nube queda registado con dos decimales.Campo obligatorio, númerico de máximo 2 decimales.
items.pricenumberPrecio del producto / Valor unitario.Campo obligatorio, númerico de máximo 6 decimales.
items.discountnumberValor de descuento del producto.Campo opcional, puede ser por valor o porcentaje dependiendo de la configuración enviada en este Json en el campo discount_type.
items.warehousenumberIdentificador de la bodega/almacén asociada al producto.Campo opcional, si se envia debe existir en Siigo nube y estar activo.
items.taxes.idnumberIdentificador único del impuesto.Campo opcional, es númerico sin decimales.
payments.idnumberID del medio de pago.Campo obligatorio, debe existir en Siigo Nube y estar activa, se puede consultar por la ruta: /payment-types
payments.valuenumberValor asociado al medio de pago.Campo obligatorio, númerico, máximo 2 decimales.
payments.due_datestringFecha de pago del vencimeinto.Si el payments.id maneja vencimiento, es obligatorio enviar este campo con la fecha del vencimiento en formato yyyy-MM-dd.
PUT/v1/purchase-support-documents/{id}
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
documentobject
Tipo de comprobante del documento soporte
Show Attributes
datestring
Fecha del documento, formato yyyy-MM-dd
supplierobject
Identificador del proveedor que emite el documento soporte
Show Attributes
cost_centernumber
Centro de costo
supplier_receipt_numberobject
Show Attributes
currencyobject
Show Attributes
observationsstring
Comentarios del documento soporte
discount_typestring
Descuento por valor o porcentaje
stampobject
Show Attributes
itemsarray<object>
Show Attributes
paymentsarray<object>
Show Attributes
Path Parameters
idRequired
string
Identificador del documento soporte
curl -X PUT "https://api.siigo.com/v1/purchase-support-documents/63f918c2-ca65-4edc-a7db-66bcdd5159fb" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 2446
    },
    "date": "2026-02-15",
    "supplier": {
      "identification": "13832081",
      "branch_office": 0
    },
    "cost_center": 235,
    "supplier_receipt_number": {
      "prefix": "DS",
      "number": "1234"
    },
    "currency": {
      "code": "USD",
      "exchange_rate": 3825.03
    },
    "observations": "Observaciones",
    "discount_type": "Value",
    "stamp": {
      "send": true
    },
    "items": [
      {
        "type": "Product",
        "code": "Item-1",
        "description": "Camiseta de algodón",
        "quantity": 1,
        "price": 1069.77,
        "discount": 0,
        "taxes": [
          {
            "id": 13156
          }
        ]
      }
    ],
    "payments": [
      {
        "id": 5636,
        "value": 1273.03,
        "due_date": "2021-03-19"
      }
    ]
  }'
200
Documento soporte actualizado
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 24446
  },
  "number": 25732,
  "name": "DS-25732",
  "date": "2015-12-15",
  "supplier": {
    "identification": "13832081",
    "branch_office": 0
  },
  "cost_center": 235,
  "discount_type": "Value",
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "total": 2546.05,
  "balance": 0,
  "observations": "Observaciones",
  "items": [
    {}
  ],
  "payments": [
    {}
  ],
  "metadata": {
    "created": "2020-06-15T03:33:17.208Z",
    "last_updated": null
  }
}
TypeScript

