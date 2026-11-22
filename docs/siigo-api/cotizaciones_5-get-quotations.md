Listar Cotizaciones
Lista todas las cotizaciones.
Query Parameters
ParamTipoDescripción
created_startDateDevuelve resultados donde la fecha de creación es mayor o igual que este valor.
created_endDateDevuelve resultados donde la fecha de creación es menor o igual que este valor.
nameDatePermite consultar Cotización por nombre, ejemplo: C-003-457.
customer_identificationDatePermite consultar Cotizaciones por cliente.
customer_branch_officeDatePermite consultar Cotizaciones por sucursal.
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
GET/v1/quotations
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
created_startstring
Fecha inicial para filtrar cotizaciones por fecha de creación (yyyy-MM-dd).
pageinteger
Número de página para paginación.
page_sizeinteger
Número de elementos por página.
curl -X GET "https://api.siigo.com/v1/quotations?created_start=2025-02-17&page=1&page_size=25" \
  -H "Authorization: <token>"
200
Listado de cotizaciones obtenido correctamente
Response
{
  "pagination": {
    "page": 1,
    "page_size": 25,
    "total_results": 253
  },
  "results": [
    {
      "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
      "document": {
        "id": 24446
      },
      "number": 22,
      "name": "C-1-22",
      "date": "2023-12-15",
      "customer": {
        "id": "6b6ceb28-b2eb-4b98-b3dd-26648a933c81",
        "identification": "13832081",
        "branch_office": 0
      },
      "cost_center": 235,
      "currency": {
        "code": "USD",
        "exchange_rate": 3825.03
      },
      "total": 2546.05,
      "seller": 629,
      "items": [
        {
          "id": "63f918c2-ca65-4edc-a7db-66bcdd5159ps",
          "code": "Item-1",
          "description": "Camiseta de algodón",
          "quantity": 2,
          "price": 1069.77,
          "discount": {
            "percentage": 13,
            "value": 130
          },
          "taxes": [
            {
              "id": 13156,
              "name": "IVA 19%",
              "type": "IVA",
              "percentage": 19,
              "value": 406.51
            }
          ],
          "total": 2546.05
        }
      ],
      "public_url": "https://publicview.siigo.com/document?data=MS4ruap0JuOL8dao3oKEMa",
      "metadata": {
        "created": "2020-06-15T03:33:17.208Z",
        "last_updated": "null"
      }
    }
  ],
  "_links": {
    "previous": {
      "href": "https://api.siigo.com/v1/quotations?page=4&page_size=25"
    },
    "self": {
      "href": "https://api.siigo.com/v1/quotations?page=5&page_size=25"
    },
    "next": {
      "href": "https://api.siigo.com/v1/quotations?page=6&page_size=25"
    }
  }
}
TypeScript

