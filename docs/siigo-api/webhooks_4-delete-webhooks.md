Borrar una suscripción de Webhooks
Borrar una suscripción de webhooks. Para esto solo se debe enviar el ID de la suscripción acompañado del campo "deleted" en true para eliminarlo.
DELETE/v1/webhooks/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Identificador único del webhook a eliminar.
Format: "uuid"
curl -X DELETE "https://api.siigo.com/v1/webhooks/63f918c2-ca65-4edc-a7db-66bcdd5159fb" \
  -H "Authorization: <token>"
200
Webhook eliminado exitosamente.
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "deleted": true
}
TypeScript

