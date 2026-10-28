# Demostracion breve (paso 31)

Duracion: 5 minutos. Todos los comandos desde `TE2/laboratorio_sdd/`. Python 3.13, solo libreria estandar.
Idea central: un programa que "funciona" pero no tiene estos artefactos no demuestra SDD.

| Min | Que mostrar                                  | Comando / archivo                                                   | Mensaje                                                  |
|-----|----------------------------------------------|---------------------------------------------------------------------|----------------------------------------------------------|
| 0:00 | Constitucion y spec v1.0 aprobada           | `docs/constitution.md`, `docs/spec.md` (R01-R08, D01-D13, aprobacion)| El contrato se escribio y aprobo ANTES de programar     |
| 0:45 | Historial por fases                          | `git log --oneline -- .`                                            | Una fase o tarea por commit: A, B, C, T01, T02, T03, v1.1 |
| 1:15 | Pruebas ROJAS antes de implementar          | `tail -5 docs/evidencia/01_linea_base_roja.txt`                     | 8 pruebas fallan: aun no hay codigo                      |
| 1:45 | Progreso por tarea                           | `docs/evidencia/02_tras_T01.txt` y `03_tras_T02.txt`                | T01 pinta de verde R01-R04; el resto sigue pendiente    |
| 2:15 | Verde con spec v1.0                          | `docs/evidencia/04_v1_0_verde.txt`                                  | 8 de 8 con el tope en 3                                  |
| 2:45 | Cambio de cliente: 3 -> 2                    | `docs/spec.md` (historial v1.1) y `docs/evidencia/07_v1_1_rojo_esperado.txt` | Primero spec y prueba; solo R05 queda en rojo |
| 3:30 | Verde con spec v1.1 y diff de 1 linea        | `git log -p -1 --format='%h %s' -- prestamos.py`, `docs/evidencia/08_v1_1_verde.txt` | `MAX_PRESTAMOS_ACTIVOS = 3 -> 2`, 8 de 8, sin regresion |
| 4:00 | Trazabilidad                                 | `docs/traceability.md` (matriz R -> AC -> tarea -> prueba -> evidencia) | Ningun requisito sin prueba, tarea ni evidencia      |
| 4:30 | Limites de las pruebas                       | `docs/evidencia/06_mutacion_requisito_sin_cubrir.txt`               | 8 verdes no es cobertura total; hay verificacion manual |

## Resultado funcional (copiar y pegar)

```bash
python -m unittest discover -s tests -v
```

```bash
python docs/evidencia/verificacion_manual.py
```

```bash
python - <<'EOF'
from prestamos import registrar_prestamo as reg, devolver_prestamo as dev

p = []
print(reg(p, "Ana", "Python", "2026-09-01"))   # vence 2026-09-15
reg(p, "Ana", "Redes", "2026-09-02")           # segundo activo de Ana (limite v1.1)

for intento in (lambda: reg(p, "Ana", "Bases", "2026-09-03"),    # tercero de Ana
                lambda: reg(p, "Luis", "Python", "2026-09-03"),  # libro ya prestado
                lambda: reg(p, "Luis", "Bases", "2026-02-30")):  # fecha imposible
    try:
        intento()
    except ValueError as e:
        print("ValueError:", e, "| prestamos en la lista:", len(p))

print(dev(p, "Ana", "Python")["devuelto"])                    # True
print(reg(p, "Luis", "Python", "2026-09-10")["fecha_vencimiento"])  # 2026-09-24
EOF
```

Salida esperada (obtenida el 2026-10-28):

```
{'usuario': 'Ana', 'libro': 'Python', 'fecha_prestamo': '2026-09-01', 'fecha_vencimiento': '2026-09-15', 'devuelto': False}
ValueError: el usuario ya tiene el maximo de prestamos activos | prestamos en la lista: 2
ValueError: el libro ya esta prestado | prestamos en la lista: 2
ValueError: day is out of range for month | prestamos en la lista: 2
True
2026-09-24
```

Cada `ValueError` deja la lista con 2 prestamos: ningun error la altera. El texto del mensaje no es contrato (D11); lo es el tipo.
