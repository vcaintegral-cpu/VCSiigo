Borrar Producto
Borrar un producto o servicio.
DELETE/v1/products/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Formato - uuid. Representa el Id único del producto, este valor debe ser un Guid con el siguiente formato 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X DELETE "https://api.siigo.com/v1/products/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "deleted": true
}
TypeScript

