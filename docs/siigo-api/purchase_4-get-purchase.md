Consultar Facturas de compra
Consultar una factura por su id.
Esta es la información que obtendrás de la factura de compra consultada:
NombreTipoDescripción
idstringIdentificador de la factura de compra.
document.idnumberIdentificador del comprobante, se puede consultar en https://api.siigo.com/v1/document-types?type=FC.
numbernumberConsecutivo/número del comprobante, el campo es obligatorio según la configuración del tipo de comprobante.
namestringTipo de Comprobante + Código de Comprobante + Número de Comprobante.
datestringFecha de la factura, formato yyyy-MM-dd.
supplier.idstringSerial identificador del cliente.
supplier.identificationstringNúmero de identificación del cliente.
supplier.branch_officestringSucursal, valor por default 0.
discount_typestringIndica el tipo de descuento que se maneja en este tipo de factura "Percentage" o "Value".
supplier_by_itembooleanIndica si la factura maneja proveedor por item.
cost_centernumberIndica el Centro de costo de la factura.
currency.codestringCódigo de moneda.
currency.exchange_ratestringTasa / Valor en moneda extranjera.
totalnumberTotal de la factura, es calculado según el manejo de decimales configurado en la empresa.
balancenumberSaldo pendiente de pago en la factura.
observationsstringComentarios para agregar información a la factura.
items.idstringIdentificador del producto/servicio.
items.codestringCódigo único del producto.
items.descriptionstringNombre o descripción del producto/servicio.
items.quantitynumberCantidad. En Siigo Nube queda registrado con dos decimales.
items.pricenumberPrecio del producto / Valor unitario. En Siigo Nube queda registrado con dos decimales.
items.discount.percentagenumberPorcentaje de descuento del producto.
items.discount.valuenumberValor de descuento del producto.
items.taxes.idnumberIdentificador único del impuesto.
items.taxes.namestringNombre del impuesto.
items.taxes.percentagenumberPorcentaje de impuesto del producto.
items.taxes.valuenumberValor de impuesto del producto.
items.taxes.totalnumberTotal del producto, incluye impuestos.
payments.idnumberID del medio de pago.
payments.namestringNombre del medio de pago.
payments.valuenumberValor asociado al medio de pago.
payments.due_datestringFecha pago cuota, formato yyyy-MM-dd.
createdstringLa fecha en la que se creó la entidad.
last_updatedstringLa fecha en la que se actualizó la entidad por última vez.
¿Como consultar facturas en Siigo Nube?
Para visualizar una factura en Siigo Nube puedes ingresar al ícono de la lupa que corresponde al Buscador, digita el número y selecciona en el listado Facturas compra / Gasto.
/document-types FV
GET/v1/purchases/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of invoice, this value must be a Guidwith the next format 00000000-0000-0000-0000-000000000000.
curl -X GET "https://api.siigo.com/v1/purchases/string" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "dd3ee2cf-c313-4f13-ac9c-b5aa8db5f41c",
  "document": {
    "id": 58246
  },
  "number": 73,
  "name": "FC-1-73",
  "date": "2024-05-22",
  "supplier": {
    "id": "17eca20f-9c14-4e75-8a72-8ac8bdca6d2c",
    "identification": "1065600600",
    "branch_office": 10
  },
  "total": 3000,
  "balance": 0,
  "provider_invoice": {
    "prefix": "VEN",
    "number": "987"
  },
  "items": [
    {
      "id": "ab491976-9bd8-49fc-b8a0-caacd700efc6",
      "type": "item",
      "code": "SGNB002",
      "quantity": 3,
      "price": 1000,
      "description": "Prod SiigoNube_Mod 002",
      "total": 3000
    }
  ],
  "payments": [
    {
      "id": 51279,
      "name": "MercadoPago",
      "value": 3000
    }
  ],
  "metadata": {
    "created": "2024-05-23T12:57:42.0000000+00:00"
  }
}
TypeScript

