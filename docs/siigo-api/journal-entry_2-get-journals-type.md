Consultar Tipos de comprobantes contables
Lista todos los tipos de comprobantes contables que se encuentran configurados en Siigo Nube y sus características.
Query Parameters
NombreTipoDescripción
idstringIdentificador del recibo de caja.
codenumberCódigo del tipo de recibo de caja.
namestringNombre interno para identificar el comprobante de recibo de caja.
descriptionstringDescripción del nombre del recibo de caja.
typestringTipo de recibo de caja.
activebooleanIndica si el recibo de caja está activo o no.
cost_centerbooleanIndica si se pueden manejar centros de costo en este tipo de recibo de caja.
cost_center_mandatorybooleanIndica si se maneja centro de costo de forma obligatoria en este tipo de recibo de caja.
cost_center_defaultbooleanIndica si se maneja un centro de costos por defecto en el tipo de recibo de caja.
automatic_numberbooleanIndica si se maneja numeración automática; si es false, al crear el recibo se debe enviar el campo "number".
consecutivenumberNúmero del próximo consecutivo del recibo de caja.
GET/v1/document-types?type=CC
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
typestring
Tipo de comprobante (por ejemplo, 'CC' para Comprobante contable)
curl -X GET "https://api.siigo.com/v1/document-types?type=CC?type=CC" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": 59625,
  "code": "A1",
  "name": "Ajustes contables",
  "description": "Ajustes contables",
  "type": "CC",
  "active": true,
  "cost_center": false,
  "cost_center_mandatory": false,
  "cost_center_default": 1513,
  "automatic_number": true,
  "consecutive": 13
}
TypeScript

