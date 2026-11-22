Consultar Tipos de recibos de pago/egreso
Lista todos los tipos de recibos de pago/egreso que se encuentran configurados en Siigo Nube y sus características.
Query Parameters
NombreTipoDescripción
idstringIdentificador del recibo de pago/egreso.
codenumberCódigo del tipo de recibo de pago/egreso.
namestringNombre interno para identificar el comprobante de recibo de pago/egreso.
descriptionstringDescripción del nombre del recibo de pago/egreso.
typestringTipo de recibo de pago/egreso.
activebooleanIndica si el recibo de pago/egreso está activo o no.
cost_centerbooleanIndica si se pueden manejar centros de costo en este tipo de recibo de pago/egreso.
cost_center_mandatorybooleanIndica si se maneja centro de costo de forma obligatoria en este tipo de recibo de pago/egreso.
cost_center_defaultbooleanIndica si se maneja un centro de costos por defecto en este tipo de recibo de pago/egreso.
automatic_numberbooleanIndica si se maneja numeración automática. Si es false, al crear un recibo de pago/egreso se debe enviar el campo "number".
consecutivenumberNúmero del próximo consecutivo del recibo de pago/egreso.
GET/v1/document-types?type=RP
Query
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/document-types?type=RP" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": 59625,
  "code": "1",
  "name": "Recibo de pago",
  "description": "Recibo de pago / egreso",
  "type": "RP",
  "active": true,
  "cost_center": false,
  "cost_center_mandatory": false,
  "cost_center_default": 1513,
  "automatic_number": true,
  "consecutive": 3
}
TypeScript

