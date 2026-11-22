Tipos de Comprobante
Lista todos los comprobantes o documentos contables registrados.
Parámetros
ParamTypeDescription
typeStringDevuelve los tipos de comprobantes de acuerdo a los tipos de documentos contables como FV, FC, NC, RC.
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

