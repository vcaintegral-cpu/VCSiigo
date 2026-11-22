Editar Cotización
Esta funcionalidad te permite editar un productoo servicio, configurando sus características como se puede ver en los siguientes campos:
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, no es editable, debe ser el mismo de la cotización original.
datedateFecha de comprobante.Campo obligatorio.
numbernumberConsecutivo/número del comprobanteOpcional, obligatorio si numeración manual; si se envía debe ser el mismo consecutivo, no editable.
customer.identificationstringNúmero de identificación del cliente.Campo obligatorio, debe ser el mismo de la cotización original, no editable.
customer.branch_officenumberNúmero de Sucursal del cliente.Campo opcional, si no se envía toma por defecto el 0.
sellernumberIdentificador del vendedor asociado a la cotización.Campo obligatorio, debe existir en Siigo Nube, se puede consultar por la ruta: /users.
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
currency.codestringCódigo de moneda.Campo opcional, debe tener la marcación de manejo de moneda extranjera; si no se envía toma por defecto la moneda local, no editable.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, obligatorio si se envía el objeto currency.
items.codestringCódigo único del producto.Campo obligatorio, debe existir en Siigo Nube y estar activo, alfanumérico.
items.descriptionstringNombre o descripción del producto/servicio.Campo opcional; si no maneja descripción larga y se envía toma el nombre del producto. Si maneja descripción larga y no se envía, se toma de la configuración del producto.
items.quantitynumberCantidad a cotizar del itemCampo obligatorio, numérico, solo se pueden usar 2 decimales, valor máximo 9,999,999.99.
items.pricenumberPrecio del producto / Valor unitarioCampo obligatorio, numérico, máximo 6 decimales, valor máximo 99,999,999,999.99.
items.discountnumberValor de descuento del productoCampo opcional, puede ser por valor o porcentaje dependiendo de la configuración de la cotización.
items.taxes.idnumberIdentificador único del impuestoCampo opcional, numérico sin decimales; corresponde al identificador del impuesto, se puede consultar por la ruta: /taxes; no se permiten dos impuestos del mismo tipo en un ítem.
PUT/v1/quotations/{id}
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
Representa la solicitud con la información actualizada de la cotización.
documentRequired
object
Show Attributes
dateRequired
string
Format: "date"
customerRequired
object
Show Attributes
cost_centernumber
currencyobject
Show Attributes
sellerRequired
number
itemsRequired
array<object>
Show Attributes
Path Parameters
idRequired
string
Identificador de la cotización a editar
curl -X PUT "https://api.siigo.com/v1/quotations/string" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 24446
    },
    "date": "2025-09-15",
    "customer": {
      "identification": "13832081",
      "branch_office": 0
    },
    "cost_center": 235,
    "currency": {
      "code": "USD",
      "exchange_rate": 3825.03
    },
    "seller": 629,
    "items": [
      {
        "code": "Item-1",
        "description": "Camiseta de algodón",
        "quantity": 1,
        "price": 1069.77,
        "taxes": [
          {
            "id": 13156
          }
        ],
        "discount": 0
      }
    ]
  }'
200
Cotización actualizada exitosamente
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 24446
  },
  "number": 22,
  "name": "C-1-22",
  "date": "2023-12-15",
  "customer": {
    "id": "6b6ceb28-b2eb-4b98-b3dd-26648a933c81",
    "identification": "13832081",
    "branch_office": 0
  },
  "cost_center": 235,
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "total": 2546.05,
  "seller": 629,
  "items": [
    {
      "id": "63f918c2-ca65-4edc-a7db-66bcdd5159ps",
      "code": "Item-1",
      "description": "Camiseta de algodón",
      "quantity": 2,
      "price": 1069.77,
      "discount": {
        "percentage": 13,
        "value": 130
      },
      "taxes": [
        {
          "id": 13156,
          "name": "IVA 19%",
          "type": "IVA",
          "percentage": 19,
          "value": 406.51
        }
      ],
      "total": 2546.05
    }
  ],
  "public_url": "https://publicview.siigo.com/document?data=MS4ruap0JuOL8dao3oKEMa",
  "metadata": {
    "created": "2020-06-15T03:33:17.208Z",
    "last_updated": "null"
  }
}
TypeScript

