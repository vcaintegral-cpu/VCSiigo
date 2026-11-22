On this pageListar Notas Crédito
Lista todas las notas crédito.
Query Parameters
ParamTypeDescription
created_startDateDevuelve resultados donde el campo "created" es mayor o igual que este valor.
created_endDateDevuelve resultados donde el campo "created" es menor o igual que este valor.
updated_startDateDevuelve resultados donde el campo "last_updated" es mayor o igual que este valor.
updated_endDateDevuelve resultados donde el campo "last_updated" es menor o igual que este valor.
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
GET/v1/credit-notes
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
namestring
For filtering by Credit Note name
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
curl -X GET "https://api.siigo.com/v1/credit-notes?name=NC-1-1516&created_start=2019-08-24T14%3A15%3A22Z&created_end=2019-08-24T14%3A15%3A22Z&date_start=2019-08-24T14%3A15%3A22Z&date_end=2019-08-24T14%3A15%3A22Z&updated_start=2019-08-24T14%3A15%3A22Z&updated_end=2019-08-24T14%3A15%3A22Z&page=1&page_size=25" \
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

