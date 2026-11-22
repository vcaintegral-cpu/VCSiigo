PDF de Factura de Venta
Generar pdf y ver la vista previa de la factura de venta integrada.
Para visualizar una factura en Siigo Nube puedes ingresar al ícono de la lupa que corresponde al Buscador, digita el número y oprime en Facturas.
GET/v1/invoices/{id}/pdf
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
curl -X GET "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08/pdf" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "cufe": "123456789012",
  "base64": "string"
}
TypeScript

