Crear Grupos de Inventario
Este endpoint te permite editar el nombre y código de categorías de inventarios, la cuál corresponde a la clasificación general de los productos o servicios que se comercializan en la empresa.
Datos que encontrarás en el response:
NombreTipoDescripciónCaracterísticas
codeString, requiredCampo para el código de la categoría de inventario.Campo obligatorio, máximo 10 caracteres alfanuméricos, no se permiten caracteres especiales ni espacios.
nameString, requiredCampo para el nombre de la categoría de inventario.Campo obligatorio, máximo 50 caracteres.
¿Como configurar mis grupos de inventario en Siigo Nube?
PUT/v1/account-groups/{id}
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
Representa la información actualizada del grupo de inventario.
codeRequired
string
Código único de la categoría de inventarios.
nameRequired
string
Nombre de la categoría de inventarios.
Path Parameters
idRequired
integer
Identificador único del grupo de inventario que se desea editar.
curl -X PUT "https://api.siigo.com/v1/account-groups/1253" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "Abc123",
    "name": "Categoría de productos 1"
  }'
201
Grupo de inventario actualizado exitosamente
Response
{
  "id": 1253,
  "name": "Productos",
  "active": true
}
TypeScript

