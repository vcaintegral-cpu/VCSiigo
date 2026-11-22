Borrar una factura de compra.
Borrar una factura de compra.
NombreTipoDescripción
idstringIndicador único de la factura.
deletedbooleanIndica si la factura fue eliminada exitosamente.
DELETE/v1/purchases/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of purchase, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X DELETE "https://api.siigo.com/v1/purchases/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "deleted": true
}
TypeScript

