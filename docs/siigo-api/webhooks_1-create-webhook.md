Suscribirse a un webhook
Esta funcionalidad te permitirá suscribirte a las notificaciones de alguno de los eventos, se debe generar un request para cada evento al que se desee suscribir. Ten en cuenta la siguiente información que debes enviar en el cuerpo de la petición:
NombreTipoDescripción
application_idstringNombre del software o aplicación que recibirá las notificaciones.
topicstringEvento al que se desea suscribir, por ejemplo: "public.siigoapi.products.create".
urlstringURL en la que se desea recibir las notificaciones.
Datos que encontrarás en el response:
NombreTipoDescripción
idstringID de la suscripción.
application_idstringNombre del software o aplicación que recibirá las notificaciones.
urlstringURL a la que se van a enviar las notificaciones.
topicstringEvento al que se suscribió.
company_keystringNombre de la empresa suscrita al webhook.
activebooleanIndica el estado de la suscripción.
created_atdateFecha y hora de la suscripción.
POST/v1/webhooks
Body
Authorization
Authorization<token>
Partner-Id<token>
Request Body
application/jsonRequired
application_idRequired
string
urlRequired
string
Format: "uri"
topicRequired
string
curl -X POST "https://api.siigo.com/v1/webhooks" \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": "Siigo",
    "url": "https://www.siigo.com/",
    "topic": "public.siigoapi.products.create"
  }'
200
Webhook registrado exitosamente.
Response
{
  "id": "04154094-56d0-4153-99d9-25f587aa4e50",
  "application_id": "Siigo",
  "url": "https://www.siigo.com/",
  "topic": "public.siigoapi.products.create",
  "company_key": "siigoapi",
  "active": true,
  "created_at": "2023-08-11T15:11:18.1333022Z"
}
TypeScript

