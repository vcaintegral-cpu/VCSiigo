Consultar Cliente
Consultar un tercero por su id.
Se manejan los siguientes datos informativos:
NombreTipoDescripción
idStringIdentificador del cliente.
typeStringTipo de cliente, valor por default Customer.
person_typeStringIdentifica si el tercero es person o company.
id_type.codestringCódigo del tipo de documento, 13 para personas y 31 para empresas.
id_type.namestringNombre del tipo de documento.
identificationStringNúmero de identificación del cliente.
check_digitStringDígito verificación del número de identificación.
nameStringRazón social o nombres y apellidos del cliente.
commercial_nameStringNombre comercial o Nombre de fantasía de la empresa cliente.
branch_officenumberSucursal, valor por default 0.
activebooleanEstado del cliente en Siigo, valor por default true.
vat_responsiblebooleanTipo de régimen IVA. True si es responsable de IVA, False si no, default false.
fiscal_responsibilities.codestringCódigo de la responsabilidad fiscal.
fiscal_responsibilities.namestringNombre de la responsabilidad fiscal.
address.addressstringDirección del cliente.
address.city.country_codestringCódigo del país.
address.city.country_namestringNombre del país.
address.city.state_codestringCódigo del departamento/estado.
address.city.state_namestringNombre del departamento/estado.
address.city.city_codestringCódigo de la ciudad.
address.city.city_namestringNombre de la ciudad.
address.postal_codestringCódigo postal.
phones.indicativestringIndicativo del número de contacto.
phones.numberstringNúmero de contacto.
phones.extensionstringExtensión del número de contacto.
commentsstringObservaciones o comentarios adicionales.
seller_idnumberUsuario vendedor asignado al cliente.
collector_idnumberUsuario cobrador encargado del recaudo de cartera.
createdstringLa fecha en la que se creó la entidad.
last_updatedstringLa fecha en la que se actualizó la entidad por última vez.
¿Como consultar terceros en Siigo Nube?
GET/v1/customers/{id}
Path
Authorization
Authorization<token>
Partner-Id<token>
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of customer, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X GET "https://api.siigo.com/v1/customers/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>"
200
Success
Response
{
  "id": "63f918c2-ca65-4edc-a7db-66bcdd5159fb",
  "type": "Customer",
  "person_type": "'Person'",
  "id_type": {
    "code": "13",
    "name": "Cédula de ciudadanía"
  },
  "identification": "13832081",
  "branch_office": 0,
  "check_digit": "4",
  "name": [
    "string"
  ],
  "commercial_name": "string",
  "active": true,
  "vat_responsible": false,
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
      "country_name": "Colombia",
      "state_code": "19",
      "state_name": "Cauca",
      "city_code": "19001",
      "city_name": "Popayán"
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
  "metadata": {
    "created": "2020-06-15T03:33:17.0000000+00:00",
    "last_updated": null
  }
}
TypeScript

