Crear Grupos de Inventario
Este endpoint te permite consultar la clasificación de inventarios, la cuál corresponde a la clasificación general de los productos o servicios que se comercializan en la empresa y que se debe configurar previamente en Siigo Nube.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberId de la clasificación de inventario, este dato lo necesitarás para crear posteriormente un producto o servicio.
namestringNombre de la clasificación de inventario.
activebooleanIndica si la clasificación de inventario está en uso.
¿Como configurar mis grupos de inventario en Siigo Nube?
POST/v1/account-groups
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
Representa la información del nuevo grupo de inventario.
codeRequired
string
Código único de la categoría de inventarios.
nameRequired
string
Nombre de la categoría de inventarios.
curl -X POST "https://api.siigo.com/v1/account-groups" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "Abc123",
    "name": "Categoría de productos 1"
  }'
201
Grupo de inventario creado exitosamente
Response
{
  "id": 1253,
  "name": "Productos",
  "active": true
}
TypeScript

