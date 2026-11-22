Listar Clientes
Listar Clientes
Lista todos los clientes o terceros.Listado de clientes en Siigo Nube en el menú lateral: Reportes > Cartera / proveedores > Búsqueda de tercerosO en el menú lateral: Transacciones > Cuánto me deben > Clientes
Query Parameters
ParamTypeDescription
identificationStringDevuelve resultados por "identification".
branch_officeNumberDevuelve resultados por "branch_office".
created_startDateDevuelve resultados donde el campo "created" es mayor o igual que este valor.
created_endDateDevuelve resultados donde el campo "created" es menor o igual que este valor.
updated_startDateDevuelve resultados donde el campo "last_updated" es mayor o igual que este valor.
updated_endDateDevuelve resultados donde el campo "last_updated" es menor o igual que este valor.
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
GET/v1/customers
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
identificationstring
Represents the identification number of customer.
For example, the identifitication number '13832081'.
branch_officeinteger
Format - int32. Represents the branch office of customer, this value by default will be 0.
Format: "int32"
activestring
Represents the state of customer.
This value can be 'true' or 'false', by default will be true.
typestring
Represents the customer type (this type can be 'Customer', 'Supplier 'and 'Other'),
this field will be 'Customer' by default.
person_typestring
Represents the person type, this type can be a 'Person' or 'Company'.
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
curl -X GET "https://api.siigo.com/v1/customers?identification=13832081&branch_office=0&active=true&type=Customer&person_type=%27Person%27&created_start=2019-08-24T14%3A15%3A22Z&created_end=2019-08-24T14%3A15%3A22Z&date_start=2019-08-24T14%3A15%3A22Z&date_end=2019-08-24T14%3A15%3A22Z&updated_start=2019-08-24T14%3A15%3A22Z&updated_end=2019-08-24T14%3A15%3A22Z&page=1&page_size=25" \
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
      "type": "Customer",
      "person_type": "'Person'",
      "id_type": {
        "code": "13",
        "name": "Cédula de ciudadanía"
      },
      "identification": "13832081",
      "branch_office": 0,
      "check_digit": "4",
      "name": [
        "string"
      ],
      "commercial_name": "string",
      "active": true,
      "vat_responsible": false,
      "fiscal_responsibilities": [
        {
          "code": "R-99-PN",
          "name": "Not responsible"
        }
      ],
      "address": {
        "address": "Cra. 18 #79A - 42",
        "city": {
          "country_code": "Co",
          "country_name": "Colombia",
          "state_code": "19",
          "state_name": "Cauca",
          "city_code": "19001",
          "city_name": "Popayán"
        },
        "postal_code": "110911"
      },
      "phones": [
        {
          "indicative": "57",
          "number": "3006003345",
          "extension": "132"
        }
      ],
      "contacts": [
        {
          "first_name": "Marcos",
          "last_name": "Castillo",
          "email": "[email protected]",
          "phone": {
            "indicative": "57",
            "number": "3006003345",
            "extension": "132"
          }
        }
      ],
      "comments": "This is an additional comment",
      "related_users": {
        "seller_id": 625,
        "collector_id": 625
      },
      "custom_fields": [
        {
          "key": "YearsOld",
          "value": "29"
        }
      ],
      "metadata": {
        "created": "2020-06-15T03:33:17.0000000+00:00",
        "last_updated": null
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

