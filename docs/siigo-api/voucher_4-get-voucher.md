Consultar Recibo de caja
Consultar un Recibo de caja por su id.
Consultar un recibo de caja por su id. La respuesta varía según el tipo de recibo:
Recibos DebtPayment y AdvancePayment retornan un objeto.
Recibos MiscIncome retornan un objeto.
Se manejan los siguientes datos informativos:
NombreTipoDescripción
idstringIdentificador del recibo de caja.
document.idnumberIdentificador del comprobante. Consultar en: /document-types?type=RC
numbernumberConsecutivo/número del comprobante, obligatorio según configuración del tipo de comprobante.
namestringTipo de Comprobante + Código + Número. Por ejemplo: RC-1-22
datestringFecha de la recepción de pago. Formato yyyy-MM-dd.
customer.idstringSerial identificador del cliente.
customer.identificationstringNúmero de identificación del cliente.
customer.branch_officestringSucursal. Por defecto 0.
items.due.prefixstringPrefijo del vencimiento al que se aplicó el abono.
items.due.consecutivenumberConsecutivo del vencimiento.
items.due.quotenumberCuota del vencimiento.
items.due.datestringFecha del vencimiento. Formato yyyy-MM-dd.
items.taxes.idnumberIdentificador único del impuesto aplicado al vencimiento.
items.taxes.namestringNombre del impuesto.
items.taxes.percentagenumberPorcentaje del impuesto.
items.taxes.basenumberBase del impuesto.
items.taxes.valuenumberValor del impuesto.
items.discounts.idnumberIdentificador único del descuento aplicado al vencimiento.
items.discounts.namestringNombre del descuento.
items.discounts.valuenumberValor del descuento aplicado.
payments.idnumberID del medio de pago.
payments.namestringNombre del medio de pago.
payments.valuenumberValor asociado al medio de pago.
balancenumberSaldo del recibo de caja.
cost_centernumberCentro de costo del recibo de caja.
observationsstringComentarios del recibo de caja.
metadata.createdstringFecha y hora de creación (UTC).
metadata.last_updatedstringFecha y hora de última actualización (UTC).
GET/v1/vouchers/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of vocher, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/vouchers/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 22
  },
  "number": 25,
  "name": "RC-2-22",
  "date": "2021-10-31",
  "type": "DebtPayment",
  "cost_center": 235,
  "customer": {
    "id": "302580df-838b-4531-b8bf-dd3c98b34059",
    "identification": "13832081",
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
      "tax": {
        "id": 13156,
        "name": "VAT 19%",
        "type": "IVA",
        "percentage": 19,
        "value": 5,
        "base_value": 2000
      },
      "description": "This is a description",
      "value": 119000
    }
  ],
  "payment": {
    "id": 5636,
    "name": "Credit",
    "value": 1273.03,
    "due_date": "2021-03-19"
  },
  "observations": "This is an observation",
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript

