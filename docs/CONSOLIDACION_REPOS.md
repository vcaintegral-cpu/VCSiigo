# Consolidación: un solo repositorio (`VCSiigo`)

Objetivo: que al final exista **solo `vcaintegral-cpu/VCSiigo`**. `vcsiigo-fb57acc9` (prototipo Lovable) se cierra cuando el núcleo nuevo alcance paridad. `vccausacion` no se toca (contiene información de terceros; la usuaria decide qué hacer con él).

## De `vcsiigo-fb57acc9`
| Pieza | Decisión | Estado |
|---|---|---|
| `src/lib/treasury.ts` (cruce banco↔pagos, parseo de montos/fechas) | **Tomada y corregida** → `src/lib/egresos/match.ts`, `src/lib/util/parse.ts` (subconjuntos de pagos, ventana de fechas, montos CO/US, 19 pruebas) | ✅ |
| `buildSiigoVoucher` (POST `/v1/vouchers`, tipo `OutBound`) | **Descartada**: endpoint y tipo equivocados para egresos. Reemplazada por `payment-receipt.ts` (POST `/v1/payment-receipts`, `Detailed`, partida doble garantizada) | ✅ |
| `src/lib/siigo.functions.ts` (token por llamada, credenciales en env, sin 429, sin idempotencia) | **Descartada** → `src/lib/siigo.ts` | ✅ |
| `src/lib/excel.ts` (lectura de Excel) | Por revisar al construir el módulo de carga | ⏳ |
| `src/lib/purchases*.ts` (lectura de PDF con IA + borrador de compra) | Por revisar en el Bloque 2 (XML DIAN y Excel RECIBIDOS tendrán prioridad sobre IA) | ⏳ |
| Pantallas `compras`/`egresos`, componentes shadcn | Se rehacen en Next.js con el mismo diseño | ⏳ |
| `supabase/migrations`, RLS "cualquier usuario autenticado" | **Descartadas** (sin multiempresa) | ✅ |
| `src/integrations/lovable`, `error-capture`, `previewAuthStorage`, `.lovable/` | **Descartadas** (específicas de Lovable) | ✅ |
| Idea original del README: **nómina electrónica** | Se incorpora al Bloque 2 | ⏳ |

## Cierre (lo hace la usuaria cuando yo confirme paridad)
1. Probar el núcleo nuevo con una empresa de prueba.
2. En Lovable: quitar el dominio del proyecto viejo y apuntarlo al hosting nuevo (DNS).
3. En Lovable: exportar lo que se quiera conservar y borrar el proyecto (si el Supabase es administrado por Lovable, se borra con él).
4. En GitHub: archivar o eliminar `vcsiigo-fb57acc9` (Settings → Danger Zone). Yo no tengo permiso para borrar repositorios.
