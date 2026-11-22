On this pageConsultar documentos soporte
Consultar una factura por su id.
Esta es la información que obtendrás del documento soporte consultado:
NombreTipoDescripción
idstringIdentificador del documento soporte.
document.idnumberIdentificador del comprobante, se puede consultar en /document-types.
numbernumberConsecutivo/número del comprobante, el campo es obligatorio según la configuración del tipo de comprobante.
namestringTipo de Comprobante + Código de Comprobante + Número de Comprobante.
datestringFecha del documento soporte, formato yyyy-MM-dd.
supplier.idstringSerial identificador del cliente.
supplier.identificationstringNúmero de identificación del proveedor.
supplier.branch_officestringSucursal, valor por default 0.
discount_typestringIndica el tipo de descuento que se maneja en este tipo del documento soporte "Percentage" o "Value".
cost_centernumberIndica el Centro de costo del documento soporte.
currency.codestringCódigo de moneda.
currency.exchange_ratestringTasa / Valor en moneda extranjera.
totalnumberTotal del documento soporte, es calculado según el manejo de decimales que tenga configurada la empresa al momento de crear el documento soporte.
balancenumberSaldo pendiente de pago en el documento soporte.
observationsstringComentarios para agregar información del documento soporte.
items.idstringIdentificador del producto/servicio.
items.typestringTipo de producto facturado, puede ser: Product (producto) FixedAsset (activo) Account (cuenta).
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
¿Cómo consultar documentos soporte en Siigo Nube?
Para visualizar un documento soporte en Siigo Nube puedes ingresar al ícono de
la lupa que corresponde al Buscador, digita el número y selecciona en el listado
Facturas compra / Gasto.
GET/v1/purchase-support-documents/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Identificador del documento soporte
curl -X GET "https://api.siigo.com/v1/purchase-support-documents/63f918c2-ca65-4edc-a7db-66bcdd5159fb" \
  -H "Authorization: <token>"
200
Documento soporte obtenido
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "document": {
    "id": 24446
  },
  "number": 25732,
  "name": "DS-25732",
  "date": "2015-12-15",
  "supplier": {
    "identification": "13832081",
    "branch_office": 0
  },
  "cost_center": 235,
  "discount_type": "Value",
  "currency": {
    "code": "USD",
    "exchange_rate": 3825.03
  },
  "total": 2546.05,
  "balance": 0,
  "observations": "Observaciones",
  "items": [
    {}
  ],
  "payments": [
    {}
  ],
  "metadata": {
    "created": "2020-06-15T03:33:17.208Z",
    "last_updated": null
  }
}
TypeScript

