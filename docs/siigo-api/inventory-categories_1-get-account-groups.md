Consultar Grupos de Inventario
Este endpoint te permite consultar la clasificación de inventarios, la cuál corresponde a la clasificación general de los productos o servicios que se comercializan en la empresa y que se debe configurar previamente en Siigo Nube.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberId de la clasificación de inventario, este dato lo necesitarás para crear posteriormente un producto o servicio.
namestringNombre de la clasificación de inventario.
activebooleanIndica si la clasificación de inventario está en uso.
¿Como configurar mis grupos de inventario en Siigo Nube?
GET/v1/account-groups
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/account-groups" \
  -H "Authorization: <token>"
200
Consulta exitosa
Response
[
  {
    "id": 1253,
    "name": "Productos",
    "active": true
  }
]
TypeScript

