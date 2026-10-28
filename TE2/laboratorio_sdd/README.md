# Laboratorio 13 - Prestamos de libros con SDD

Topicos Especiales II - Prof. Regis Rivera. Modulo Python reutilizable, sin dependencias, construido con
**Spec-Driven Development**: describir, aclarar, aprobar una spec verificable, planificar, implementar con IA y comprobar.

```
 1 ESPECIFICAR   2 REVISAR      3 PLANIFICAR   4 TAREAS      5 IMPLEMENTAR   6 VERIFICAR
 que + por que   criterios      como           T01..T06      y probar        contra la spec
 [hecho]         [hecho]        [hecho]        [hecho]       [hecho]         [hecho]
```

| Estado                | Valor                                            |
|-----------------------|--------------------------------------------------|
| Spec vigente          | **v1.1** (v1.0 conservada en historial)          |
| Pruebas               | **8 de 8** en verde (`python -m unittest discover -s tests -v`) |
| Limite de prestamos   | 2 activos por usuario (v1.0: 3)                  |
| Python                | 3 (probado en 3.13.17)                           |
| Ruta opcional Spec Kit | no ejecutada (no es necesaria para aprobar)     |

## Ejecutar

```bash
cd TE2/laboratorio_sdd
python -m unittest discover -s tests -v
```

## Estructura

```
laboratorio_sdd/
├── prestamos.py                  registrar_prestamo, devolver_prestamo (67 lineas)
├── tests/test_prestamos.py       8 pruebas de aceptacion (contrato)
└── docs/
    ├── constitution.md           principios del proyecto
    ├── spec.md                   v1.0 -> v1.1: R01-R08, N01-N06, D01-D13, AC01-AC08, aprobaciones
    ├── plan.md                   plan tecnico, interfaces y riesgos
    ├── tasks.md                  T01-T06 con alcance y estado; punto de control 2
    ├── traceability.md           matriz R -> AC -> tarea -> prueba -> evidencia, revision codigo vs spec
    ├── prompts.md                prompts acotados por tarea y correccion asociada a R05
    ├── reflexion.md              vibe coding vs SDD y las 6 preguntas
    ├── demo.md                   guion de 5 minutos y salida real
    └── evidencia/                capturas de cada corrida (01 a 09) + verificacion_manual.py
```

## Entregables del laboratorio

| Entregable                                                                 | Donde                                                                 |
|----------------------------------------------------------------------------|-----------------------------------------------------------------------|
| `docs/`: constitucion, spec v1.0 y cambio v1.1, plan, tareas, trazabilidad | `docs/*.md` (historial de versiones y aprobaciones al final de `spec.md`) |
| `prestamos.py` y `tests/test_prestamos.py`                                 | raiz y `tests/`                                                       |
| Evidencia de pruebas: antes de implementar, tras v1.0, tras v1.1           | `docs/evidencia/01` (rojo), `04` (v1.0 verde), `07` y `08` (v1.1 rojo y verde) |
| Prompt limitado por tarea y correccion asociada a un requisito             | `docs/prompts.md` (T01-T03, T06 / R05)                                |
| Matriz R -> AC -> tarea -> prueba -> evidencia                             | `docs/traceability.md`                                                |
| Respuesta de reflexion y breve demostracion                                | `docs/reflexion.md`, `docs/demo.md`                                   |

## Historial de fases

```bash
git log --oneline -- .
```

Un commit por fase o tarea: A (constitucion y spec v1.0), B (AC, plan, tareas, trazabilidad), C (firmas vacias, pruebas y linea base roja),
T01, T02, T03, spec v1.1 con prueba en rojo, T06 (limite 3 a 2) y cierre de evidencia.
