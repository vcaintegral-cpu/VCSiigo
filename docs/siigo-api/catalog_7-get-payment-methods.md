Formas de Pago
Este endpoint te permite consultar todos las formas de pago creadas en Siigo Nube. Se utilizan para identificar la forma de pago en los comprobantes de Factura de venta, recibos de caja y notas crédito.
Datos que encontrarás en el response:
NombreTipoDescripción
idnumberIdentificador único de la forma de pago.
namestringNombre de la forma de pago.
typestringTipo de forma de pago: Puede ser de Cartera, proveedor o cartera/proveedor.
activebooleanEstado de la forma de pago.
due_datebooleanIndica si la forma de pago maneja fecha de vencimiento.
¿Como crear formas de pago en Siigo Nube?
GET/v1/payment-types
Query
Authorization
Authorization<token>
Partner-Id<token>
Query Parameters
document_typeRequired
string
Representa el tipo de documento (por ejemplo, 'FV' para facturas, 'NC' para notas crédito).
curl -X GET "https://api.siigo.com/v1/payment-types?document_type=FV" \
  -H "Authorization: <token>"
200
Consulta exitosa. Devuelve una lista de formas de pago.
Response
[
  {
    "id": 5636,
    "name": "Crédito",
    "type": "Cartera",
    "active": true,
    "due_date": true
  }
]
TypeScript

