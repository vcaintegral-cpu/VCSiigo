Listas de Precio
Este endpoint te permite consultar todas las listas de precios registradas para vender tus productos.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador de la lista de precio.
namestringNombre de la lista de precio.
activebooleanIndica si la lista de precio está en uso.
positionnumberPosición de la lista de precio.
¿Como definir o activar listas de precio en Siigo Nube?
GET/v1/price-lists
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/price-lists" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 2766,
    "name": "Sale Price 1",
    "active": true,
    "position": 1
  }
]
TypeScript

