Generar balance de prueba por tercero
Generar balance de prueba por tercero
Esta funcionalidad te retornará una URL para descargar un archivo de excel con el balance de prueba por tercero de tu empresa. Para generar un reporte de Balance de prueba debes tener en cuenta la siguiente información que debes enviar en el cuerpo de la petición:
NombreTipoDescripciónCaracterísticas
account_startstringNúmero de la cuenta contable desde la que se generará el reporte.Debe existir en Siigo Nube y ser menor o igual al número de la cuenta final. Es opcional. Si no se envía o se envía vacío (""), se usará la primera cuenta creada.
account_endstringNúmero de la cuenta contable hasta la que terminará el reporte.Debe existir en Siigo Nube y ser mayor o igual al número de la cuenta inicial. Es opcional. Si no se envía o se envía vacío, se usará la última cuenta creada.
yearnumberAño del cual se quiere generar el reporte.Debe ser un número entero de cuatro (4) dígitos. Campo obligatorio.
month_startnumberNúmero del mes inicial desde el que se generará el reporte.Debe ser un número entre 1 y 13. No debe ser mayor al mes final. Campo obligatorio.
month_endnumberNúmero del mes final hasta el que se generará el reporte.Debe ser un número entre 1 y 13. No debe ser menor al mes inicial. Campo obligatorio.
includes_tax_differencebooleanIndica si el reporte incluye las cuentas contables de diferencia fiscal.Debe ser un valor booleano: "true" o "false".
customer.identificationstringNúmero de identificación del cliente.El número debe ser un entero sin dígito de verificación. Campo opcional.
customer.branch_officenumberNúmero de sucursal del tercero en Siigo Nube.Debe ser un número entero entre 0 y 999. Campo opcional.
Datos que encontrarás en el response:
NombreTipoDescripción
file_idstringId del reporte generado.
file_urlstringEnlace para descargar el reporte en formato Excel.
POST/v1/test-balance-report-by-thirdparty
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
account_startRequired
string
Número de la cuenta contable desde la que se generará el reporte.
account_endRequired
string
Número de la cuenta contable hasta la que finalizará el reporte.
yearRequired
integer
Año del reporte en formato YYYY.
Format: "int32"
month_startRequired
integer
Mes inicial (1 al 13).
Minimum: 1Maximum: 13
month_endRequired
integer
Mes final (1 al 13).
Minimum: 1Maximum: 13
includes_tax_differenceRequired
boolean
Indica si se deben incluir cuentas con diferencia fiscal.
customerRequired
object
Información del tercero para filtrar el reporte.
Show Attributes
curl -X POST "https://api.siigo.com/v1/test-balance-report-by-thirdparty" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "account_start": "11050501",
    "account_end": "41350501",
    "year": 2023,
    "month_start": 1,
    "month_end": 13,
    "includes_tax_difference": false,
    "customer": {
      "identification": "209048401",
      "branch_office": 0
    }
  }'
201
Balance report by third party generated successfully.
Response
{
  "file_id": "24880c55-65c9-4bf0-83a1-137e12671813",
  "file_url": "https://reportsexcelprod.blob.core.windows.net/pilotocalidadnube/Balance%20de%20prueba%20general-20230111125739.xlsx"
}
TypeScript

