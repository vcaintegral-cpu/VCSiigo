Generar reporte de cuentas por pagar
Esta funcionalidad te retornará la información de las cuentas por pagar de la empresa en tipo Json.
Filtros
ParamTypeDescription
due_date_startDateDevuelve resultados donde el campo "due_date" es mayor o igual que este valor.
due_date_endDateDevuelve resultados donde el campo "due_date" es menor o igual que este valor.
provider_identificationNumberMuestra los resultados del proveedor que tenga este número de identificación.
provider_branch_officeNumberFiltra por cada sucursal del proveedor si lo maneja. Debe ser un valor numérico entre 0 y 999. Debe enviar el tipo de identificación primero. Ejemplo: provider_identification=1032492985&provider_branch_office=001
Date: yyyy-MM-dd
Date and time in UTC: yyyy-MM-ddTHH:mm:ssZ
Datos que encontrarás en el response:
NombreTipoDescripción
due.prefixstringPrefijo del vencimiento.
due.consecutivestringConsecutivo del vencimiento.
due.quotestringCuota del vencimiento del pago.
due.datestringFecha del vencimiento del pago.
due.balancenumberValor del vencimiento del pago en moneda local.
provider.idstringNúmero de ID en el sistema del proveedor.
provider.identificationnumberNúmero de identificación del proveedor.
provider.brach_officenumberNúmero de sucursal del proveedor.
provider.namestringNombre del proveedor.
cost_center.codestringCódigo del centro de costo asociado al vencimiento del pago.
cost_center.namestringNombre del centro de costo asociado al vencimiento del pago.
currency.money_codestringNombre de la moneda extranjera del vencimiento del pago.
currency.balancestringValor en moneda extranjera del vencimiento del pago.
GET/v1/accounts-payable
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
provider_identificationstring
Represents the provider id associated to account payable.
For example, the number '51874544' can be the id of the customer 'Jackson Smith'.
provider_branch_officeinteger
Format - int32. Represents the branch office id associated to provider.
For example, the branch office '627'.
due_date_startstring
Format - date-time (as date-time in RFC3339). Returns results with date greater or equal than the "due_date_start" date
date_endstring
Format - date-time (as date-time in RFC3339). Returns results with date less or equal than the "due_date_end" date
pageinteger
Format - int32. Represents the current page
page_sizeinteger
Format - int32. Represents the number of results per page.
curl -X GET "https://api.siigo.com/v1/accounts-payable?provider_identification=string&provider_branch_office=0&due_date_start=string&date_end=string&page=0&page_size=0" \
  -H "Authorization: <token>"
200
Success
Response
{
  "value": {
    "pagination": {
      "page": 1,
      "page_size": 25,
      "total_results": 11
    },
    "results": [
      {
        "due": {
          "prefix": "FC",
          "consecutive": 4,
          "quote": 1,
          "date": "2023-09-05T12:00:00.0000000+00:00",
          "balance": 200000
        },
        "provider": {
          "id": "3e55cf7f-f7a1-4397-bb02-dbf0acb94edd",
          "identification": "1061695940",
          "branch_office": 0,
          "name": "DavidSantiagoCorchueloCastro"
        },
        "cost_center": {
          "code": 24088,
          "name": "Alienz"
        }
      },
      {
        "due": {
          "prefix": "azx",
          "consecutive": 106,
          "quote": 1,
          "date": "2023-08-24T12:00:00.0000000+00:00",
          "balance": 3000
        },
        "provider": {
          "id": "3e55cf7f-f7a1-4397-bb02-dbf0acb94edd",
          "identification": "1061695940",
          "branch_office": 0,
          "name": "DavidSantiagoCorchueloCastro"
        },
        "cost_center": {
          "code": 24088,
          "name": "Alienz"
        },
        "currency": {
          "money_code": "USD",
          "balance": 100
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "https://servicesqa.siigo.com/alliances/api/siigoapi/v1/accounts_payable"
    }
  }
}
TypeScript

