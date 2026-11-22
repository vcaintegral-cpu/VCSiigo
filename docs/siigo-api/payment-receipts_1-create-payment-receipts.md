Crear Recibo de pago o egreso
Comprobante que permite registrar los abonos a deuda, anticipos y recibos de pago o egreso avanzados.
Este endpoint te permite crear recibos de pago o egreso.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo previamente, se puede consultar por: /document-types
datedateFecha de comprobante.Campo obligatorio, debe ir en formato de AAAA-MM-DD.
typestringIndica el tipo de recibo que se realizará.Se debe indicar si es anticipo, abono a deuda o un recibo avanzado.
supplier.identificationstringNúmero de identificación del proveedor.Campo obligatorio, debe existir en Siigo Nube, debe estar activo.
supplier.branch_officenumberNúmero de Sucursal del proveedor.Campo opcional, si no se envía toma por defecto el 0.
currency.codestringCódigo de moneda.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
items.due.prefixstringPrefijo del vencimiento.Campo obligatorio, alfanumérico que indica el comprobante o prefijo de vencimiento.
items.due.consecutivenumberConsecutivo del vencimiento a pagar.Campo obligatorio, debe ser numérico sin decimales.
items.due.quotenumberCuota del vencimiento a pagar.Campo obligatorio, debe ser numérico sin decimales.
items.due.datedateFecha de pago del vencimiento.Campo obligatorio, debe ir en formato de AAAA-MM-DD.
payments.idnumberID del medio de pago.Campo obligatorio, debe existir en Siigo Nube y estar activa, se puede consultar por la ruta: /payment-types
payments.valuenumberValor asociado al medio de pago.Campo obligatorio, numérico, máximo 2 decimales.
TipoTipo de Recibo
DebtPaymentAbono a deuda
AdvancePaymentAnticipo
DetailedAvanzado
Json de ejemplo de un recibo de anticipo:
{
	"document": {
		"id": 27234
	},
	"type": "AdvancePayment",
	"date": "2025-01-12",
	"supplier": {
		"identification": "109048401",
		"branch_office": "0"
	},
	"payment": {
		"id": 5638,
		"value": 10000
	},
	"observations": "observación de prueba"
}
Crear Recibo de pago o egreso - Avanzado
Crear un nuevo Recibo de pago o egreso avanzado.Este tipo de recibo de pago o egreso
tiene la característica de poder asociar múltiples registros contables en donde puede
llevarse a cabo la adición de cuentas de bancos, vencimientos e impuestos.
Json de ejemplo de un recibo de anticipo:
{
	"document": {
		"id": 24445
	},
	"date": "2015-01-15",
	"type": "Detailed",
	"supplier": {
		"identification": "8694251",
		"branch_office": 0
	},
	"items": [
		{
			"account": {
				"code": "11100501",
				"movement": "Credit"
			},
			"description": "FC-2 Base",
			"value": 50
		},
		{
			"account": {
				"code": "13050501",
				"movement": "Debit"
			},
			"due": {
				"prefix": "FC-1",
				"consecutive": 684,
				"quote": 1,
				"date": "2020-02-15"
			},
			"description": "FC-2 Base",
			"value": 50
		},
		{
			"account": {
				"code": "24081001",
				"movement": "Debit"
			},
			"tax": {
				"id": 13156
			},
			"description": "FC-2 Base",
			"value": 19
		},
		{
			"account": {
				"code": "11100501",
				"movement": "Credit"
			},
			"description": "FC-2 Base",
			"value": 19
		}
	],
	"observations": "observación de prueba"
}
POST/v1/payment-receipts
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
documentRequired
object
Información del documento asociado.
Show Attributes
dateRequired
string
Fecha del recibo de pago/egreso.
Format: "date"
typeRequired
string
Tipo de recibo (por ejemplo, Detailed o DebtPayment).
supplierRequired
object
Información del proveedor.
Show Attributes
cost_centerinteger
Centro de costos asociado al recibo.
itemsRequired
array<object>
Lista de ítems contables asociados al recibo.
Show Attributes
observationsstring
Observaciones adicionales del recibo.
curl -X POST "https://api.siigo.com/v1/payment-receipts" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 7714
    },
    "date": "2024-12-15",
    "type": "Detailed",
    "supplier": {
      "identification": "13832081",
      "branch_office": 0
    },
    "cost_center": 235,
    "items": [
      {
        "account": {
          "code": "11050501",
          "movement": "Debit"
        },
        "description": "Descripción Débito",
        "value": 119000
      },
      {
        "account": {
          "code": "11100501",
          "movement": "Credit"
        },
        "description": "Descripción Crédito",
        "value": 119000
      }
    ],
    "observations": "Observaciones"
  }'
201
Recibo de pago/egreso creado exitosamente.
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 7714
  },
  "number": 22,
  "name": "RC-2-22",
  "date": "2015-12-15",
  "type": "Detailed",
  "supplier": {
    "identification": "13832081",
    "branch_office": 0
  },
  "items": [
    {
      "account": {
        "code": "11050501",
        "movement": "Debit"
      },
      "description": "Descripción Débito",
      "value": 119000
    },
    {
      "account": {
        "code": "11100501",
        "movement": "Credit"
      },
      "description": "Descripción Crédito",
      "value": 119000
    }
  ],
  "observations": "Observaciones",
  "metadata": {
    "created": "2020-06-15T03:33:17.208Z",
    "last_updated": "null"
  }
}
TypeScript

