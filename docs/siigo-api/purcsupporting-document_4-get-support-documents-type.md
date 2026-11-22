On this pageConsultar Tipos de documentos soporte
Consultar documentos soporte
Lista todos los tipos de documento soporte que se encuentran configurados en Siigo Nube y sus características.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único del tipo de documento soporte, este dato se debe enviar en las creaciones del documento.
codestringCódigo asignado en Siigo Nube al tipo de documento soporte.
namestringNombre del tipo de documento soporte.
descriptionstringDescripción del tipo de documento soporte.
typestringIndica el tipo de documento en este caso "DS" para documentos soporte.
activebooleanIndica el estado del tipo de documento, si se encuentra activo o inactivo.
cost_centerbooleanIndica si se pueden manejar centros de costo o no en este tipo de documento soporte.
cost_center_mandatorybooleanIndica si se maneja centro de costo de forma obligatoria en este tipo de documento soporte.
cost_center_defaultnumberIndica el número de ID del documento soporte.
automatic_numberbooleanIndica si se maneja numeración automática o no en este tipo de documento soporte, si es false, en la creación de facturas usando este tipo, se debe enviar el campo "number".
consecutivenumberNúmero del próximo consecutivo del documento soporte.
decimalsbooleanIndica si se manejan decimales en este tipo de documento soporte.
reteivabooleanIndica si se pueden usar retenciones de tipo ReteIVA en este tipo de documento soporte.
reteicabooleanIndica si se pueden usar retenciones de tipo ReteICA en este tipo de documento soporte.
GET/v1/document-types?type=DS
Query
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/document-types?type=DS" \
  -H "Authorization: <token>"
200
Tipos de documento soporte obtenidos
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
        "percentage": 0.1,
        "active": true
      }
    ],
    "global_charges": [
      {
        "id": 0,
        "name": "string",
        "percentage": 0.1,
        "active": true
      }
    ]
  }
]
TypeScript

