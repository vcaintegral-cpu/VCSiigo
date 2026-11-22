Borrar Factura
No se podrán borrar facturas que estén en proceso de envío a la DIAN o aceptadas (Que tenga CUFE), tampoco facturas que tengan relacionados otros documentos en Siigo Nube (Notas crédito, Notas débito, Recibos de caja, Ajustes de cartera) se deben eliminar primero los documentos relacionados en Siigo Nube.
DELETE/v1/invoices/{id}
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
curl -X DELETE "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "deleted": true
}
TypeScript

