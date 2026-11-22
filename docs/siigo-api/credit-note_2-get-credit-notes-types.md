On this pageConsultar Tipos de notas crédito
Lista todos los tipos de notas crédito que se encuentran configurados en Siigo Nube y sus características.
Query Parameters
ParámetroTipoDescripción
idstringIdentificador de la nota crédito.
codenumberCódigo del tipo de nota crédito.
namestringNombre interno para identificar el comprobante de nota crédito.
descriptionstringDescripción del nombre de la nota crédito.
typestringTipo de nota crédito.
activebooleanIndica si la nota crédito está activa o no.
cost_centerbooleanIndica si se pueden manejar centros de costo o no en este tipo de nota crédito.
cost_center_mandatorybooleanIndica si se maneja centro de costo de forma obligatoria en este tipo de nota crédito.
cost_center_defaultbooleanIndica si se maneja un centro de costos por defecto en el tipo de nota crédito.
automatic_numberbooleanIndica si se maneja numeración automática o no en este tipo de nota crédito; si es false, al crear la nota se debe enviar el campo "number".
consecutivenumberNúmero del próximo consecutivo de la nota crédito.
customer_by_itembooleanIndica si el tipo de nota crédito maneja ingresos para terceros en los ítems.
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

