On this pageBorrar Documento Soporte.
Borrar Documento Soporte.
Borrar una documento soporte.
NombreTipoDescripción
idstringIndicador único del documento soporte
deletedbooleanIndica si el documento soporte fue eliminada exitosamente.
DELETE/v1/purchase-support-documents/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Identificador del documento soporte
curl -X DELETE "https://api.siigo.com/v1/purchase-support-documents/63f918c2-ca65-4edc-a7db-66bcdd5159fb" \
  -H "Authorization: <token>"
200
Documento eliminado
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "deleted": true
}
TypeScript

