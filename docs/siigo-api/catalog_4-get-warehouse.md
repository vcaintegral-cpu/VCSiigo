Bodegas
Este endpoint te permite consultar todas las bodegas creadas en Siigo Nube para el manejo de inventarios.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único de la bodega.
namestringNombre de la bodega.
activebooleanIndica si la bodega está en uso.
has_movementsbooleanIndica si la bodega tiene movimientos.
¿Como crear bodegas en Siigo Nube?
GET/v1/warehouses
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/warehouses" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 1270,
    "name": "Main Warehouse",
    "active": true,
    "has_movements": false
  }
]
TypeScript

