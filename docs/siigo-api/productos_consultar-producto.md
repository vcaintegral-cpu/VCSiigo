Consultar Producto
Consultar un producto o servicio único por su id
NombreTipoDescripción
idStringIdentificador del producto.
codeStringCódigo único para identificar el producto.
nameStringNombre del producto / servicio.
account_group.idnumberIdentificador único de la clasificación de inventario.
account_group.nameStringNombre de la clasificación de inventario.
type.productStringSe identifica el tipo de producto, puede ser: Product, service o ConsumerGood.
stock_controlbooleanControl de inventario, valor por default false.
activebooleanEstado del producto en Siigo, valor por default true.
tax_classificationstringIndica si el producto es Gravado, exento o excluido.
tax_includedbooleanIndica si el producto maneja IVA incluido o no, no es obligatorio.
tax_consumption_valuenumberValor impuesto al consumo.
taxes.idnumberIdentificador único del impuesto.
taxes.namestringNombre del impuesto.
taxes.typestringTipo del impuesto, ejemplo: IVA
taxes.percentagenumberIndica el número de porcentaje de los impuestos.
prices.currency_codestringCódigo de moneda, por ejemeplo: COP
prices.price_list.positionnumberIdentificador único de la lista de precio.
prices.price_list.namestringNombre de la lista de precio.
prices.price_list.valuestringValor de la lista de precio.
unit.codestringCódigo de la unidad de medida, por ejemplo: 94
unit.namestringNombre de la unidad de medida, por ejemplo: Unidad
unit_labelstringUnidad de medida para impresión factura.
referencestringReferencia o código de fábrica del producto o servicio.
descriptionstringDescripción del producto o servicio.
barcodestringCódigo de barras.
brandstringMarca del producto.
tariffstringCódigo arancelario.
modelstringModelo.
available_quantitynumberIndica la cantidad disponible en el inventario. Si el producto se encuentra distribuido en múltiples bodegas, este atributo retorna la cantidad disponible en todas las bodegas.
warehouses.idnumberIdentificador único de la bodega.
warehouses.namestringNombre de la bodega.
warehouses.quantitystringCantidad disponible.
createdstringLa fecha en la que se creó el producto.
last_updatedstringLa fecha en la que se actualizó el producto por última vez.
Para los productos de tipo "Combo" se retornará el array "components" con el id, code y name de los componentes del combo
¿Como consultar productos en Siigo Nube?
GET/v1/products/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Formato - uuid. Representa el Id único del producto, este valor debe ser un Guid con el siguiente formato 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/products/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "string",
  "code": "string",
  "name": "string",
  "account_group": {
    "id": 0,
    "name": "string"
  },
  "type": "string",
  "stock_control": true,
  "active": true,
  "tax_classification": "string",
  "tax_included": true,
  "tax_consumption_value": 0,
  "taxes": [
    {
      "id": 0,
      "name": "string",
      "type": "string",
      "percentage": 0
    }
  ],
  "prices": [
    {
      "currency_code": "string",
      "price_list": [
        {
          "position": 0,
          "name": "string",
          "value": 0
        }
      ]
    }
  ],
  "unit": {
    "code": "string",
    "name": "string"
  },
  "unit_label": "string",
  "reference": "string",
  "description": "string",
  "additional_fields": {
    "barcode": "string",
    "brand": "string",
    "tariff": "string",
    "model": "string"
  },
  "available_quantity": 0,
  "warehouses": [
    {
      "id": 0,
      "name": "string",
      "quantity": 0
    }
  ],
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript

