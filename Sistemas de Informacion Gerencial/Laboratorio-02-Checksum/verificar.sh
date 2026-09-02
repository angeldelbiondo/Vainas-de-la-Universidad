#!/usr/bin/env bash
# Verifica la integridad de las tres evidencias del Laboratorio #2
set -euo pipefail
cd "$(dirname "$0")"
echo "SHA-256 de las evidencias:"
sha256sum evidencia/01-original.txt evidencia/02-modificado.txt evidencia/03-restaurado.txt
echo
if cmp -s evidencia/01-original.txt evidencia/03-restaurado.txt; then
  echo "[OK] Estado 1 y Estado 3 son identicos byte a byte."
else
  echo "[ERROR] Estado 1 y Estado 3 difieren."
fi
