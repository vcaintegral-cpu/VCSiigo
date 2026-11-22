Centros de Costo
Este endpoint te permite consultar todos los centros de costos creados en Siigo Nube. Se utilizan para relacionar en los comprobantes Factura de venta, Recibo de caja, comprobante contable y notas crédito.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único del centro de costo.
codestringCódigo del centro de costo.
namestringNombre del centro de costo.
activebooleanEstado del centro de costo.
¿Como crear centros de costo en Siigo Nube?
GET/v1/cost-centers
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/cost-centers" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 13222,
    "code": "1112",
    "name": "center",
    "active": true
  }
]
TypeScript

