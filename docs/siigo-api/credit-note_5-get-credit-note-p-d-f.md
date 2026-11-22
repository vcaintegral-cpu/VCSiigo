PDF Notas Crédito
Generar pdf de Notas Crédito integrada.
Para visualizar una Nota Crédito en Siigo Nube puedes ingresar al ícono de la lupa que corresponde al Buscador, digita el número y oprime en Notas Crédito.
GET/v1/credit-notes/{id}/pdf
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of credit note, this value must be a 'Guid'
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/credit-notes/497f6eca-6276-4993-bfeb-53cbbbba6f08/pdf" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "cude": "123456789012",
  "base64": "string"
}
TypeScript

