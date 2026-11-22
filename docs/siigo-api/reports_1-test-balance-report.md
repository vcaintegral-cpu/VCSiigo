Generar Balance de prueba general
Esta funcionalidad te retornará una URL para descargar un archivo de excel con el balance de prueba general de tu empresa. Para generar un reporte de Balance de prueba debes tener en cuenta la siguiente información que debes enviar en el cuerpo de la petición:
NombreTipoDescripciónCaracterísticas
account_startstringNúmero de la cuenta contable desde la que se generará el reporte.Debe existir en Siigo Nube y debe ser menor o igual al número de la cuenta final. Opcional; si no se envía se toma la primera cuenta.
account_endstringNúmero de la cuenta contable hasta la que terminará el reporte.Debe existir en Siigo Nube y debe ser mayor o igual al número de la cuenta inicial. Opcional; si no se envía se toma la última cuenta.
yearnumberAño del cual se quiere generar el reporte.Obligatorio. Debe ser un número entero de cuatro (4) dígitos.
month_startnumberNúmero del mes inicial desde el que se generará el reporte.Obligatorio. Número entero entre 1 y 13. No debe ser mayor al mes final.
month_endnumberNúmero del mes final hasta el que se generará el reporte.Obligatorio. Número entero entre 1 y 13. No debe ser menor al mes inicial.
includes_tax_differencebooleanIndica si el reporte incluye las cuentas contables de diferencia fiscal.Debe ser booleano: "true" o "false".
Datos que encontrarás en el response:
NombreTipoDescripción
file_idstringIdentificador del reporte generado.
file_urlstringEnlace para descargar el reporte generado en formato Excel.
POST/v1/test-balance-report
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
curl -X POST "https://api.siigo.com/v1/test-balance-report" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "account_start": "11050501",
    "account_end": "41350501",
    "year": 2023,
    "month_start": 1,
    "month_end": 13,
    "includes_tax_difference": false
  }'
201
Balance report generated successfully.
Response
{
  "file_id": "24880c55-65c9-4bf0-83a1-137e12671813",
  "file_url": "https://reportsexcelprod.blob.core.windows.net/pilotocalidadnube/Balance%20de%20prueba%20general-20230111125739.xlsx"
}
TypeScript

