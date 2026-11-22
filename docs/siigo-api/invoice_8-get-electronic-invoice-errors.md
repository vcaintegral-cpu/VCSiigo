Consulta de errores en facturas rechazadas por la DIAN
Podrás consultar los errores de una factura que ha sido rechazada por la DIAN.
GET/v1/invoices/{id}/stamp/errors
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of invoice, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08/stamp/errors" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "errors": [
    {
      "message": "This is an Error"
    }
  ]
}
TypeScript

