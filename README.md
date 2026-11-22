# ERP Contable · Siigo Nube

Ver `PLAN_CONSTRUCCION.md` (avance), `docs/BLOQUE0_INFRAESTRUCTURA.md` y `supabase/schema.sql`.

```bash
cp .env.example .env.local   # completar variables
npm install
npm test                      # pruebas del cliente Siigo y del motor de aprendizaje
npm run dev                   # http://localhost:3000
npm run entrenar -- <orgId> 2025-01-01 --reiniciar   # entrenamiento local sin límite de tiempo
```
