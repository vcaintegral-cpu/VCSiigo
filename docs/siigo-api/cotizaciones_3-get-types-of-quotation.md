Consultar Tipos de Cotización
Lista todos los tipos de Cotización que se encuentran configurados en Siigo Nube y sus características.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único del tipo de cotización, este dato se debe enviar en las creaciones de cotización en el campo document.id
codestringCódigo asignado en Siigo Nube al tipo de cotización.
namestringNombre del tipo de cotización.
descriptionstringDescripción del tipo de cotización.
typestringIndica el tipo de documento, en este caso "C" para cotización.
activebooleanEstado del tipo de documento.
cost_centerbooleanIndica si se pueden manejar centros de costo o no en este tipo de cotización.
cost_center_mandatorybooleanIndica si se maneja centro de costo de forma obligatoria en este tipo de cotización.
automatic_numberbooleanIndica si se maneja numeración automática o no en este tipo de cotización, si es false, en la creación de cotización usando este tipo, se debe enviar el campo "number".
consecutivenumberNúmero del próximo consecutivo de cotización.
discount_typestringIndica el tipo de descuento que se maneja en este tipo de cotización "Percentage" o "Value", de esto depende la forma en la que envías un descuento en un ítem al crear cotización de este tipo.
decimalsbooleanIndica si se manejan decimales en este tipo de cotización.
GET/v1/document-types?type=C
Query
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/document-types?type=C" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": 24446,
  "code": "1",
  "name": "Cotización",
  "description": "Cotización",
  "type": "C",
  "active": true,
  "cost_center": false,
  "cost_center_mandatory": false,
  "automatic_number": true,
  "consecutive": 3,
  "discount_type": "Percentage",
  "decimals": true
}
TypeScript

