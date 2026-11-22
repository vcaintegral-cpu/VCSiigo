On this pageDescuentos en recibos de caja
Este endpoint te permite consultar todos los descuentos creados en Siigo Nube. Se utilizan para relacionar en los recibos de caja de tipo Abono a una deuda (`DebtPayment`).
Datos que encontrarás en el response
NombreTipoDescripción
idnumberIdentificador del descuento.
namestringNombre del descuento.
GET/v1/expenses
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/expenses" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 1576,
    "name": "51451001 - Mantenimientos - Construcciones y edificaciones"
  },
  {
    "id": 1574,
    "name": "51400501 - Notariales"
  },
  {
    "id": 1586,
    "name": "51956501 - Parqueaderos"
  }
]
TypeScript
On this page
Datos que encontrarás en el response

