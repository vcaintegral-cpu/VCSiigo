On this pageCrear Factura.
Crear una nueva factura de venta teniendo en cuenta que el cliente o tercero ya está creado en la base de datos de Siigo Nube.
NombreTipoDescripciónCaracterísticas
document.idnumberIdentificador del tipo de comprobanteCampo obligatorio, debe existir en Siigo previamente. Consultar: /document-types
datedateFecha de comprobanteCampo obligatorio. Para facturas electrónicas NO puede ser anterior a la fecha actual.
numbernumberConsecutivo/número del comprobanteCampo opcional. Si se envía, debe ser un consecutivo que no exista en Nube.
customer.identificationstringNúmero de identificación del clienteCampo obligatorio. Debe existir y estar activo en Siigo Nube.
customer.branch_officenumberNúmero de sucursal del clienteCampo opcional. Por defecto se usa 0 si no se envía.
sellernumberID del vendedor asociado a la facturaCampo obligatorio. Debe existir en Siigo Nube. Consultar: /users
stampobjectEnvío de factura electrónica a la DIANCampo opcional. Si se envía como true, se envía a la DIAN. Por defecto es false.
mailobjectEnvío del documento por correo electrónico al clienteCampo opcional. Si se envía como true, se envía por correo. Por defecto es false.
observationsstringObservaciones o comentarios de la facturaCampo opcional. Máximo 4.000 caracteres.
retentionsarrayIDs de impuestos tipo ReteICA, ReteIVA o AutoretenciónCampo opcional. Consultar: /taxes
advance_paymentnumberValor de anticipo o copagoCampo opcional. Numérico, máximo 2 decimales. Debe ser positivo y no superar el valor total de la factura.
cost_centernumberID del centro de costosCampo opcional. Debe existir y estar activo en Siigo Nube.
currency.codestringCódigo de monedaCampo opcional. Requiere configuración de moneda extranjera. Por defecto se usa la moneda local.
currency.exchange_ratenumberTasa o valor en moneda extranjeraCampo opcional. Igual que currency.code, debe estar configurado en Siigo Nube.
items.codestringCódigo único del productoCampo obligatorio. Debe existir y estar activo en Siigo Nube.
items.descriptionstringDescripción del producto/servicioCampo opcional. Comportamiento depende de configuración en Siigo Nube.
items.quantitynumberCantidad del productoCampo obligatorio. Numérico, máximo 2 decimales.
items.pricenumberPrecio unitario del productoCampo obligatorio. Numérico, máximo 6 decimales.
items.discountnumberDescuento aplicado al productoCampo opcional. Puede ser por valor o porcentaje.
items.sellernumberID del vendedor por ítemCampo obligatorio si se tiene activa esta configuración. Debe existir en Siigo Nube. Consultar: /users
items.warehousenumberID de la bodega asociadaCampo opcional. Debe existir y estar activa en Siigo Nube si se envía.
items.taxes.idnumberID del impuestoCampo opcional. No se permiten dos impuestos del mismo tipo por ítem. Consultar: /taxes
items.taxed_pricenumberPrecio con IVA incluidoCampo opcional. Si se envía, reemplaza items.price.
adittional_fieldsarrayCampos adicionales para orden de compra y entregaCampo opcional. Alfanumérico, máximo 20 caracteres por campo, permite caracteres especiales.
payments.idnumberID del medio de pagoCampo obligatorio. Debe existir y estar activo en Siigo Nube. Consultar: /payment-types. Solo se permite un medio con vencimiento (due_date: true).
payments.valuenumberValor del medio de pagoCampo obligatorio. Numérico, máximo 2 decimales.
payments.due_datestringFecha de vencimiento del pagoCampo obligatorio si el medio de pago maneja vencimiento. Formato: yyyy-MM-dd.
global_discounts.idnumberID del descuento globalCampo opcional. Debe existir y estar activo en Siigo Nube.
global_discounts.percentagenumberPorcentaje del descuento globalCampo opcional. Entre 0.01 y 99.99. Máximo 2 decimales.
global_discounts.valuenumberValor del descuento globalCampo opcional. Si se envía junto con el porcentaje, se tomará el porcentaje.
¿Como crear facturas no electrónicas en Siigo Nube?
Creación de un cliente desde la factura de venta:
Para facilitar el proceso de facturación, se puede crear el cliente desde la misma petición de la factura de venta.
NombreTipoDescripciónCaracterísticas
person_typeString, requiredIdentifica si el tercero es "person" o "company".Campo obligatorio, solo se puede enviar "person" o "company".
id_typestring, requiredCódigo del tipo de documento.Campo obligatorio, las opciones se encuentran en el listado siguiente a este apartado. Ejemplo: 13 para cédula, 31 para NIT.
identificationStringNúmero de identificación del cliente.Campo obligatorio, no permite carácteres especiales, máximo 50 carácteres, solo permite un número de identificación existente en Nube si es un nuevo número de sucursal.
branch_officenumberSucursal, valor por default 0.Campo opcional, solo recibe números enteros del 0 al 999.
nameString, requiredRazón social o nombres y apellidos del cliente.Campo obligatorio, no permite carácteres especiales. Company es un solo campo, en el array de Person son 2 campos. Máximo 100 carácteres por campo.
address.addressstring, requiredDirección del cliente.Campo obligatorio, alfanumérico, permite espacios, máximo 256 carácteres.
address.city.country_codestring, requiredCódigo del país.Se debe consultar en Siigo Nube: Reportes > Carteras/Proveedores > Reportes de sistema > Países-Departamentos-Ciudades. Ejemplo: "CO" para Colombia.
address.city.state_codestring, requiredCódigo del departamento/estado.Se consulta en la misma ruta que country_code. Ejemplo: "11" para Bogotá D.C. (Colombia).
address.city.city_codestring, requiredCódigo de la ciudad.Se consulta en la misma ruta. Ejemplo: "11001" para Bogotá (Colombia).
phones.indicativestringIndicativo del número de contacto.Campo opcional, numérico, no permite espacios ni carácteres especiales, máximo 10 carácteres.
phones.numberstringNúmero de contacto.Campo opcional, numérico, no permite espacios ni carácteres especiales, máximo 10 carácteres.
phones.extensionstringExtensión del número de contacto.Campo opcional, numérico, no permite espacios ni carácteres especiales, máximo 10 carácteres.
contacts.first_namestring, requiredNombres del contacto.Campo obligatorio, permite espacios y carácteres especiales, alfanumérico, máximo 50 carácteres.
contacts.last_namestringApellidos del contacto.Campo opcional, permite espacios y carácteres especiales, alfanumérico, máximo 50 carácteres.
contacts.emailstringCorreo del contacto.Campo opcional, NO permite espacios ni carácteres especiales, alfanumérico, máximo 100 carácteres.
Json del objeto de customer para su creación desde la factura de venta:
{
	"customer": {
		"person_type": "Person",
		"id_type": "13",
		"identification": "209048401",
		"branch_office": "0",
		"name": ["Manuel", "Camacho"],
		"address": {
			"address": "Cra. 18 #79A - 42",
			"city": {
				"country_code": "Co",
				"state_code": "11",
				"city_code": "11001"
			}
		},
		"phones": [
			{
				"number": "3006003344"
			}
		],
		"contacts": [
			{
				"first_name": "Manuel",
				"last_name": "Camacho",
				"email": "[email protected]"
			}
		]
	}
}
Campos adicionales (adittional_fields)
Permite enviar los campos orden de compra y orden de entrega.
purchase_order: Campo de orden de compra.
delivery_order: Campo de orden de entrega.
    "additional_fields": {
          "purchase_order": {
              "prefix": "OC",
              "number": "23"
          },
          "delivery_order": {
              "prefix": "OE",
              "number": "23",
              "date": "2021-05-19"
          }
      }
