Consultar Tipos de notas crédito
Lista todos los tipos de notas crédito que se encuentran configurados en Siigo Nube y sus características.
GET/v1/document-types?type=NC
Query
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/document-types?type=NC" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "number": 59625,
  "code": "1",
  "name": "Nota Crédito",
  "description": "Nota Crédito",
  "type": "NC",
  "active": true,
  "cost_center": false,
  "cost_center_mandatory": false,
  "cost_center_default": 1513,
  "automatic_number": true,
  "consecutive": 3,
  "customer_by_item": true
}
TypeScript

