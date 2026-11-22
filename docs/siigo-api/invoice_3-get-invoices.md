On this pageListar Facturas.
Lista todas las facturas de venta.Podrás realizar filtros al listado de facturas que deseas obtener usando los siguientes parámetros:
Query Parameters
ParamTypeDescription
created_startDateDevuelve resultados donde la fecha de creación es mayor o igual que este valor.
created_endDateDevuelve resultados donde la fecha de creación es menor o igual que este valor.
updated_startDateDevuelve resultados donde la fecha de última modificación es mayor o igual que este valor.
updated_endDateDevuelve resultados donde la fecha de última modificación es menor o igual que este valor.
nameDatePermite consultar facturas por nombre. Ejemplo: FV-003-457.
customer_identificationDatePermite consultar facturas por cliente.
customer_branch_officeDatePermite consultar facturas por sucursal.
document_idDatePermite consultar facturas por ID.
date_startDateDevuelve resultados de las facturas con fecha de elaboración asignada mayor o igual que este valor.
date_endDateDevuelve resultados de las facturas con fecha de elaboración asignada menor o igual que este valor.
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
GET/v1/invoices
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
document_idinteger
Format - int64. Represents the document id of invoice.
For example, a document id can be like '24' or '10'.
Format: "int64"
customer_identificationstring
Represents the customer id associated to invoice.
For example, the number '51874544' can be the id of the customer 'Jackson Smith'.
customer_branch_officeinteger
Format - int32. Represents the branch office id associated to customer.
For example, the branch office '627'.
Format: "int32"
namestring
Represents the name of invoice.
For example, the name of an invoice can be like 'FV-003-457'.
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
curl -X GET "https://api.siigo.com/v1/invoices?document_id=24&customer_identification=51874544&customer_branch_office=627&name=FV-003-457&created_start=2019-08-24T14%3A15%3A22Z&created_end=2019-08-24T14%3A15%3A22Z&date_start=2019-08-24T14%3A15%3A22Z&date_end=2019-08-24T14%3A15%3A22Z&updated_start=2019-08-24T14%3A15%3A22Z&updated_end=2019-08-24T14%3A15%3A22Z&page=1&page_size=25" \
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
      "prefix": "FV",
      "number": 25,
      "name": "FV-2-22",
      "date": "2021-10-10",
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
      "balance": 30302.24,
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
      "global_charges": [
        {
          "id": 0,
          "name": "string",
          "percentage": 0,
          "value": 0
        }
      ],
      "global_discounts": [
        {
          "id": 0,
          "name": "string",
          "percentage": 0,
          "value": 0
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
      "additional_fields": {
        "purchase_order": {
          "prefix": "OC",
          "number": "27"
        },
        "delivery_order": {
          "prefix": "OE",
          "number": "27",
          "date": "2021-05-19"
        }
      },
      "stamp": {
        "status": "string",
        "cufe": "string",
        "cude": "string",
        "observations": "string",
        "errors": "string"
      },
      "mail": {
        "status": "string",
        "observations": "string"
      },
      "metadata": {
        "created": "string",
        "last_updated": "string",
        "stock_updated": "string"
      },
      "annulled": true
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

