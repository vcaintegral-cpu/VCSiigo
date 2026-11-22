On this pageConsultar Tipos de Facturas de venta
Lista todos los tipos de Factura de venta que se encuentran configurados en Siigo Nube y sus características.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único del tipo de factura de venta, este dato se debe enviar en las creaciones.
codestringCódigo asignado en Siigo Nube al tipo de factura de venta.
namestringNombre del tipo de factura de venta.
descriptionstringDescripción del tipo de factura de venta.
typestringIndica el tipo de documento, en este caso "FV" para facturas de venta.
activebooleanEstado del tipo de documento.
seller_by_itembooleanIndica si se maneja vendedor por ítem o no en este tipo de factura de venta.
cost_centerbooleanIndica si se pueden manejar centros de costo o no en este tipo de factura de venta.
cost_center_mandatorybooleanIndica si se maneja centro de costo de forma obligatoria en este tipo de factura de venta.
automatic_numberbooleanIndica si se maneja numeración automática o no. Si es false, en la creación de facturas usando este tipo se debe enviar el campo number.
consecutivenumberNúmero del próximo consecutivo de factura.
discount_typestringIndica el tipo de descuento que se maneja: "Percentage" o "Value", lo cual afecta cómo se envía el descuento en los ítems.
decimalsbooleanIndica si se manejan decimales en este tipo de factura de venta.
advance_paymentbooleanIndica si la factura maneja el campo de anticipos.
reteivabooleanIndica si se pueden usar retenciones de tipo ReteIVA.
reteicabooleanIndica si se pueden usar retenciones de tipo ReteICA.
self_withholdingbooleanIndica si maneja autoretención este tipo de factura de venta.
self_withholding_limitnumberIndica valor mínimo de autoretención.
electronic_typestringIndica si el tipo de factura es de tipo electrónico.
cargo_transportationbooleanIndica si la factura maneja los campos de transporte de carga.
customer_by_itembooleanIndica si la factura maneja ingresos para terceros en los ítems de la factura.
GET/v1/document-types
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
typestring
Represents the document type. For example, 'FV' to invoices, 'NC' to credit notes, or 'RC' to vouchers.
curl -X GET "https://api.siigo.com/v1/document-types?type=FV" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 5636,
    "code": "1",
    "name": "Factura",
    "description": "This is a description",
    "type": "FV",
    "active": true,
    "seller_by_item": false,
    "cost_center": false,
    "cost_center_mandatory": false,
    "cost_center_default": 1235,
    "automatic_number": true,
    "consecutive": 3,
    "discount_type": "Value",
    "decimals": true,
    "advance_payment": false,
    "reteiva": false,
    "reteica": false,
    "self_withholding": false,
    "self_withholding_limit": 0,
    "electronic_type": "NoElectronic",
    "official_book": "0",
    "document_support": false,
    "prefix": "FV-1",
    "global_discounts": [
      {
        "id": 0,
        "name": "string",
        "percentage": 0,
        "active": true
      }
    ],
    "global_charges": [
      {
        "id": 0,
        "name": "string",
        "percentage": 0,
        "active": true
      }
    ]
  }
]
TypeScript

