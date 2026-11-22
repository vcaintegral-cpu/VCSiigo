# Núcleo nuevo · arquitectura

## Principio
Una operación contable solo se envía a Siigo sin humano si pasa **todas** las compuertas. Si falla alguna, va a la bandeja de excepciones; nunca se "adivina".

## Piezas
```
 Carpetas (Drive/OneDrive) · carga manual · correo
            │
            ▼
   Ingesta ──► Extracción (XML DIAN / Excel / PDF)
            │
            ▼
   Motor de causación (determinista) ◄── Memoria contable (reglas + confianza)
            │                                   ▲
            ▼                                   │
   Compuertas de calidad                 Entrenamiento (auxiliar/balance + journals/RC/RP)
            │
   ┌────────┴─────────┐
   ▼                  ▼
 Envío a Siigo     Excepciones (humano, 1 clic)
 (idempotente,       │
  100 req/min)       ▼
   │             Aprende de la corrección
   ▼
 Verificación posterior (lectura del documento creado vs lo enviado)
   │
   ▼
 Reportes (correo/WhatsApp) · auditoría
```

## Procesos
- **web** (Next.js): pantallas, API, autenticación, bandejas.
- **worker** (Node, siempre encendido): toma trabajos de una cola en Postgres (`FOR UPDATE SKIP LOCKED`), limita 100 req/min por empresa, reintenta con backoff, corta ante errores consecutivos (protege contra el bloqueo del 80 %), emite latidos para alertas.
- **core** (paquete TypeScript puro, sin framework): cliente Siigo, extractores, motor de causación, aprendizaje, generadores de planos/Excel. Testeable sin red.

## Compuertas (todas obligatorias para enviar sin humano)
1. Tercero existe y activo en Siigo (y con contactos: `customer_settings`).
2. Documento no duplicado (CUFE/CUDE, NIT+prefijo+número, y por `Idempotency-Key` cuando aplique).
3. Fecha fuera del bloqueo de transacciones y de la ventana DIAN.
4. Cuenta/impuesto/retención con confianza ≥ umbral (por empresa) y respaldo ≥ N observaciones; si no, excepción.
5. Partida doble cuadrada; recálculo de IVA/retenciones contra el documento fuente (centavos).
6. Presupuesto de errores: si fallan X envíos seguidos, la empresa se pausa sola.
7. Verificación posterior: se lee el documento creado y se compara total, IVA, retenciones y saldo; diferencia → alerta, nunca reenvío.

## Modo sombra → modo real
Antes de activar el piloto automático por empresa: **backtesting**. El motor causa los documentos históricos ya contabilizados y se mide el acierto (cuenta, IVA, retención) por tercero. Solo se habilita el envío automático donde el acierto supere el umbral.

## Mejoras propuestas frente a la herramienta anterior
- Causación **en servidor**, no en el navegador.
- Aprendizaje desde el **auxiliar/balance por tercero** (fuente que sí trae cuentas) con backtesting medible.
- `items.type = Account` para fijar la cuenta exacta en compras/DS.
- Identidad remota inmutable (id Siigo guardado antes y después del POST; trigger en BD que impide reenvío).
- Bandeja de excepciones con corrección de 1 clic que **enseña** a la regla.
- Interruptor de emergencia por empresa y modo "solo proponer".
- Cumplimiento de límites de Siigo con limitador por empresa y circuit breaker.
- Perfiles por empresa **declarativos** (datos en BD), sin NITs ni `if` en el código.
