Impuestos
Este endpoint te permite consultar el listado de impuestos creados en Siigo Nube para utilizarlos en la creación de comprobantes.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberId del impuesto.
namestringNombre del impuesto.
typestringTipo de impuesto.
percentagenumberPorcentaje del impuesto.
activebooleanIndica si el impuesto está activo en la configuración.
¿Como crear impuestos en Siigo Nube?
GET/v1/taxes
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/taxes" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 13156,
    "name": "IVA 19%",
    "type": "IVA",
    "percentage": 19,
    "active": true
  }
]
TypeScript

