On this pageCrear Recibo de caja
Este endpoint te permite crear recibos de caja para registrar abonos a deuda y anticipos.
Debido a ajustes realizados en Siigo Nube en los recibos de caja, se actualizaron los request de los recibos de caja en Siigo API. Entre los ajustes encontrarás las siguientes novedades:
Se elimina el tipo de recibo de caja avanzado (Detailed).
En el recibo de caja de abono a una deuda (DebtPayment) se incluyen impuestos y descuentos aplicados al vencimiento para realizar ajustes al saldo. Estos descuentos se pueden consultar en el nuevo endpoint /expenses.
Se agrega un nuevo tipo de recibo de caja para otros ingresos llamado MiscIncome. Su creación se documenta en Crear Recibo de caja - Otros ingresos.
Campos del request
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo Nube previamente, se puede consultar por: /document-types?type=RC.
datedateFecha de comprobante.Campo obligatorio, debe ir en formato AAAA-MM-DD.
typestringIndica el tipo de recibo que se realizará.Campo obligatorio. Debe indicar si es anticipo (AdvancePayment) o abono a deuda (DebtPayment). Ver tabla de tipos más abajo.
customer.identificationstringNúmero de identificación del cliente.Campo obligatorio, debe existir en Siigo Nube y estar activo.
customer.branch_officenumberNúmero de sucursal del cliente.Campo opcional, si no se envía toma por defecto el 0.
currency.codestringCódigo de moneda.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
items.due.prefixstringPrefijo del vencimiento.Campo obligatorio, alfanumérico que indica el comprobante o prefijo del vencimiento.
items.due.consecutivenumberConsecutivo del vencimiento a pagar.Campo obligatorio, debe ser numérico sin decimales.
items.due.quotenumberCuota del vencimiento a pagar.Campo obligatorio, debe ser numérico sin decimales.
items.due.datedateFecha de pago del vencimiento.Campo opcional, debe ir en formato AAAA-MM-DD.
items.taxes[].idnumberIdentificador único del impuesto.Impuestos aplicados al vencimiento para realizar ajustes al saldo.
items.taxes[].namestringNombre del impuesto.Impuestos aplicados al vencimiento para realizar ajustes al saldo.
items.taxes[].percentagenumberPorcentaje del impuesto relacionado.Impuestos aplicados al vencimiento para realizar ajustes al saldo.
items.taxes[]].basenumberBase del impuesto relacionado.Impuestos aplicados al vencimiento para realizar ajustes al saldo.
items.taxes[].valuenumberValor del impuesto relacionado.Impuestos aplicados al vencimiento para realizar ajustes al saldo.
items.discounts.idnumberIdentificador único del descuento.Descuentos a aplicar al saldo del vencimiento. Consultar IDs disponibles en /expenses.
items.discounts.namestringNombre del descuento.Descuentos a aplicar al saldo del vencimiento. Consultar IDs disponibles en /expenses.
items.discounts.valuenumberValor del descuento relacionado.Descuentos a aplicar al saldo del vencimiento. Consultar IDs disponibles en /expenses.
items.valuenumberValor total del ítem.Campo obligatorio.
payment.idnumberID del medio de pago.Campo obligatorio, debe existir en Siigo Nube y estar activo, se puede consultar por la ruta: /payment-types.
payment.valuenumberValor asociado al medio de pago.Campo obligatorio, numérico, máximo 2 decimales.
observationsstringComentarios del recibo de caja.Campo opcional.
Tipos de recibo de caja
TipoDescripción
DebtPaymentAbono a deuda
AdvancePaymentAnticipo
El tipo de recibo de caja avanzado (Detailed) fue eliminado y ya no debe utilizarse.
Para crear recibos de caja de otros ingresos (MiscIncome), consulta Crear Recibo de caja - Otros ingresos.
Ejemplos
Abono a deuda (DebtPayment)
Aplica un pago a uno o varios vencimientos. Permite asociar impuestos (con su base) y descuentos al saldo del vencimiento.
{
    "document": {
        "id": 7714
    },
    "date": "2021-04-22",
    "type": "DebtPayment",
    "customer": {
        "identification": "209048401",
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
                "quote": 1
            },
            "taxes": [
                {
                    "id": 13156,
                    "base": 100000
                }
            ],
            "discounts": [
                {
                    "id": 156,
                    "value": 1000
                }
            ],
            "value": 119000
        }
    ],
    "payment": {
        "id": 5636,
        "value": 119000
    },
    "observations": "Observaciones"
}
Anticipo (AdvancePayment)
Registra un anticipo del cliente sin asociarlo a un vencimiento. No requiere items.
{
    "document": {
        "id": 27234
    },
    "type": "AdvancePayment",
    "date": "2021-04-12",
    "customer": {
        "identification": "109048401",
        "branch_office": 0
    },
    "payment": {
        "id": 5638,
        "value": 10000
    },
    "observations": "observación de prueba"
}
POST/v1/vouchers
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
curl -X POST "https://api.siigo.com/v1/vouchers" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 7714
    },
    "date": "2021-04-22",
    "type": "DebtPayment",
    "customer": {
      "identification": "209048401",
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
          "quote": 1
        },
        "taxes": [
          {
            "id": 13156,
            "base": 100000
          }
        ],
        "discounts": [
          {
            "id": 156,
            "value": 1000
          }
        ],
        "value": 119000
      }
    ],
    "payment": {
      "id": 5636,
      "value": 119000
    },
    "observations": "Observaciones"
  }'
201
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 7714
  },
  "number": 22,
  "name": "RC-2-22",
  "date": "2021-04-22",
  "type": "DebtPayment",
  "cost_center": 235,
  "customer": {
    "id": "302580df-838b-4531-b8bf-dd3c98b34059",
    "identification": "209048401",
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
      "taxes": [
        {
          "id": 13156,
          "name": "IVA 19%",
          "type": "IVA",
          "percentage": 19,
          "base": 100000,
          "value": 19000
        }
      ],
      "discounts": [
        {
          "id": 156,
          "name": "Descuento pronto pago",
          "value": 1000
        }
      ],
      "description": "This is a description",
      "value": 119000
    }
  ],
  "payment": {
    "id": 5636,
    "name": "Crédito",
    "value": 119000,
    "due_date": "2021-03-19"
  },
  "observations": "Observaciones",
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript
On this page
Campos del requestTipos de recibo de cajaEjemplosAbono a deuda (DebtPayment)Anticipo (AdvancePayment)

