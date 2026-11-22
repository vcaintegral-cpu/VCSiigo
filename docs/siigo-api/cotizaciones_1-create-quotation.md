Crear Cotización
Crear una nueva cotización teniendo en cuenta que el cliente o tercero, y los productos ya se encuentren creados en Siigo Nube.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, debe existir en Siigo previamente, se puede consultar por: /document-types.
datedateFecha de comprobante.Campo obligatorio.
numbernumberConsecutivo/número del comprobanteCampo opcional, se hace obligatorio si se tiene marcada numeración manual. Si se envía debe ser un consecutivo que no exista en Nube.
customer.identificationstringNúmero de identificación del cliente.Campo obligatorio, debe existir en Siigo Nube y estar activo.
customer.branch_officenumberNúmero de Sucursal del cliente.Campo opcional, si no se envía toma por defecto el 0.
sellernumberIdentificador del vendedor asociado a la cotización.Campo obligatorio, debe existir en Siigo Nube, se puede consultar por: /users.
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
currency.codestringCódigo de moneda.Campo opcional, debe tener la marcación de manejo de moneda extranjera. Si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, obligatorio si se envía el objeto currency.
items.codestringCódigo único del producto.Campo obligatorio, debe existir en Siigo Nube y estar activo, alfanumérico.
items.descriptionstringNombre o descripción del producto/servicio.Campo opcional, si no se maneja descripción larga en la configuración se toma el nombre del producto. Si se envía vacío, se usa tal cual en la cotización.
items.quantitynumberCantidad a cotizar del ítemCampo obligatorio, numérico, solo se permiten 2 decimales, valor máximo 9999999.99
items.pricenumberPrecio del producto / Valor unitarioCampo obligatorio, numérico, máximo 6 decimales, valor máximo 99999999999.99
items.discountnumberValor de descuento del productoCampo opcional, puede ser por valor o porcentaje dependiendo de la configuración de la cotización.
items.taxes.idnumberIdentificador único del impuestoCampo opcional, numérico sin decimales, corresponde al ID del impuesto, se puede consultar por: /taxes. No se permiten dos impuestos del mismo tipo en un ítem.
POST/v1/quotations
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
Representa la solicitud con la información de cotización.
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
curl -X POST "https://api.siigo.com/v1/quotations" \
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
201
Quotation created successfully
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

