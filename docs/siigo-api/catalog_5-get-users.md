Usuarios
Este endpoint te permite consultar todos los usuarios registrados. Se utiliza como vendedor en la factura de venta. en Siigo Nube para el manejo de inventarios.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único del usuario o vendedor.
usernamestringNombre o correo de usuario.
first_namestringNombre del usuario.
last_namestringApellido del usuario.
emailstringCorreo del usuario.
activebooleanEstado del usuario.
identificationstringNúmero de identificación del usuario.
¿Como crear usuarios en Siigo Nube?
GET/v1/users
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
pageinteger
Format - int32. Represents the current page of the results that you get. For example, '1'.
Format: "int32"
page_sizeinteger
Format - int32. Represents the number of users that you will get per page. For example, '20'.
Format: "int32"
curl -X GET "https://api.siigo.com/v1/users?page=1&page_size=25" \
  -H "Authorization: <token>"
200
Success
Response
{
  "pagination": {
    "page": 1,
    "page_size": 25,
    "total_results": 250
  },
  "results": [
    {
      "id": 35071,
      "username": "DavidYepes27",
      "first_name": "James David",
      "last_name": "Freeman Smith",
      "email": "[email protected]",
      "active": true,
      "identification": "13832082"
    }
  ]
}
TypeScript

