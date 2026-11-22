Crear Producto
Esta funcionalidad te permite crear un producto/servicio, configurando sus características como se puede ver en los siguientes campos:
NombreTipoDescripciónCaracterísticas
codestringCódigo único del producto.Campo obligatorio, alfanumérico, debe ser único, NO permite espacios, máximo 30 caracteres.
namestringNombre del producto.Campo obligatorio, máximo 100 caracteres, permite caracteres especiales y espacios.
account_groupnumberId de la clasificación de inventario /account-groupsCampo obligatorio, debe estar creado en Siigo Nube y estar activo.
typestringTipo del producto: Product, Service, ComboCampo opcional para identificar el producto, si no se envía toma por defecto "Product". El type "Combo" solo es permitido para usuarios con Siigo Nube Premium.
stock_controlbooleanManejo del control de inventarioCampo booleano opcional, si no se envía por defecto toma "false".
activebooleanEstado del producto en Siigo, valor por default true.Campo tipo booleano, opcional, si no se envía por defecto toma "true".
tax_classificationstringTipo del producto: Taxed, Exempt o ExcludedCampo tipo string, opcional, si no se envía por defecto toma el tipo "taxed".
tax_includedbooleanIVA incluido.Campo tipo booleano, opcional, si no se envía por defecto toma "false".
tax_consumption_valuenumberValor impuesto al consumo.Campo tipo numérico, opcional, máximo maneja 2 decimales, debe ser positivo.
taxes.idnumberIdentificador único del impuestoCampo tipo numérico, opcional, el impuesto debe existir previamente en Siigo Nube.
taxes.millilitersnumberCantidad de mililitrosCampo tipo numérico, obligatorio si maneja un impuesto de bebidas azucaradas.
taxes.ratenumberTarifaCampo tipo numérico, obligatorio si maneja un impuesto de bebidas azucaradas, debe ser: 18, 35, 28, 55, 38, 65.
prices.currency_codestringCódigo de monedaCampo tipo string, opcional, debe existir en Siigo Nube.
prices.price_list.positionnumberIdentificador único de la lista de precioCampo tipo numérico, opcional, debe ser un número entero del 1 al 12.
prices.price_list.valuenumberValor de la lista de precioCampo tipo numérico, opcional, máximo maneja 2 decimales, debe ser positivo.
unitstringCódigo de la unidad de medida del producto para factura electrónica, valor por default 94Campo opcional, debe estar en el listado de unidades de medida de Siigo Nube.
unit_labelstringUnidad de medida para impresión facturaCampo tipo string, opcional, es tipo texto en el PDF de la factura.
referencestringReferencia o código de fábrica del producto o servicioCampo tipo string, opcional, permite espacios, alfanumérico de máximo 80 caracteres.
descriptionstringDescripción del producto o servicioCampo tipo string, opcional, de máximo 2500 caracteres.
barcodestringCódigo de barras.Campo tipo string, opcional, permite espacios, alfanumérico de máximo 50 caracteres.
brandstringMarca.Campo tipo string, opcional, permite espacios, alfanumérico de máximo 50 caracteres.
tariffstringCódigo arancelario.Campo tipo string, opcional, numérico de máximo 10 caracteres.
modelstringModelo.Campo tipo string, opcional, permite espacios, alfanumérico de máximo 50 caracteres.
components.codestringCódigo de componente de un comboCampo tipo string, se utiliza solo para productos de tipo Combo, para indicar el código de un producto existente y activo en Siigo Nube que será componente del combo.
components.quantitynumberCantidad de componente de un comboCampo numérico, para indicar la cantidad de producto que compone el combo.
¿Como crear productos en Siigo Nube?
Aquí encontrarás las Unidades de Medida que puedes utilizar en Siigo API.
Json de ejemplo de creación de una nota crédito a una factura que no este creada en Siigo
{
	"type": "Combo",
	"code": "1234",
	"name": "Combo de prueba",
	"account_group": 121,
	"components": [
		{
			"code": "product-1",
			"quantity": 100
		},
		{
			"code": "product-2",
			"quantity": 20
		}
	]
}
POST/v1/products
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Representa la solicitud con la información del producto.
product_idstring
Representa el Id único del producto, este valor debe ser un Guid con el siguiente formato 00000000-0000-0000-0000-000000000000.
Format: "uuid"
codestring
Representa el código de identificación del producto. Este valor puede ser un código alfanumérico que representará el código de identificación del centro de coste.
Por ejemplo, este nombre puede ser 'Item-1' o 'toy007'.
namestring
Representa el nombre del producto o servicio.
account_groupinteger
Representa el id de la clasificación de inventario.
Format: "int64"
typestring
Representa el tipo de producto. Este producto puede ser de tipo 'Product', 'Service' o 'Consumer Good',
por defecto este campo será 'Product'.
stock_controlboolean
Representa el control de inventario.
Este campo puede ser 'true' o 'false', por defecto este campo será false.
activeboolean
Representa el estado del producto.
Este campo puede ser 'true' o 'false', por defecto este campo será true.
tax_classificationstring
Representa la clasificación de impuestos, este campo puede ser 'Taxed', 'Exempt' o 'Excluded'.
tax_includedboolean
Representa si este producto tiene IVA incluido.
Este campo puede ser 'true' o 'false'.
tax_consumption_valuenumber
Representa el valor del impuesto de consumo.
Format: "double"
taxesarray<object>
Contiene una lista con los ids de los impuestos asociados al producto.
Show Attributes
pricesarray<object>
Contiene una lista con 'lista de precios' del producto. Cada producto puede tener hasta 12 lista de precios.
Show Attributes
unitstring
Representa el id de una unidad de medida, por defecto este campo será 94.
unit_labelstring
Representa la unidad de medida para la impresión de la factura.
referencestring
Representa el código de referencia o de fábrica del producto o servicio.
descriptionstring
Representa la descripción del producto.
additional_fieldsobject
Show Attributes
curl -X POST "https://api.siigo.com/v1/products" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
    "code": "Item-1",
    "name": "Cotton shirt",
    "account_group": 1253,
    "type": "\'Product\'",
    "stock_control": false,
    "active": true,
    "tax_classification": "Taxed",
    "tax_included": false,
    "tax_consumption_value": 0,
    "taxes": [
      {
        "id": 13156
      }
    ],
    "prices": [
      {
        "currency_code": "string",
        "price_list": [
          {
            "position": 1,
            "value": 1069.77
          }
        ]
      }
    ],
    "unit": "94",
    "unit_label": "Unit",
    "reference": "REF1",
    "description": "This is a description",
    "additional_fields": {
      "barcode": "B0123",
      "brand": "Gef",
      "tariff": "string",
      "model": "Loiry"
    }
  }'
201
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

