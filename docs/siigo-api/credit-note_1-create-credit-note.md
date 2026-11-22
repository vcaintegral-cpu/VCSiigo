On this pageCrear Nota Crédito.
Comprobante que permite registrar las devoluciones parciales o totales de una factura de venta.
Este endpoint te permite crear notas crédito.
Campos del JSON:
NombreTipoDescripciónCaracterísticas
document.idstringIdentificador del tipo de nota crédito.Obligatorio, numérico. El ID debe existir en Siigo Nube.
numbernumberConsecutivo/número del comprobante.Opcional. Si se envía, debe ser un consecutivo que no exista aún en Siigo Nube.
datedateFecha de creación de la nota crédito.Obligatorio, formato aaaa/mm/dd. Para notas electrónicas no se puede enviar una fecha anterior a la actual.
invoicestringCódigo del tipo de nota crédito.Opcional. Obligatorio si es electrónica. Debe tener formato correcto de UUID.
items.codestringCódigo único del producto.Obligatorio. Debe existir en Siigo Nube, estar activo y ser alfanumérico.
items.descriptionstringNombre o descripción del producto/servicio.Opcional. Si no se maneja descripción larga y se envía, toma el nombre del producto. Si se maneja descripción larga y no se envía, se toma la configuración del producto.
items.quantitynumberCantidad del producto.Obligatorio, numérico con máximo 2 decimales.
items.pricenumberPrecio del producto / Valor unitario.Obligatorio, numérico con máximo 6 decimales.
items.discountnumberValor del descuento.Opcional. Puede ser por valor o porcentaje según configuración del tipo de factura.
cost_centernumberCentro de costos al cual se contabiliza la nota crédito.Opcional, numérico.
reasonnumberMotivo de rechazo ante la DIAN.Obligatorio para documentos electrónicos. Numérico del 1 al 5.
stampobjectEnvío de la nota crédito electrónica a la DIAN.Opcional. Si se envía "true", se envía automáticamente a la DIAN. Si no se envía, toma por defecto "false".
mailobjectEnvío del documento por correo electrónico al cliente.Opcional. Si se envía "true", se enviará por mail al cliente. Si no se envía, toma por defecto "false".
payments.idnumberID del medio de pago.Obligatorio. Debe existir y estar activo en Siigo Nube. Consultable vía /payment-types.
payments.valuenumberValor del pago.Obligatorio, numérico con máximo 2 decimales.
payments.due_datestringFecha de vencimiento del pago.Obligatorio si el medio de pago (payments.id) maneja vencimiento. Formato: yyyy-MM-dd.
Códigos de Motivo de Rechazo DIAN
CódigoMotivo de Rechazo
1Devolución parcial de los bienes y/o no aceptación parcial del servicio
2Anulación de factura electrónica
3Rebaja o descuento parcial o total
4Ajuste de precio
6Descuento comercial por pronto pago
7Descuento comercial por volumen de ventas
Campos para realizar notas credito para facturas que no existan en Siigo Nube
Los siguientes campos se vuelven obligatorios si deseas crear una nota crédito a una factura de venta que NO existe en Siigo Nube:
NombreTipoDescripciónCaracterísticas
customer.identificationstringNúmero de identificación del cliente.Campo obligatorio si la nota crédito es a una factura que no existe en Siigo Nube. El tercero debe existir en Siigo Nube y estar activo.
customer.branch_officenumberNúmero de Sucursal del cliente.Campo opcional, si no se envía toma por defecto el valor 0.
sellernumberIdentificador del vendedor asociado a la nota crédito.Campo obligatorio si la nota crédito es a una factura que no existe en Siigo Nube. Debe existir en Siigo Nube. Se puede consultar por la ruta: /users.
Adicionalmente, debes enviar un nuevo objeto llamado "invoice_data" el cuál reemplaza al campo "invoice" y debe incluir los siguientes campos:
NombreTipoDescripciónCaracterísticas
datedateFecha de elaboración de la factura.Campo obligatorio, formato de fecha aaaa/mm/dd. La fecha de la factura debe ser menor a la de la nota crédito.
prefixstringPrefijo de la factura.Campo opcional.
numbernumberConsecutivo de la factura.Campo obligatorio si el campo reason tiene el código 2, de lo contrario es opcional.
cufestringCódigo CUFE de la factura.Campo obligatorio si el campo reason tiene el código 2, de lo contrario es opcional. Máximo 200 caracteres.
Json de ejemplo de creación de una nota crédito a una factura que no este creada en Siigo
{
	"document": {
		"id": 2379
	},
	"date": "2024-05-24",
	"reason": "2",
	"customer": {
		"identification": "28211179",
		"branch_office": "0"
	},
	"seller": 62,
	"invoice_data": {
		"date": "2024-03-20",
		"prefix": "FV",
		"number": "458",
		"cufe": "302580df-838b-4531-b8bf-dd3c9hasdfu8e5"
	},
	"items": [
		{
			"code": "Code-1",
			"description": "Producto de prueba",
			"quantity": "1",
			"price": 2000
		}
	],
	"payments": [
		{
			"id": "542",
			"value": 2000
		}
	]
}
Campos para empresas del sector salud (healthcare_company)
A partir del 22 de Julio de 2025, se podrán enviar distintos tipos de operación para las facturas de venta y notas crédito del sector salud. Permite enviar los campos requeridos en notas electrónicas para empresas del sector salud, detalle de los campos:
NombreTipoDescripciónCaracterísticas
healthcare_company.operation_typestringTipo de operaciónCampo obligatorio para facturas del sector salud. Puede contener los valores SS-CUFE, SS-SinAporte o SS-Recaudo.
healthcare_company.period_startdatePeriodo de facturación inicioCampo obligatorio si el tipo de operación es SS-CUFE o SS-SinAporte. Debe ir en formato AAAA-MM-DD.
healthcare_company.period_enddatePeriodo de facturación finalCampo obligatorio si el tipo de operación es SS-CUFE o SS-SinAporte. Debe ir en formato AAAA-MM-DD.
healthcare_company.payment_methodstringModalidad de pagoCampo opcional, solo se usa en operaciones de tipo SS-CUFE o SS-SinAporte. Debe enviar el ID válido del listado de valores que se encuentra en la parte inferior.
healthcare_company.service_planstringCobertura - Plan serviciosCampo opcional, solo se usa en operaciones de tipo SS-CUFE o SS-SinAporte. Debe enviar el ID válido del listado de valores que se encuentra en la parte inferior.
healthcare_company.policy_numberstringNúmero de pólizaCampo opcional, solo se usa en operaciones de tipo SS-CUFE o SS-SinAporte. Alfanumérico, de máximo 50 caracteres.
healthcare_company.contract_numberstringNúmero de contratoCampo opcional, solo se usa en operaciones de tipo SS-CUFE o SS-SinAporte. Alfanumérico, permite caracteres especiales, de máximo 64 caracteres. Si se envía este campo no se puede enviar policy_number ni non_contract_invoice_reason.
healthcare_company.copaymentnumberCopagoCampo opcional, solo se usa en operaciones de tipo SS-CUFE. Numérico de 12 dígitos (10 enteros y 2 decimales), valor positivo, sin símbolos ni separadores de miles, punto como separador decimal.
healthcare_company.coinsurancenumberCuota moderadoraCampo opcional, solo se usa en operaciones de tipo SS-CUFE. Numérico de 12 dígitos (10 enteros y 2 decimales), valor positivo, sin símbolos ni separadores de miles, punto como separador decimal.
healthcare_company.cost_sharingnumberPagos compartidosCampo opcional, solo se usa en operaciones de tipo SS-CUFE. Numérico de 12 dígitos (10 enteros y 2 decimales), valor positivo, sin símbolos ni separadores de miles, punto como separador decimal.
healthcare_company.recovery_chargenumberCuota de recuperaciónCampo opcional, solo se usa en operaciones de tipo SS-CUFE. Numérico de 12 dígitos (10 enteros y 2 decimales), valor positivo, sin símbolos ni separadores de miles, punto como separador decimal.
healthcare_company.non_contract_invoice_reasonstringMotivo de factura sin contratoCampo opcional, solo se usa en operaciones de tipo SS-CUFE o SS-SinAporte. Obligatorio si no se envía contract_number. Si se envía, no se puede enviar contract_number. ID del listado de valores.
Para las facturas de venta con el tipo de operación SS-CUFE se debe enviar al menos uno de los 4 campos de recaudo diligenciados (copayment, coinsurance, cost_sharing, recovery_charge).
Listado de valores del campo "payment_method":
NúmeroDescripción
01Pago individual por caso, conjunto integral de atenciones, paquete o canasta.
02Pago global prospectivo.
03Pago por capitación.
04Pago por evento.
Listado de valores del campo "service_plan":
NúmeroDescripción
02Presupuesto máximo
03Prima EPS / EOC, no asegurados SOAT
04Cobertura Póliza SOAT
05Cobertura ARL
06Cobertura ADRES
07Cobertura Salud Pública
08Cobertura entidad territorial, recursos de oferta
09Urgencias población migrante
10Plan complementario en salud
11Plan medicina prepagada
12Otras pólizas en salud
13Cobertura Régimen Especial o Excepción
14Cobertura Fondo Nacional de Salud de las Personas Privadas de la Libertad
15Particular
16Plan de beneficios en salud financiado con UPC Régimen Contributivo
17Plan de beneficios en salud financiado con UPC Régimen Subsidiado
Listado de valores del campo "non_contract_invoice_reason":
NúmeroDescripción
01Atención de urgencias.
02Atención a cargo de ADRES, Aseguradoras SOAT, Planes voluntarios de Salud.
03Atención en salud por fallos de tutela/órdenes judiciales.
04Atención en salud por Portabilidad o en los casos de asignación masiva de afiliados - artículo 2.5.3.4.7.9 del Decreto 780/2016.
05Atención en salud en casos excepcionales por cotizaciones o autorizaciones sin contrato.
06Gestión recuperación de órganos para trasplante.
07Profesionales independientes en atención a paciente particular
Json de ejemplo de campos del sector salud para el tipo SS-CUFE
{
	"healthcare_company": {
		"operation_type": "SS-CUFE",
		"period_start": "2024-02-14",
		"period_end": "2024-03-16",
		"payment_method": "04",
		"service_plan": "16",
		"contract_number": "CON1245636",
		"copayment": 22505.20,
		"coinsurance": 10805.20,
		"cost_sharing": 10500.00,
		"recovery_charge": 85236.43
	}
}
Json de ejemplo de campos del sector salud para el tipo SS-SinAporte
{
	"healthcare_company": {
		"operation_type": "SS-SinAporte",
		"period_start": "2024-02-14",
		"period_end": "2024-03-16",
		"payment_method": "04",
		"service_plan": "16",
		"policy_number": "ZAS321456677",
		"non_contract_invoice_reason": "03"
	}
}
Json de ejemplo de campos del sector salud para el tipo SS-Recaudo
{
	"healthcare_company": {
		"operation_type": "SS-Recaudo"
	}
}
Notas crédito con productos de obsequio
Para realizar notas crédito de facturas con items con valor en 0, se debe aclarar ante la DIAN cual es el valor real del item y quien asume el IVA de este producto si al empresa o el cliente.
Para esto se agregaron los siguientes campos:
NombreTipoDescripciónCaracterísticas
items.tax_basenumberPrecio base para el calculo del IVACampo obligatorio si se envía el campo items.price en 0, el valor debe ser mayor a 0, máximo 11 enteros y 2 decimales.
items.taxpayerstringIndica quién asume el IVA del producto facturado en 0Campo obligatorio si se envía el campo items.price en 0, solo admite los valores "Customer" o "Company".
Json de ejemplo de un item con valor en 0 de obsequio
 "items": [
    {
    "code": "1",
    "description": "Alquiler",
    "quantity": 2,
    "price": 0,
    "tax_base": 1000,
    "taxpayer": "Company",
   "taxes": [
            {
                "id": 31779
            }
        ]
    }
]
POST/v1/credit-notes
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Represents the request with the credit note information.
documentRequired
object
Show Attributes
numberinteger
Representa el número secuencial del documento, este número es requerido dependiendo del tipo de documento.
Format: "int64"
namestring
Representa información sobre el tipo de documento, el ID del tipo de documento y el número secuencial del documento. Por ejemplo, 'NC-2-22' indica que su tipo de documento es una 'nota de crédito', su ID de tipo de documento es '2' y su número secuencial es '22'.
dateRequired
string
Representa la fecha del documento. Este formato debe ser 'aaaa-MM-dd', por ejemplo, '2021-10-31' para indicar la fecha '31 de octubre de 2021'.
invoicestring
Representa el GUID de la factura a la que se aplicó la nota de crédito.
reasonRequired
integer
Format: "int32"Value in: 1 | 2 | 3 | 4 | 5 | 6
sellerinteger
Representa el ID del vendedor asociado a la factura, por ejemplo, el ID '629' puede representar a un vendedor llamado 'Micke'.
Format: "int64"
cost_centerinteger
Representa el ID del centro de costos, el valor de este campo debe ser un número entero que representa el ID único del centro de costos.
Format: "int64"
currencyobject
Show Attributes
retentionsarray<object>
Contiene una lista de información sobre cada retención asociada a la factura.
Show Attributes
advance_paymentnumber
Representa el Pago Anticipado. Por ejemplo, un pago anticipado de 33.3 dólares para un producto de 40 dólares.
Format: "double"
observationsstring
Representa comentarios adicionales en el documento.
itemsarray<object>
Contiene una lista con los ítems asociados a la factura.
Show Attributes
paymentsRequired
array<object>
Contiene una lista con los tipos de pago asociados a la factura.
Show Attributes
healthcare_companyobject
Campos requeridos en facturación electrónica para empresas del sector salud (Resolución 948).
Show Attributes
curl -X POST "https://api.siigo.com/v1/credit-notes" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "id": 22
    },
    "number": 25,
    "name": "NC-2-22",
    "date": "2021-10-15",
    "invoice": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
    "reason": 1,
    "seller": 629,
    "cost_center": 235,
    "currency": {
      "code": "USD",
      "exchange_rate": 3825.03
    },
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
    ]
  }'
201
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 22
  },
  "number": 25,
  "name": "NC-2-22",
  "date": "2021-10-15",
  "invoice": {
    "id": "302580df-838b-4531-b8bf-dd3c98b34059",
    "name": "FV-2-20"
  },
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
  "payments": [
    {
      "id": 5636,
      "name": "Credit",
      "value": 1273.03,
      "due_date": "2021-03-19"
    }
  ],
  "stamp": {
    "status": "string",
    "cufe": "string",
    "cude": "string",
    "observations": "string",
    "errors": "string"
  },
  "metadata": {
    "created": "string",
    "last_updated": "string",
    "stock_updated": "string"
  }
}
TypeScript

