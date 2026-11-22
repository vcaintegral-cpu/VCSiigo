On this pageConsultar Nota Crédito
Consultar una nota crédito por su id.
Consultas cuando tienen campos de ingresos para terceros(items.customer)
Si la nota crédito tiene diligenciados los campos de ingresos para terceros, mostrara los siguientes campos:
NombreTipoDescripción
items.customer.identificationstringNúmero de identificación del cliente.
items.customer.branch_officestringSucursal, valor por default 0.
GET/v1/credit-notes/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of credit note, this value must be a 'Guid'
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/credit-notes/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 22
  },
  "number": 25,
  "name": "NC-2-22",
  "date": "2021-10-15",
  "invoice": {
    "id": "302580df-838b-4531-b8bf-dd3c98b34059",
    "name": "FV-2-20"
  },
  "customer": {
    "id": "302580df-838b-4531-b8bf-dd3c98b34059",
    "identification": "13832081",
    "branch_office": 0
  },
  "cost_center": 235,
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "seller": 629,
  "retentions": [
    {
      "id": 13156,
      "name": "VAT 19%",
      "type": "Retefuente",
      "percentage": 19,
      "value": 5
    }
  ],
  "advance_payment": 33.3,
  "total": 25.5,
  "observations": "This is an observation",
  "items": [
    {
      "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
      "code": "Item-1",
      "quantity": 2,
      "price": 50,
      "seller": 629,
      "description": "This is a description",
      "discount": {
        "percentage": 13,
        "value": 130
      },
      "taxes": [
        {
          "id": 13156,
          "name": "VAT 19%",
          "type": "IVA",
          "percentage": 19,
          "value": 5,
          "base_value": 2000
        }
      ],
      "warehouse": {
        "id": 15,
        "name": "Main Warehouse"
      },
      "total": 119000
    }
  ],
  "payments": [
    {
      "id": 5636,
      "name": "Credit",
      "value": 1273.03,
      "due_date": "2021-03-19"
    }
  ],
  "stamp": {
    "status": "string",
    "cufe": "string",
    "cude": "string",
    "observations": "string",
    "errors": "string"
  },
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript

