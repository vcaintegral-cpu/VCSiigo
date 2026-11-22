Crear Comprobante Contable
En esta sección se muestra un ejemplo de la creación de un comprobante contable de caracteristicas de cuentas sin detalles. Si deseas implementar otro diferente al del ejemplo escríbenos a [email protected] para compartirte ejemplos de los demás tipos de cuentas. Siigo API te permite crear asientos con cuentas contables con las siguientes características:
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo previamente, se puede consultar por: /document-types.
datedateFecha de comprobante.Campo obligatorio, para Facturas de tipo electrónico NO puedes enviar una fecha que tenga más de 10 días de diferencia respecto a la fecha actual.
numbernumberConsecutivo/número del comprobanteEl campo es opcional, si se envía debe ser un consecutivo que no exista en Nube.
currency.codestringCódigo de moneda.Campo opcional, debe tener marcación de moneda extranjera. Si no se envía, se toma la moneda local.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, requiere configuración previa en Siigo.
items.account.codestringNúmero de la cuenta contable.Campo obligatorio, debe existir en Siigo Nube y estar activo.
items.account.movementstringMovimiento débito o crédito de la cuenta contable.Campo obligatorio, debe ser "Debit" o "Credit".
items.customer.identificationstringNúmero de identificación del cliente.Campo obligatorio, debe existir en Siigo Nube y estar activo.
items.customer.branch_officenumberNúmero de sucursal del cliente.Campo opcional, por defecto toma el valor 0.
items.cost_centernumberIdentificador del centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
items.valuenumberValor del movimiento contable.Campo obligatorio, máximo 2 decimales.
items.due.prefixstringPrefijo del vencimiento.Obligatorio si la cuenta está relacionada con vencimientos de cartera.
items.due.consecutivenumberConsecutivo del vencimiento a pagar.Obligatorio si la cuenta está relacionada con vencimientos de cartera.
items.due.quotenumberCuota del vencimiento a pagar.Obligatorio si la cuenta está relacionada con vencimientos de cartera.
items.due.datedateFecha de pago del vencimiento.Obligatorio si la cuenta está relacionada con vencimientos de cartera.
items.tax.idnumberIdentificador único del impuesto.Obligatorio si la cuenta está relacionada con impuestos.
items.tax.namestringNombre del impuesto.Obligatorio si la cuenta está relacionada con impuestos.
items.tax.typestringTipo del impuesto.Obligatorio si la cuenta está relacionada con impuestos.
items.tax.percentagenumberPorcentaje del impuesto.Obligatorio si la cuenta está relacionada con impuestos.
taxes.base_valuenumberValor base para el cálculo del impuesto.Obligatorio si la cuenta está relacionada con impuestos.
items.fixed_assetsnumberIdentificador del activo fijo.Campo opcional, debe existir en Siigo Nube y estar activo.
items.product.codestringCódigo único del producto.Campo obligatorio, debe existir en Siigo Nube y estar activo.
items.product.quantitynumberCantidad del producto.Campo obligatorio, máximo 2 decimales.
items.product.warehousenumberIdentificador de la bodega/almacén.Campo opcional, debe existir en Siigo Nube y estar activa.
observationsstringComentarios u observaciones del comprobante contable.Campo opcional, máximo 4.000 caracteres.
N°Comprobantes Contables
1Sin detalles en cuentas contables (registros de banco, Tesorería, etc)
2Cuentas contables con manejo de vencimientos (cuentas por cobrar o pagar)
3Cuentas contables con manejo de impuestos
4Cuentas contables con manejo de activos fijos
5Cuentas contables con manejo de inventarios
POST/v1/journals
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Represents the request with the journal entry information.
documentRequired
object
Show Attributes
numberinteger
Representa el número secuencial del documento. Este número es requerido dependiendo del tipo de documento.
Format: "int64"
dateRequired
string
Representa la fecha del documento. El formato debe ser 'yyyy-MM-dd'.
Por ejemplo, '2021-10-10' para indicar la fecha 10 de octubre de 2021.
currencyobject
Show Attributes
itemsarray<object>
Contiene una lista de ítems asociados al comprobante contable.
Show Attributes
observationsstring
Representa comentarios adicionales en el documento.
curl -X POST "https://api.siigo.com/v1/journals" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 22
    },
    "number": 20,
    "date": "2021-10-10",
    "currency": {
      "code": "USD",
      "exchange_rate": 3825.03
    },
    "items": [
      {
        "account": {
          "code": "11050501",
          "movement": "Credit"
        },
        "customer": {
          "identification": "13832081",
          "branch_office": 0
        },
        "description": "This is a description",
        "tax": {
          "id": 13156
        },
        "due": {
          "prefix": "FV-1",
          "consecutive": 68,
          "quote": 1,
          "date": "2021-04-22"
        },
        "product": {
          "code": "Item-1",
          "warehouse": 13156,
          "quantity": 2
        },
        "cost_center": 235,
        "fixed_asset": {
          "id": 13156
        },
        "value": 119000
      }
    ],
    "observations": "This is an observation"
  }'
201
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 27441
  },
  "number": 20,
  "name": "CC-10-20",
  "date": "2021-10-10",
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "items": [
    {
      "account": {
        "code": "11050501",
        "movement": "Credit"
      },
      "customer": {
        "id": "302580df-838b-4531-b8bf-dd3c98b34059",
        "identification": "13832081",
        "branch_office": 0
      },
      "cost_center": 235,
      "due": {
        "prefix": "FV-1",
        "consecutive": 68,
        "quote": 1,
        "date": "2021-04-22"
      },
      "tax": {
        "id": 13156,
        "name": "VAT 19%",
        "type": "IVA",
        "percentage": 19,
        "value": 5,
        "base_value": 2000
      },
      "fixed_asset": {
        "id": 13156,
        "name": "Personal Computer"
      },
      "product": {
        "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
        "code": "Item-1",
        "name": "Cotton shirt",
        "warehouse": {
          "id": 15,
          "name": "Main Warehouse"
        },
        "quantity": 2
      },
      "description": "This is a description",
      "value": 119000
    }
  ],
  "observations": "This is an observation",
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript

