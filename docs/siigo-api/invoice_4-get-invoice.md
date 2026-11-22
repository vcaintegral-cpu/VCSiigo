On this pageConsultar Factura
Consultar una factura por su id.
Esta es la información que obtendrás de la factura de venta consultada:
NombreTipoDescripción
idstringIdentificador de la factura de venta.
document.idnumberIdentificador del comprobante. Se puede consultar en document-types.
numbernumberConsecutivo/número del comprobante. Campo obligatorio según la configuración del tipo de comprobante.
namestringTipo de Comprobante + Código de Comprobante + Número de Comprobante.
datestringFecha de la factura en formato yyyy-MM-dd.
customer.idstringSerial identificador del cliente.
customer.identificationstringNúmero de identificación del cliente.
customer.branch_officestringSucursal del cliente, valor por defecto 0.
cost_centernumberIdentificador del centro de costo.
currency.codestringCódigo de la moneda utilizada.
currency.exchange_ratestringTasa o valor en moneda extranjera.
totalnumberTotal de la factura (calculado según configuración de decimales de la empresa).
balancenumberSaldo pendiente de pago.
sellernumberID del vendedor asociado a la factura.
observationsstringComentarios u observaciones en la factura.
items.idstringIdentificador del producto o servicio.
items.codestringCódigo único del producto.
items.descriptionstringDescripción del producto o servicio.
items.quantitynumberCantidad del producto (con dos decimales).
items.pricenumberPrecio unitario del producto (con dos decimales).
items.discount.percentagenumberPorcentaje de descuento aplicado al producto.
items.discount.valuenumberValor de descuento aplicado al producto.
items.taxes.idnumberIdentificador del impuesto aplicado.
items.taxes.namestringNombre del impuesto aplicado.
items.taxes.percentagenumberPorcentaje de impuesto aplicado al producto.
items.taxes.valuenumberValor de impuesto aplicado.
items.taxes.totalnumberTotal del producto incluyendo impuestos.
payments.idnumberID del medio de pago utilizado.
payments.namestringNombre del medio de pago.
payments.valuenumberValor asociado al medio de pago.
payments.due_datestringFecha de vencimiento de la cuota (formato yyyy-MM-dd).
createdstringFecha de creación de la entidad.
last_updatedstringFecha de última actualización de la entidad.
¿Como consultar facturas en Siigo Nube?
Para visualizar una factura en Siigo Nube puedes ingresar al ícono de la lupa que corresponde al Buscador, digita el número y oprime en Facturas.
Consultas cuando tienen campos de ingresos para terceros(items.customer)
Si la factura tiene diligenciados los campos del sector salud, mostrara los siguientes campos:
NombreTipoDescripciónCaracterísticas
items.customer.identificationstringNúmero de identificación del cliente.
items.customer.branch_officestringSucursal, valor por default 0.
Consultas cuando tienen campos del sector salud (healthcare_company)
Si la factura tiene diligenciados los campos del sector salud, mostrara los siguientes campos:
NombreTipoDescripciónCaracterísticas
healthcare_company.period_startdatePeriodo de facturación inicio
healthcare_company.period_enddatePeriodo de facturación final
healthcare_company.payment_methodnumberModalidad de pago
healthcare_company.service_plannumberCobertura - Plan servicios
healthcare_company.policy_numberstringNúmero de póliza
healthcare_company.contract_numberstringNúmero de contrato
healthcare_company.copaymentnumberCopago
healthcare_company.coinsurancenumberCuota moderadora
healthcare_company.cost_sharingnumberPagos compartidos
healthcare_company.recovery_chargenumberCuota de recuperación
Json de ejemplo de campos del sector salud
{
	"healthcare_company": {
		"period_start": "2024-02-14",
		"period_end": "2024-03-16",
		"payment_method": "04",
		"service_plan": "01",
		"policy_number": "ZAS321456677",
		"contract_number": "CON1245636",
		"copayment": 500.0,
		"coinsurance": 600.0,
		"cost_sharing": 400.0,
		"recovery_charge": 1000.0
	}
}
Consultas cuando tienen campos para empresas de transporte (transport)
Permite enviar los campos requeridos en facturación electronica para empresas de transporte, detalle de los campos:
NombreTipoDescripciónCaracterísticas
items.transport.file_numbernumberNúmero de radicado
items.transport.shipment_numberstringNúmero de remesa
items.transport.transported_quantitynumberCantidad transportada
items.transport.measurement_unitstringUnidad de medida
items.transport.freight_valuenumberValor Flete
items.transport.purchase_orderstringOrden de compra
items.transport.service_typestringTipo de servicio
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
GET/v1/invoices/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of invoice, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/invoices/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
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

