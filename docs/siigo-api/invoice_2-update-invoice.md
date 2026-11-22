On this pageEdición de Facturas de venta
Dentro de el manejo de este endpoint es importante tener en cuenta que hay varios campos que no será posible poder modificarlos como por ejemplo el document.id, customer.identification, currency.code, y si dentro de la configuración del documento está como numeración manual el campo de number.
No se podrán editar facturas que estén en proceso de envío a la DIAN o aceptadas (Que tenga CUFE), tampoco facturas que tengan relacionados otros documentos en Siigo Nube (Notas crédito, Notas débito, Recibos de caja, Ajustes de cartera) se deben eliminar primero los documentos relacionados en Siigo Nube.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobante.Campo obligatorio, no se puede modificar y debe existir en Siigo previamente, se puede consultar por: /document-types.
numbernumberConsecutivo/número del comprobanteEl campo es opcional u obligatorio dependiendo la configuración de Siigo Nube, si se envía debe ser el mismo consecutivo de la factura.
customer.identificationstringNúmero de identificación del cliente.Campo obligatorio, no se puede modificar, debe estar activo.
customer.branch_officenumberNúmero de Sucursal del cliente.Campo opcional, si no se envía toma por defecto el 0.
sellernumberIdentificador del vendedor asociado a la factura.Campo obligatorio, debe existir en Siigo Nube, se puede consultar por la ruta: /users.
observationsstringComentarios u observaciones de la factura.Campo opcional, tiene un límite de 4.000 caracteres.
retentionsarrayArray con los ID de los impuestos tipo ReteICA, ReteIVA o Autoretención.Campo opcional, se puede consultar por la ruta: /taxes.
advance_paymentnumberValor de Anticipo o Copago.Campo opcional, numérico de máximo 2 decimales, debe ser positivo y no superar el valor de la factura, debe tener la marcación en la configuración de la factura para enviarlo.
cost_centernumberIdentificador del Centro de costos.Campo opcional, debe existir en Siigo Nube y estar activo.
currency.codestringCódigo de moneda.Campo opcional, no se puede modificar, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
currency.exchange_ratenumberTasa / Valor en moneda extranjera.Campo opcional, debe tener la marcación de manejo de moneda extranjera, si no se envía toma por defecto la moneda local, debe existir en Siigo Nube.
items.codestringCódigo único del producto.Campo obligatorio, debe existir en Siigo Nube y estar activo, alfanumérico.
items.descriptionstringNombre o descripción del producto/servicio.Campo opcional. Si no maneja descripción larga en la configuración y se envía, toma el nombre del producto. Si maneja descripción larga y no se envía, toma la descripción de configuración. Si se envía y está vacío, así aparecerá en la factura.
items.quantitynumberCantidad. En Siigo Nube queda registrado con dos decimales.Campo obligatorio, numérico de máximo 2 decimales.
items.pricenumberPrecio del producto / Valor unitario.Campo obligatorio, numérico de máximo 6 decimales.
items.discountnumberValor de descuento del producto.Campo opcional, puede ser por valor o porcentaje dependiendo de la configuración de la factura.
items.sellernumberIdentificador del vendedor asociado a cada ítem de la factura.Debe tener activo el manejo de vendedor por ítem en la configuración de la factura. Campo obligatorio, debe existir en Siigo Nube, se puede consultar por la ruta: /users.
items.warehousenumberIdentificador de la bodega/almacén asociada al producto.Campo opcional, si se envía debe existir en Siigo Nube y estar activo.
adittional_fieldsarrayCampos adicionales para manejo de orden de compra y entrega para factura electrónica.Campo opcional, alfanumérico, cada campo de prefijo y número es de máximo 20 caracteres, permite caracteres especiales y espacios, debe estar activo el manejo en la configuración de la factura.
payments.idnumberID del medio de pago.Campo obligatorio, debe existir en Siigo Nube y estar activo. Se puede consultar por la ruta: /payment-types. No puedes colocar más de una forma de pago cuando al menos una tenga vencimiento (due_date: true).
payments.valuenumberValor asociado al medio de pago.Campo obligatorio, numérico, máximo 2 decimales.
payments.due_datestringFecha de pago del vencimiento.Obligatorio si el payments.id maneja vencimiento. Formato: yyyy-MM-dd.
¿Como crear facturas no electrónicas en Siigo Nube?
Campos de ingresos para terceros (items.customer)
Para editar una factura con campos de ingresos para terceros, debes seguir los pasos descritos en la sección de ingresos para terceros en creación de facturas.
Campos para empresas del sector transporte (transport)
Para editar una factura con campos del sector transporte, debes seguir los pasos descritos en la sección de campos de transporte en creación de facturas.
Campos para empresas del sector salud (healthcare_company)
Para editar una factura con campos del sector salud, debes seguir los pasos descritos en la sección de campos de salud en creación de facturas.
Campos para facturar productos de obsequio
Para editar una factura con campos de productos de obsequio, debes seguir los pasos descritos en la sección de facturar productos obsequio en creación de facturas.
PUT/v1/invoices/{id}
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Represents the request with the invoice information.
documentobject
Show Attributes
numberinteger
Represents the sequential number of the document,
this number is required depending of document type.
Format: "int64"
namestring
Contains information about document type,
document type Id, and the sequential number of the document.
For example, 'FV-2-22' indicates that its document type is an 'invoice',
its document type id is '2' and its sequential number is '22'.
datestring
Represents the date of the document. This format must be 'yyyy-MM-dd'.
For example, '2021-10-31' to indicate the date 'October 31st, 2021'.
customerobject
Show Attributes
cost_centerinteger
Represents the id of the cost center, the value of this field must be an integer
number that represents the unique id of the cost center.
Format: "int64"
currencyobject
Show Attributes
sellerinteger
Represents the Id of the seller associated with the invoice.
For example, the id '629' can represent a seller called 'Mike'.
Format: "int64"
retentionsarray<object>
Contains a list information about every Retention associated to invoice.
Show Attributes
advance_paymentnumber
Represent the Advance Payment. For example, an advance payment of 33.3 dollars
for a product of 40 dollars.
Format: "double"
observationsstring
Represent additional comments in document.
itemsarray<object>
Contains a list of items associated with the invoice.
Show Attributes
paymentsarray<object>
Contains a list with payments types associated to invoice.
Show Attributes
additional_fieldsobject
Show Attributes
stampobject
Show Attributes
mailobject
Show Attributes
global_chargesarray<object>
Contains information about the global taxes charges associated to document type.
Show Attributes
global_discountsarray<object>
Contains information about the global taxes discounts associated to document type.
Show Attributes
healthcare_companyobject
Campos requeridos en facturación electrónica para empresas del sector salud (Resolución 948).
Show Attributes
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of invoice, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X PUT "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 22
    },
    "number": 25,
    "name": "FV-2-22",
    "date": "2021-10-15",
    "customer": {
      "person_type": "\'Person\'",
      "id_type": "13",
      "identification": "13832081",
      "check_digit": "4",
      "name": [
        "string"
      ],
      "commercial_name": "string",
      "branch_office": 0,
      "active": true,
      "vat_responsible": true,
      "fiscal_responsibilities": [
        {
          "code": "R-99-PN",
          "name": "Not responsible"
        }
      ],
      "address": {
        "address": "Cra. 18 #79A - 42",
        "city": {
          "country_code": "Co",
          "state_code": "19",
          "city_code": "19001"
        },
        "postal_code": "110911"
      },
      "phones": [
        {
          "indicative": "57",
          "number": "3006003345",
          "extension": "132"
        }
      ],
      "contacts": [
        {
          "first_name": "Marcos",
          "last_name": "Castillo",
          "email": "[email protected]",
          "phone": {
            "indicative": "57",
            "number": "3006003345",
            "extension": "132"
          }
        }
      ],
      "comments": "This is an additional comment",
      "related_users": {
        "seller_id": 625,
        "collector_id": 625
      },
      "custom_fields": [
        {
          "key": "YearsOld",
          "value": "29"
        }
      ],
      "type": "string"
    },
    "cost_center": 235,
    "currency": {
      "code": "USD",
      "exchange_rate": 3825.03
    },
    "seller": 629,
    "retentions": [
      {
        "id": 13156
      }
    ],
    "advance_payment": 33.3,
    "observations": "This is an observation",
    "items": [
      {
        "code": "Item-1",
        "description": "This is a description",
        "warehouse": 15,
        "quantity": 2,
        "price": 50,
        "taxed_price": 60,
        "total_price": 60,
        "discount": 13,
        "seller": 629,
        "vat_excluded": false,
        "taxes": [
          {
            "id": 13156
          }
        ]
      }
    ],
    "payments": [
      {
        "id": 5636,
        "value": 1273.03,
        "due_date": "2021-03-19"
      }
    ],
    "additional_fields": {
      "purchase_order": {
        "prefix": "OC",
        "number": "27"
      },
      "delivery_order": {
        "prefix": "OC",
        "number": "27",
        "date": "2021-05-19"
      }
    },
    "stamp": {
      "send": true
    },
    "mail": {
      "send": true
    },
    "global_charges": [
      {
        "id": 13156,
        "percentage": 0
      }
    ],
    "global_discounts": [
      {
        "id": 13156,
        "percentage": 0
      }
    ]
  }'
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 22
  },
  "prefix": "FV",
  "number": 25,
  "name": "FV-2-22",
  "date": "2021-10-10",
  "customer": {
    "id": "302580df-838b-4531-b8bf-dd3c98b34059",
    "identification": "13832081",
    "branch_office": 0
  },
  "cost_center": 235,
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "seller": 629,
  "retentions": [
    {
      "id": 13156,
      "name": "VAT 19%",
      "type": "Retefuente",
      "percentage": 19,
      "value": 5
    }
  ],
  "advance_payment": 33.3,
  "total": 25.5,
  "balance": 30302.24,
  "observations": "This is an observation",
  "items": [
    {
      "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
      "code": "Item-1",
      "quantity": 2,
      "price": 50,
      "seller": 629,
      "description": "This is a description",
      "discount": {
        "percentage": 13,
        "value": 130
      },
      "taxes": [
        {
          "id": 13156,
          "name": "VAT 19%",
          "type": "IVA",
          "percentage": 19,
          "value": 5,
          "base_value": 2000
        }
      ],
      "warehouse": {
        "id": 15,
        "name": "Main Warehouse"
      },
      "total": 119000
    }
  ],
  "global_charges": [
    {
      "id": 0,
      "name": "string",
      "percentage": 0,
      "value": 0
    }
  ],
  "global_discounts": [
    {
      "id": 0,
      "name": "string",
      "percentage": 0,
      "value": 0
    }
  ],
  "payments": [
    {
      "id": 5636,
      "name": "Credit",
      "value": 1273.03,
      "due_date": "2021-03-19"
    }
  ],
  "additional_fields": {
    "purchase_order": {
      "prefix": "OC",
      "number": "27"
    },
    "delivery_order": {
      "prefix": "OE",
      "number": "27",
      "date": "2021-05-19"
    }
  },
  "stamp": {
    "status": "string",
    "cufe": "string",
    "cude": "string",
    "observations": "string",
    "errors": "string"
  },
  "mail": {
    "status": "string",
    "observations": "string"
  },
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  },
  "annulled": true
}
TypeScript

