# Paso a paso: Supabase + Fly.io (24 horas)

Costo esperado: Supabase gratis + Fly.io dentro de los US$5 de crédito mensual (máquina de 512 MB; puede pasarse unos pocos dólares: revise "Billing" en Fly). Fly exige tarjeta.

## Paso 1 · Base de datos (Supabase gratis, proyecto NUEVO)
1. https://supabase.com → New project. Región más cercana (São Paulo). Guarde la contraseña de la base.
2. **SQL Editor** → pegue todo `supabase/schema.sql` → Run.
3. **Authentication → Users → Add user**: su correo y una contraseña (marque "Auto confirm").
4. **SQL Editor** → abra `supabase/semilla.sql`, reemplace los 3 valores (empresa, NIT sin DV, su correo) → Run. Copie el `org_id` que devuelve.
5. **Project Settings → API**: copie `Project URL`, `anon public` y `service_role` (esta última es secreta: nunca en el navegador ni en el chat).

## Paso 2 · Diagnóstico de solo lectura de Siigo (en su computador)
```bash
git clone https://github.com/vcaintegral-cpu/VCSiigo && cd VCSiigo
git checkout claude/erp-siigo-nube-colombia-646d0w
npm install
# cree .env.local con:
#   SIIGO_USERNAME=...   SIIGO_ACCESS_KEY=...   SIIGO_PARTNER_ID=NombreDeSuApp
npm run diagnostico
```
Comparta `diagnostico-siigo.json` (solo contiene la forma de las respuestas, sin cifras ni nombres).

## Paso 3 · Fly.io
```bash
# instalar flyctl: https://fly.io/docs/flyctl/install/
fly auth signup        # o: fly auth login
fly launch --no-deploy --copy-config --name SU-NOMBRE-UNICO    # responda NO a Postgres, Redis y a desplegar
```
1. Edite `fly.toml`: ponga su URL y `anon key` de Supabase en **[build.args]** y en **[env]**, y su `SIIGO_PARTNER_ID`.
2. Genere la llave de cifrado y cargue los secretos (no quedan en el repositorio):
```bash
fly secrets set SUPABASE_SERVICE_ROLE_KEY="..." ENCRYPTION_KEY="$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
fly deploy
```
3. Verifique: abra `https://SU-NOMBRE-UNICO.fly.dev/api/salud` → debe mostrar `db: ok` y, tras un minuto, `worker: ok`.
4. **Guarde la ENCRYPTION_KEY en un lugar seguro**: sin ella no se pueden descifrar las credenciales de Siigo guardadas.

## Paso 4 · Publicar automáticamente desde GitHub (como Lovable)
```bash
fly tokens create deploy        # copie el token
```
GitHub → VCSiigo → Settings → Secrets and variables → Actions → New secret `FLY_API_TOKEN`. Desde ese momento, cada fusión a `main` despliega sola.

## Paso 5 · Primera empresa
Entre a `https://SU-NOMBRE-UNICO.fly.dev/login` con el usuario del paso 1 → Panel → ingrese las credenciales de Siigo del cliente ("Guardar y probar conexión").

## Reglas de seguridad para las pruebas con el cliente real
- Primero **solo lectura** (autenticación, catálogos, cartera, comprobantes). No se envía ningún documento sin su visto bueno explícito y sin elegir antes un mes sin movimientos.
- Borrado de lo creado en pruebas: la API de Siigo permite borrar facturas de venta, compras, documentos soporte, recibos de caja y recibos de pago/egreso. **Los comprobantes contables (journals) NO tienen borrado por API**: se anulan desde Siigo.
- Recuerde el límite: un bloqueo de transacciones por fecha en Siigo rechaza documentos en meses cerrados (`blocked_transactions`).
