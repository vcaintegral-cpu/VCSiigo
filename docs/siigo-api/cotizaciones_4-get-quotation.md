Consultar Cotización
Consultar una cotización por su id.
Esta es la información que obtendrás de la factura de venta consultada:
NombreTipoDescripción
idstringIdentificador de la cotización.
document.idnumberIdentificador del comprobante.
numbernumberConsecutivo/número del comprobante.
namestringTipo de Comprobante + Código de Comprobante + Número de Comprobante
datestringFecha de la cotización, formato yyyy-MM-dd.
customer.idstringIdentificador del cliente.
customer.identificationstringNúmero de identificación del cliente.
customer.branch_officestringSucursal, valor por default 0.
cost_centernumberIndica el Centro de costo de la cotización.
currency.codestringCódigo de moneda.
currency.exchange_ratestringTasa / Valor en moneda extranjera.
sellernumberID del vendedor asociado a la cotización.
items.idstringIdentificador del producto/servicio.
items.codestringCódigo único del producto.
items.descriptionstringNombre o descripción del producto/servicio.
items.quantitynumberCantidad.
items.pricenumberPrecio del producto / Valor unitario.
items.discount.percentagenumberPorcentaje de descuento del producto, si lo tuvo.
items.discount.valuenumberValor de descuento del producto, si lo tuvo.
items.taxes.idnumberIdentificador único del impuesto.
items.taxes.namestringNombre del impuesto.
items.taxes.percentagenumberPorcentaje de impuesto del producto.
items.taxes.valuenumberValor de impuesto del producto.
items.taxes.totalnumberTotal del producto, incluye impuestos.
Para visualizar una cotización en Siigo Nube puedes ingresar al ícono de la lupa que corresponde al Buscador, digita el número y oprime en Cotización.
GET/v1/quotations/{quotation_id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
quotation_idRequired
string
Identificador único de la cotización (UUID).
curl -X GET "https://api.siigo.com/v1/quotations/b446fbc3-99c5-4c2d-8a28-1c0d3721ab91" \
  -H "Authorization: <token>"
200
Cotización obtenida exitosamente
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

