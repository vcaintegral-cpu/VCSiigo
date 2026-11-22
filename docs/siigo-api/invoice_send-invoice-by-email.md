Envío de facturas por mail
Mediante este endpoint será posible generar envíos de facturas de venta a direcciones de correo electrónico, es posible enviar hasta 5 direcciones.
POST/v1/invoices/{id}/mail
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Contains the parameters for sending the Email.
guidstring
Guid of the invoice.
Format: "uuid"
mail_tostring
Email address to send the invoice.
copy_tostring
Email addresses to send copies of the invoice, maximum 5 email addresses are allowed.
Path Parameters
idRequired
string
Format - uuid. Represents the Guid of the Invoice.
Format: "uuid"
curl -X POST "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08/mail" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "guid": "a84cb564-8217-4061-98d6-4e0128e517c1",
    "mail_to": "[email protected]",
    "copy_to": "[email protected];[email protected];[email protected];[email protected];[email protected]"
  }'
200400404500
Success
Response
{
  "status": "string",
  "observations": "string"
}
TypeScript

