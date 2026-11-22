XML Factura de Venta
Ahora podras consultar el XML de las facturas en formato base 64 desde el endpoint de invoices con el id de la factura/xml
Para visualizar el XML en Siigo Nube, se debe ingresar al reporte de Proveedor tecnológico (PT) - Informes facturación electrónica. En el reporte de Comprobantes por cliente encontraras una columna llamada XML para descargarlo por cada factura.
GET/v1/invoices/{id}/xml
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
curl -X GET "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08/xml" \
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

