Listar Recibos de Caja
Lista todos los Recibos de Caja.
Lista todos los recibos de caja. La respuesta retorna un objeto 'VouchersOutList' con paginación y links de navegación.
Query Parameters
NombreTipoDescripción
created_startDateDevuelve resultados donde el campo "created" es mayor o igual que este valor.
created_endDateDevuelve resultados donde el campo "created" es menor o igual que este valor.
updated_startDateDevuelve resultados donde el campo "last_updated" es mayor o igual que este valor.
updated_endDateDevuelve resultados donde el campo "last_updated" es menor o igual que este valor.
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
Request (application/json)
Authorization: [access_token]
Partner-Id: [nombre de la aplicación que estás integrando]
Response 200 (application/json)
Attributes ('VouchersOutList')
Body
GET/v1/vouchers
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
namestring
Represents the name of voucher.
For example, the name of a voucher can be like 'RC-01-45'.
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
curl -X GET "https://api.siigo.com/v1/vouchers?name=RC-01-45&created_start=2019-08-24T14%3A15%3A22Z&created_end=2019-08-24T14%3A15%3A22Z&date_start=2019-08-24T14%3A15%3A22Z&date_end=2019-08-24T14%3A15%3A22Z&updated_start=2019-08-24T14%3A15%3A22Z&updated_end=2019-08-24T14%3A15%3A22Z&page=1&page_size=25" \
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
      "name": "RC-2-22",
      "date": "2021-10-31",
      "type": "DebtPayment",
      "cost_center": 235,
      "customer": {
        "id": "302580df-838b-4531-b8bf-dd3c98b34059",
        "identification": "13832081",
        "branch_office": 0
      },
      "currency": {
        "code": "USD",
        "exchange_rate": 3825.03
      },
      "items": [
        {
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
          "description": "This is a description",
          "value": 119000
        }
      ],
      "payment": {
        "id": 5636,
        "name": "Credit",
        "value": 1273.03,
        "due_date": "2021-03-19"
      },
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

