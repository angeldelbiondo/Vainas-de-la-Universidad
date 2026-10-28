# Tareas

```
T01 [R01-R04]: registrar datos, validar, calcular fecha.
T02 [R05-R06]: rechazar exceso y libro prestado.
T03 [R07-R08]: registrar devolucion o error.
T04 [R01-R08]: ejecutar aceptacion y revisar errores.
T05 [R01-R08]: documentar evidencia y revisar diff.
Regla: ejecutar las tareas en orden, una por iteracion.
```

## Estado

| Tarea | Requisitos | Alcance permitido                                  | Estado    |
|-------|------------|----------------------------------------------------|-----------|
| T01   | R01-R04    | `registrar_prestamo`: validar, fecha, `append`     | hecha (evid. `02`) |
| T02   | R05-R06    | solo reglas de limite y libro unico en registrar   | hecha (evid. `03`) |
| T03   | R07-R08    | `devolver_prestamo`                                | hecha (evid. `04`) |
| T04   | R01-R08    | solo ejecutar pruebas y corregir por referencia    | hecha v1.0 (8/8, sin correcciones) |
| T05   | R01-R08    | evidencia, trazabilidad, `git diff`                | hecha v1.0 (`traceability.md`) |

## Punto de control 2 (paso 15): plan y tareas

Revision realizada el 2026-10-28 por angeldelbiondo.

- [x] Ninguna tarea introduce funciones fuera de alcance: T01-T03 solo tocan `registrar_prestamo` y `devolver_prestamo`; T04-T05 no escriben codigo de producto. No hay UI, login, multas, renovaciones ni persistencia.
- [x] Cada requisito tiene al menos una tarea y una prueba (matriz en `traceability.md`).
- [x] Huecos senalados y decisiones tomadas por el responsable:

| Hueco detectado                                                          | Decision (antes del codigo)                                                                                   |
|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| D01-D05, D08, D11 (validaciones extra) no tienen prueba entre las 8 aprobadas | Se mantienen las 8 pruebas del contrato sin tocarlas; esas decisiones se verifican a mano (M01-M08 en `traceability.md`) |
| El tope por usuario aparece como numero en R05 y AC05                    | Constante unica `MAX_PRESTAMOS_ACTIVOS` (plan), asi un cambio de limite toca un solo lugar                    |
| T04 y T05 no tenian alcance de codigo                                    | Quedan definidas como tareas sin codigo de producto (solo ejecucion y evidencia)                              |

Se autoriza continuar a la fase C.
