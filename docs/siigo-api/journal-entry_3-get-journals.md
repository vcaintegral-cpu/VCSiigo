Listar Comprobantes Contables
Lista todos los comprobantes contables.
Query Parameters
NombreTipoDescripción
document_idnumberPermite consultar comprobantes contables por ID.
GET/v1/journals
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
namestring
For filtering by Journals Entry name
created_startstring
Format - date-time (as date-time in RFC3339). Returns results where the "created" field is greater or equal than the entered date
Format: "date-time"
created_endstring
Format - date-time (as date-time in RFC3339). Returns results where the "created" field is less or equal than the entered date
Format: "date-time"
date_startstring
Format - date-time (as date-time in RFC3339). Returns results with date greater or equal than the "date_start" date
Format: "date-time"
date_endstring
Format - date-time (as date-time in RFC3339). Returns results with date less or equal than the "date_end" date
Format: "date-time"
updated_startstring
Format - date-time (as date-time in RFC3339). Returns results where the "last_updated" field is greater or equal than the entered date
Format: "date-time"
updated_endstring
Format - date-time (as date-time in RFC3339). Returns results where the "last_updated" field is less or equal than the entered date
Format: "date-time"
pageinteger
Format - int32. Represents the current page
Format: "int32"
page_sizeinteger
Format - int32. Represents the number of results per page.
Format: "int32"
curl -X GET "https://api.siigo.com/v1/journals?name=CC-1-85&created_start=2019-08-24T14%3A15%3A22Z&created_end=2019-08-24T14%3A15%3A22Z&date_start=2019-08-24T14%3A15%3A22Z&date_end=2019-08-24T14%3A15%3A22Z&updated_start=2019-08-24T14%3A15%3A22Z&updated_end=2019-08-24T14%3A15%3A22Z&page=1&page_size=25" \
  -H "Authorization: <token>"
200
Success
Response
{
  "pagination": {
    "page": 1,
    "page_size": 25,
    "total_results": 250
  },
  "results": [
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
  ],
  "__links": {
    "previous": {
      "href": "string"
    },
    "self": {
      "href": "string"
    },
    "next": {
      "href": "string"
    }
  }
}
TypeScript

