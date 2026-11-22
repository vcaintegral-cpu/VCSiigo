Lista el comprobante contable.
Lista el comprobante contable.
GET/v1/journals/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represent the Journal id by GUID.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/journals/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 27441
  },
  "number": 20,
  "name": "CC-10-20",
  "date": "2021-10-10",
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "items": [
    {
      "account": {
        "code": "11050501",
        "movement": "Credit"
      },
      "customer": {
        "id": "302580df-838b-4531-b8bf-dd3c98b34059",
        "identification": "13832081",
        "branch_office": 0
      },
      "cost_center": 235,
      "due": {
        "prefix": "FV-1",
        "consecutive": 68,
        "quote": 1,
        "date": "2021-04-22"
      },
      "tax": {
        "id": 13156,
        "name": "VAT 19%",
        "type": "IVA",
        "percentage": 19,
        "value": 5,
        "base_value": 2000
      },
      "fixed_asset": {
        "id": 13156,
        "name": "Personal Computer"
      },
      "product": {
        "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
        "code": "Item-1",
        "name": "Cotton shirt",
        "warehouse": {
          "id": 15,
          "name": "Main Warehouse"
        },
        "quantity": 2
      },
      "description": "This is a description",
      "value": 119000
    }
  ],
  "observations": "This is an observation",
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript

