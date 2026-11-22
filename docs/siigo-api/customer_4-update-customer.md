Actualizar Cliente
Esta funcionalidad te permite actualizar un tercero, debe enviar igual los campos como en su creación porque remplaza los datos. Si hay un campo vacio quedara vacio en Nube.
NombreTipoDescripciónCaracterísticas
typeStringCampo para identificar el tipo de cliente.Campo opcional, con 3 tipos: "Customer", "Supplier", "Other". Por defecto es "Customer".
person_typeString, requiredIdentifica si el tercero es "person" o "company".Campo obligatorio, solo acepta "person" o "company".
id_typestring, requiredCódigo del tipo de documento.Campo obligatorio, 13 para cédula y 31 para NIT.
identificationStringNúmero de identificación del cliente.Campo obligatorio, sin caracteres especiales, máximo 50 caracteres. Solo se permite una identificación ya existente si es una nueva sucursal.
check_digitStringDígito de verificación.Campo opcional, números del 0 al 9.
nameString, requiredRazón social o nombres y apellidos.Obligatorio. Company: un solo campo; Person: array de 2 campos. Máx 100 caracteres por campo.
commercial_nameStringNombre comercial o de fantasía.Campo opcional, alfanumérico, permite espacios y caracteres especiales.
branch_officenumberSucursalCampo opcional. Entero entre 0 y 999. Por defecto 0.
activebooleanEstado del clienteCampo opcional. Por defecto "true".
vat_responsiblebooleanResponsable de IVACampo opcional. Por defecto "false".
fiscal_responsibilities.codestring, requiredCódigo de responsabilidad fiscal.Campo obligatorio, comúnmente "R-99-PN".
address.addressstring, requiredDirección del cliente.Obligatorio. Alfanumérico, máximo 256 caracteres.
address.city.country_codestring, requiredCódigo del país.Consultar en Siigo Nube. Ejemplo: CO.
address.city.state_codestring, requiredCódigo del departamento.Consultar en Siigo Nube. Ejemplo: 11.
address.city.city_codestring, requiredCódigo de la ciudad.Consultar en Siigo Nube. Ejemplo: 11001.
address.postal_codestringCódigo postal.Campo opcional. Alfanumérico, sin espacios, máx 10 caracteres.
phones.indicativestringIndicativo del teléfonoCampo opcional. Numérico, sin espacios ni caracteres especiales, máx 10 caracteres.
phones.numberstringNúmero de contactoCampo opcional. Numérico, sin espacios ni caracteres especiales, máx 10 caracteres.
phones.extensionstringExtensión del número de contactoCampo opcional. Numérico, sin espacios ni caracteres especiales, máx 10 caracteres.
Contacts.first_namestring, requiredNombres del contactoCampo obligatorio. Máx 50 caracteres, alfanumérico, permite espacios y caracteres especiales.
Contacts.last_namestringApellidos del contactoCampo opcional. Máx 50 caracteres, alfanumérico, permite espacios y caracteres especiales.
Contacts.emailstringCorreo del contactoCampo opcional. Alfanumérico, sin espacios ni caracteres especiales, máx 100 caracteres.
Contacts.phone.indicativestringIndicativo del teléfono del contactoCampo opcional. Numérico, sin espacios ni caracteres especiales, máx 10 caracteres.
Contacts.phone.numberstringNúmero de teléfono del contactoCampo opcional. Numérico, sin espacios ni caracteres especiales, máx 10 caracteres.
Contacts.phone.extensionstringExtensión del contactoCampo opcional. Numérico, sin espacios ni caracteres especiales, máx 10 caracteres.
commentsstringObservaciones adicionalesCampo opcional. Alfanumérico, permite espacios y caracteres especiales. Máx 4000 caracteres.
seller_idnumberUsuario vendedor asignado al clienteCampo opcional. Debe existir previamente en Siigo Nube. Consultable con GET a https://api.siigo.com/v1/users.
collector_idnumberUsuario cobradorCampo opcional. Debe existir previamente en Siigo Nube. Consultable con GET a https://api.siigo.com/v1/users.
custom_fields.CUCONstringCódigo Único de Contrato (CUCON) del sector saludCampo opcional. Alfanumérico de 64 caracteres, determinado por el SIIFA. Para terceros del sector salud que realizan ventas masivas a EPS. Se envía como key: "CUCON", value: "<código>".
PUT/v1/customers/{id}
Path
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonOptional
Represents the request with the customer information.
typestring
Represents the customer type (this type can be 'Customer', 'Supplier 'and 'Other'),
this field will be 'Customer' by default.
person_typeRequired
string
Represents the person type, this type can be a 'Person' or 'Company'.
id_typeRequired
string
Represents the code of type id.
identificationRequired
string
Represents the identification number of customer.
For example, the identifitication number '13832081'.
check_digitstring
Represents the check digit, this digit will be calculated automatically.
nameRequired
array<string>
Contains a list of strings with information about customer
this information will be commercial_name (or first name and last name, depnding of customer)
branch_office, active and vat_responsible
commercial_namestring
Represents the commercial name of customer organization.
For example, 'Siigo'.
branch_officeinteger
Represents the branch office of customer, this value by default will be 0.
Format: "int32"
activeboolean
Represents the state of customer.
This value can be 'true' or 'false', by default will be true.
vat_responsibleboolean
Represents whether a person is responsible for VAT.
This value can be 'true' or 'false', by default will be false.
fiscal_responsibilitiesarray<object>
Represents a list of tax responsibilities of a person, by default will be 'R-99-PN'.
Show Attributes
addressobject
Show Attributes
phonesarray<object>
Represents the phones of the customer.
Show Attributes
contactsarray<object>
Represents the associated contantacts of customer.
Show Attributes
commentsstring
Represents additional comments or observations.
related_usersobject
Show Attributes
custom_fieldsarray<object>
Allows you to send the purchase order and delivery order fields.
Show Attributes
Path Parameters
idRequired
string
Format - uuid. Represents the unique Id of customer, this value must be a Guid
with the next format 00000000-0000-0000-0000-000000000000.
Format: "uuid"
curl -X PUT "https://api.siigo.com/v1/customers/497f6eca-6276-4993-bfeb-53cbbbba6f08" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Customer",
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
    ]
  }'
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
/document-types.

