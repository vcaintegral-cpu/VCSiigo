On this pageCrear Recibo de caja - Otros ingresos
Crea un nuevo recibo de caja de tipo otros ingresos (MiscIncome) para relacionar ingresos de otros conceptos.
Este tipo de recibo de caja tiene la característica de poder asociar otros ingresos por medio del recibo de caja. Estos ingresos los puedes crear en Siigo Nube en la opción: https://siigonube.siigo.com/#/accountingparameter/1639?conceptType=1
Para consultar el ID de estos tipos de ingreso debes realizar una consulta (GET) al endpoint /misc-incomes.
Campos del request
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo Nube previamente, se puede consultar por: /document-types?type=RC.
datedateFecha de comprobante.Campo obligatorio, debe ir en formato AAAA-MM-DD.
typestringIndica el tipo de recibo que se realizará.Campo obligatorio. Debe ser MiscIncome para otros ingresos.
customer.identificationstringNúmero de identificación del cliente.Campo obligatorio, debe existir en Siigo Nube y estar activo.
customer.branch_officenumberNúmero de sucursal del cliente.Campo opcional, si no se envía toma por defecto el 0.
currency.codestringCódigo de moneda.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
income.idnumberIdentificador del concepto de ingreso.Campo obligatorio. Consultar conceptos disponibles en /misc-incomes.
payment.idnumberID del medio de pago.Campo obligatorio, debe existir en Siigo Nube y estar activo, se puede consultar por la ruta: /payment-types.
payment.valuenumberValor asociado al medio de pago.Campo obligatorio, numérico, máximo 2 decimales.
observationsstringComentarios del recibo de caja.Campo opcional.
Tipo de recibo de caja
TipoDescripciónObjeto requestObjeto response
MiscIncomeOtros ingresosVoucherInMiscIncomeVoucherOutMiscIncome
Ejemplo
Otros ingresos (MiscIncome)
{
    "document": {
        "id": 170674
    },
    "type": "MiscIncome",
    "date": "2026-03-19",
    "customer": {
        "identification": "1152489636",
        "branch_office": 0
    },
    "income": {
        "id": 174
    },
    "payment": {
        "id": 3720,
        "value": 12000
    },
    "observations": "observación de prueba"
}
Para consultar los conceptos de otros ingresos disponibles realiza una petición GET al endpoint /misc-incomes. Los conceptos se crean desde Siigo Nube en: https://siigonube.siigo.com/#/accountingparameter/1639?conceptType=1
POST/v1/vouchers?type=MiscIncome
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Represents the request with the voucher information.
documentRequired
object
Show Attributes
numberinteger
Representa el número secuencial del documento, este número es requerido dependiendo del tipo de comprobante.
Format: "int64"
namestring
Contiene información sobre el tipo de documento, el ID del tipo de documento y el número secuencial del documento. Por ejemplo, 'RC-2-22'.
dateRequired
string
Representa la fecha del documento. Este formato debe ser 'aaaa-MM-dd'. Por ejemplo, '2021-10-31'.
typeRequired
string
Tipo de Recibo de Caja: DebtPayment (abono a deuda), AdvancePayment (anticipo) o MiscIncome (otros ingresos).
Value in: "DebtPayment" | "AdvancePayment" | "MiscIncome"
customerRequired
object
Show Attributes
cost_centerinteger
Representa el ID del centro de costos.
Format: "int64"
currencyobject
Show Attributes
itemsarray<object>
Facturas a las que se les va a aplicar el abono o pago. Obligatorio si type = DebtPayment.
Show Attributes
incomeobject
Show Attributes
paymentRequired
object
Show Attributes
observationsstring
Representa comentarios adicionales en el documento.
curl -X POST "https://api.siigo.com/v1/vouchers?type=MiscIncome" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 170674
    },
    "type": "MiscIncome",
    "date": "2026-03-19",
    "customer": {
      "identification": "1152489636",
      "branch_office": 0
    },
    "income": {
      "id": 174
    },
    "payment": {
      "id": 3720,
      "value": 12000
    },
    "observations": "observación de prueba"
  }'
201
Success
Response
{
  "document": {
    "id": 170674
  },
  "type": "MiscIncome",
  "date": "2026-03-19",
  "customer": {
    "identification": "1152489636",
    "branch_office": 0
  },
  "income": {
    "id": 2456,
    "name": "Ajuste al peso"
  },
  "payment": {
    "id": 324720,
    "value": 12000
  },
  "observations": "observación de prueba"
}
TypeScript
On this page
Campos del requestTipo de recibo de cajaEjemploOtros ingresos (MiscIncome)

