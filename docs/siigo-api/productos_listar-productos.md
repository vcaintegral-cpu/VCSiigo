Listar Productos
Devuelve una lista de los productos o servicios. Los productos se devuelven ordenados por fecha de creación, y los productos creados más recientemente aparecen primero.
Listado de productos en Siigo Nube en el menú lateral: Transacciones > Inventarios > Productos / Servicios.
Query Parameters
Puedes utilizar los siguientes parámetros para poder realizar filtros en las consultas.
ParamTypeDescription
codeDateDevuelve resultados por "code".
created_startDateDevuelve resultados de productos con fecha de creación mayor o igual que este valor.
created_endDateDevuelve resultados de productos con fecha de creación menor o igual que este valor.
updated_startDateDevuelve resultados de productos con actualización en sus propiedades o saldos de inventario en una fecha mayor o igual que este valor.
updated_endDateDevuelve resultados de productos con actualización en sus propiedades o saldos de inventario en una fecha menor o igual que este valor.
idDateDevuelve resultados por "id". Es posible hacer filtros hasta con 20 Ids a la vez separados por coma ejemplo: https://api.siigo.com/v1/products?ids={GUID},{GUID}
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
GET/v1/products
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
codestring
Representa el código de identificación del producto. Este valor puede ser un código alfanumérico que representará el código de identificación del centro de coste.
account_groupstring
Representa el id de la clasificación de inventario
typestring
Representa el tipo de producto. Este producto puede ser de tipo 'Product', 'Service' o 'Consumer Good',
por defecto este campo será Product.
stock_controlstring
Representa el control de inventario, por defecto este campo será false.
activestring
Representa el estado del producto, por defecto este campo será true.
idsstring
Representa el Id único del producto, este valor debe ser un Guid con el siguiente formato 00000000-0000-0000-0000-000000000000. Se pueden filtrar hasta 20 id a la vez:https://api.siigo.com/v1/products?ids={GUID},{GUID}
created_startstring
Formato - date-time (como date-time en RFC3339). Devuelve resultados donde el campo "created" es mayor o igual que la fecha ingresada
Format: "date-time"
created_endstring
Formato - date-time (como date-time en RFC3339). Devuelve resultados donde el campo "created" es menor o igual que la fecha ingresada
Format: "date-time"
date_startstring
Formato - date-time (como date-time en RFC3339). Devuelve resultados con fecha mayor o igual que la fecha "date_start"
Format: "date-time"
date_endstring
Formato - date-time (como date-time en RFC3339). Devuelve resultados con fecha menor o igual que la fecha "date_end"
Format: "date-time"
updated_startstring
Formato - date-time (como date-time en RFC3339). Devuelve resultados donde el campo "last_updated" es mayor o igual que la fecha ingresada
Format: "date-time"
updated_endstring
Formato - date-time (como date-time en RFC3339). Devuelve resultados donde el campo "last_updated" es menor o igual que la fecha ingresada
Format: "date-time"
pageinteger
Formato - int32. Representa la página actual
Format: "int32"
page_sizeinteger
Formato - int32. Representa el número de resultados por página.
Format: "int32"
curl -X GET "https://api.siigo.com/v1/products?code=Item-1&account_group=1253&type=Product&stock_control=false&active=true&ids=63f918c2-ca65-4edc-a7db-66bcdd5159fb&created_start=2019-08-24T14%3A15%3A22Z&created_end=2019-08-24T14%3A15%3A22Z&date_start=2019-08-24T14%3A15%3A22Z&date_end=2019-08-24T14%3A15%3A22Z&updated_start=2019-08-24T14%3A15%3A22Z&updated_end=2019-08-24T14%3A15%3A22Z&page=1&page_si
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
      "id": "string",
      "code": "string",
      "name": "string",
      "account_group": {
        "id": 0,
        "name": "string"
      },
      "type": "string",
      "stock_control": true,
      "active": true,
      "tax_classification": "string",
      "tax_included": true,
      "tax_consumption_value": 0,
      "taxes": [
        {
          "id": 0,
          "name": "string",
          "type": "string",
          "percentage": 0
        }
      ],
      "prices": [
        {
          "currency_code": "string",
          "price_list": [
            {
              "position": 0,
              "name": "string",
              "value": 0
            }
          ]
        }
      ],
      "unit": {
        "code": "string",
        "name": "string"
      },
      "unit_label": "string",
      "reference": "string",
      "description": "string",
      "additional_fields": {
        "barcode": "string",
        "brand": "string",
        "tariff": "string",
        "model": "string"
      },
      "available_quantity": 0,
      "warehouses": [
        {
          "id": 0,
          "name": "string",
          "quantity": 0
        }
      ],
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