Ingresos para terceros (items.customer)
Para manejar terceros por item en facturas de venta, primero se debe tener activa la marcación en el tipo de documento que se puede consultar en: /document-types FV.
Para recibir el campo se debe tener en el tipo de documento el campo "customer_by_item": true
Se debe añadir un objeto en el array de items donde incluya la identificación del tercero que se quiere relacionar a este ítem:
Campos para Terceros por Ítem
NombreTipoDescripción
items.customer.identificationstringOpcional. Número de identificación del tercero del ítem. Si no se envía, se usa el customer principal de la factura. No es modificable y el tercero debe estar activo.
items.customer.branch_officenumberOpcional. Número de sucursal del tercero (valor por defecto: 0). Solo acepta números enteros entre 0 y 999.
Json de ejemplo de un item con ingresos para terceros
{
	"customer": {
		"person_type": "Person",
		"id_type": "13",
		"identification": "209048401",
		"branch_office": "0",
		"name": ["Manuel", "Camacho"],
		"address": {
			"address": "Cra. 18 #79A - 42",
			"city": {
				"country_code": "Co",
				"state_code": "11",
				"city_code": "11001"
			}
		},
		"phones": [
			{
				"number": "3006003344"
			}
		],
		"contacts": [
			{
				"first_name": "Manuel",
				"last_name": "Camacho",
				"email": "[email protected]"
			}
		]
	}
}
Facturar productos de obsequio
Para facturar items con valor en 0, se debe aclarar ante la DIAN cual es el valor real del item y quien asume el IVA de este producto si al empresa o el cliente.
Para esto se agregaron los siguientes campos:
NombreTipoDescripciónCaracterísticas
items.tax_basenumberPrecio base para el cálculo del IVACampo obligatorio si se envía el campo items.price en 0. El valor debe ser mayor a 0, con máximo 11 enteros y 2 decimales.
items.taxpayerstringIndica quién asume el IVA del producto facturado en 0Campo obligatorio si se envía el campo items.price en 0. Solo admite los valores "Customer" o "Company".
Json de ejemplo de un item con valor en 0 de obsequio:
{
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
}
Campos para empresas de transporte (transport)
Permite enviar los campos requeridos en facturación electronica para empresas de transporte, detalle de los campos:
NombreTipoDescripciónCaracterísticas
items.transport.file_numbernumberNúmero de radicadoCampo opcional (aplica para empresas de transporte de carga). Debe ser numérico entre 1 y 100.000.000.000.
items.transport.shipment_numberstringNúmero de remesaCampo opcional (aplica para empresas de transporte de carga). Alfanumérico. Permite espacios, guion medio (-), guion bajo (_), slash (/), y coma (,). Máximo 15 caracteres.
items.transport.transported_quantitynumberCantidad transportadaCampo opcional (aplica para empresas de transporte de carga). Numérico, sin decimales. Límite de 8 caracteres.
items.transport.measurement_unitstringUnidad de medidaCampo opcional (aplica para empresas de transporte de carga). Solo permite los valores: "GLL" (Galón) y "KGM" (Kilogramo).
items.transport.freight_valuenumberValor FleteCampo opcional (aplica para empresas de transporte de carga). Numérico, sin decimales. Límite de 12 caracteres.
items.transport.purchase_orderstringOrden de compraCampo opcional (aplica para empresas de transporte de carga). Alfanumérico. Límite de 50 caracteres.
items.transport.service_typestringTipo de servicioCampo opcional (aplica para empresas de transporte de carga). Puede tomar dos valores: "AdditionalService" (servicio adicional) y "Shipment" (remesa de transporte en el RNDC).
Json de ejemplo de un item con campos de transporte:
{
	"items": [
		{
			"code": "Item-1",
			"quantity": 1,
			"price": 1069.77,
			"taxes": [
				{
					"id": 13156
				}
			],
			"transport": {
				"file_number": 536,
				"shipment_number": "RM-145",
				"transported_quantity": 120,
				"measurement_unit": "KGM",
				"freight_value": 220000,
				"purchase_order": "OC-236",
				"service_type": "AdditionalService"
			}
		}
	]
}
Campos para empresas del sector salud (healthcare_company)
A partir del 22 de Julio de 2025, se podrán enviar distintos tipos de operación para las facturas de venta y notas crédito del sector salud. Permite enviar los campos requeridos en facturación electrónica para empresas del sector salud, detalle de los campos:
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
Parámetros
CódigoMoneda
COPPeso colombiano
EUREuro
USDDólar estadounidense
ANGFlorín antillano neerlandés
ARSPeso argentino
AUDDólar australiano
BOBBoliviano
BRLReal brasileño
CADDólar canadiense
CHFFranco suizo
CLPPeso chileno
CRCColón costarricense
GBPLibra esterlina
GTQQuetzal guatemalteco
HNLLempira hondureño
JPYYen japonés
MXNPeso mexicano
NZDDólar neozelandés
PABBalboa panameño
PENNuevo sol peruano
SGDDólar de Singapur
UYUPeso uruguayo
Estados en Factura Electrónica:
EstadoRecibido por la DIANDescripción
DraftNOEn este estado una factura de tipo electrónico fue guardada satisfactoriamente en Siigo Nube pero no se ha enviado a la DIAN (No tiene CUFE).
AcceptedSÍEn este estado la factura fue enviada y aceptada por la DIAN.
RejectedNOEn este estado la factura fue enviada a la DIAN con errores y fue rechazada, se debe corregir y enviar nuevamente desde Siigo Nube.
POST/v1/invoices
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
curl -X POST "https://api.siigo.com/v1/invoices" \
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
