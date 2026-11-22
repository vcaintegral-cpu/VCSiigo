Consultar Recibo de pago o egreso
Consultar un Recibo de pago o egreso por su id.
Se manejan los siguientes datos informativos:
NombreTipoDescripción
idstringIdentificador del recibo de pago/egreso.
document.idnumberIdentificador del comprobante, se puede consultar en https://api.siigo.com/v1/document-types?type=RP.
numbernumberConsecutivo/número del comprobante, el campo es obligatorio según la configuración del tipo de comprobante.
namestringTipo de Comprobante + Código de Comprobante + Número de Comprobante. Por ejemplo: RP-1-22
datestringFecha de la recepción de pago, formato yyyy-MM-dd.
supplier.idstringSerial identificador del proveedor.
supplier.identificationstringNúmero de identificación del proveedor.
supplier.branch_officestringSucursal, valor por default 0.
payments.idnumberID del medio de pago.
payments.namestringNombre del medio de pago.
payments.valuenumberValor asociado al medio de pago.
cost_centernumberIndica el Centro de costo del recibo de pago/egreso.
observationsstringComentarios para agregar información al recibo de pago/egreso.
GET/v1/payment-receipts/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Identificador único del recibo de pago/egreso.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/payment-receipts/63f918c2-ca65-4edc-a7db-66bcdd5159fb" \
  -H "Authorization: <token>"
200
Consulta exitosa del recibo de pago/egreso.
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 7714
  },
  "number": 22,
  "name": "RP-2-22",
  "date": "2024-12-15",
  "type": "DebtPayment",
  "supplier": {
    "identification": "13832081",
    "branch_office": 0
  },
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "items": [
    {
      "due": {},
      "value": 119000
    }
  ],
  "payment": {
    "id": 5636,
    "name": "Crédito",
    "value": 119000
  },
  "balance": 0,
  "observations": "Observaciones",
  "metadata": {
    "created": "2020-06-15T03:33:17.208Z",
    "last_updated": "null"
  }
}
TypeScript

