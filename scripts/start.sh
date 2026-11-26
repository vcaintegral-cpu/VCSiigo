#!/usr/bin/env bash
# Arranca web (Next.js) y worker en el mismo contenedor. Si uno muere, termina todo para que Fly lo reinicie.
set -u
NODE_OPTIONS="--max-old-space-size=220" node_modules/.bin/next start -p "${PORT:-3000}" -H 0.0.0.0 &
WEB=$!
NODE_OPTIONS="--max-old-space-size=160" node_modules/.bin/tsx worker/index.ts &
WRK=$!
trap 'kill -TERM $WEB $WRK 2>/dev/null; wait' TERM INT
wait -n $WEB $WRK
CODE=$?
echo "[start] un proceso terminó (código $CODE); reiniciando contenedor"
kill -TERM $WEB $WRK 2>/dev/null
exit 1
