Activos Fijos
Este endpoint te permite consultar todos los activos fijos creados en Siigo Nube. Se utilizan en los comprobantes contable para subir saldos o modificar los activos fijos.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único del activo fijo.
namestringNombre del Activo fijo.
groupstringNombre del grupo de activo fijo.
activebooleanIndica si el activo fijo está en uso.
¿Como crear activos fijos en Siigo Nube?
GET/v1/fixed-assets
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/fixed-assets" \
  -H "Authorization: <token>"
200
Success
Response
[
  {
    "id": 13156,
    "name": "Personal Computer",
    "group": "fixed assets of the office",
    "active": true
  }
]
TypeScript

