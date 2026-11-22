Consultar un webhook
Este endpoint te permite consultar las suscripciones de webhooks que tiene la compañia.
Datos que encontrarás en el response:
NombreTipoDescripción
idstringID de la suscripción.
application_idstringNombre del software o aplicación que recibe las notificaciones.
urlstringURL a la que se envían las notificaciones.
topicstringEvento al que está suscrito.
company_keystringNombre de la empresa suscrita al webhook.
activebooleanIndica el estado de la suscripción.
created_atdateFecha y hora de la suscripción (formato ISO 8601, por ejemplo: 2025-06-10T14:35:00Z).
GET/v1/webhooks
Authorization
Authorization<token>
Partner-Id<token>
curl -X GET "https://api.siigo.com/v1/webhooks" \
  -H "Authorization: <token>"
200
Lista de webhooks registrados exitosamente obtenida.
Response
{
  "pagination": {
    "page": 1,
    "page_size": 25,
    "total_results": 253
  },
  "results": [
    {
      "id": "04154094-56d0-4153-99d9-25f587aa4e50",
      "application_id": "Siigo",
      "url": "https://www.siigo.com/",
      "topic": "public.siigoapi.products.create",
      "company_key": "siigoapi",
      "active": true,
      "created_at": "2023-08-11T15:11:18.1333022Z"
    }
  ],
  "_links": {
    "previous": {
      "href": "https://api.siigo.com/v1/webhooks?page=4&page_size=25"
    },
    "self": {
      "href": "https://api.siigo.com/v1/webhooks?page=5&page_size=25"
    },
    "next": {
      "href": "https://api.siigo.com/v1/webhooks?page=6&page_size=25"
    }
  }
}
TypeScript

