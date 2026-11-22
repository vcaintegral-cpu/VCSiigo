Borrar recibo de pago/egreso
Borrar un recibo de pago/egreso identificando el ID del recibo que se desea eliminar.
NombreTipoDescripción
idstringIndicador único del recibo de pago.
deletedbooleanIndica si el recibo de pago fue eliminado exitosamente.
DELETE/v1/payment-receipts/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of PaymentReceipts, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X DELETE "https://api.siigo.com/v1/payment-receipts/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "deleted": true
}
TypeScript

