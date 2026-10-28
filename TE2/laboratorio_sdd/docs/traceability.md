# Trazabilidad

Nada se implementa por accidente: cada requisito baja hasta una prueba, una tarea y una evidencia.

```
REQUISITO  ->  PRUEBA DE ACEPTACION  ->  TAREA  ->  EVIDENCIA
R02: vencimiento 14 dias -> AC02: fecha + 14 dias -> T01: fechas -> test_r02: OK
R05: maximo 3            -> AC05: cuarto bloqueado -> T02: limite -> test_r05: OK
```

## Matriz por grupos (paso 14)

| Requisito | Aceptacion  | Tarea | Evidencia esperada          |
|-----------|-------------|-------|-----------------------------|
| R01-R04   | AC01-AC04   | T01   | test_r01 a test_r04         |
| R05-R06   | AC05-AC06   | T02   | test_r05 y test_r06         |
| R07-R08   | AC07-AC08   | T03   | test_r07 y test_r08         |

## Matriz completa R -> AC -> Tarea -> Prueba -> Evidencia

| Req | AC   | Tarea | Prueba (`tests/test_prestamos.py`)  | Evidencia |
|-----|------|-------|-------------------------------------|-----------|
| R01 | AC01 | T01   | `test_r01_registro`                 | pendiente |
| R02 | AC02 | T01   | `test_r02_vencimiento`              | pendiente |
| R03 | AC03 | T01   | `test_r03_fecha_invalida`           | pendiente |
| R04 | AC04 | T01   | `test_r04_campos_vacios`            | pendiente |
| R05 | AC05 | T02   | `test_r05_maximo_activos`           | pendiente |
| R06 | AC06 | T02   | `test_r06_libro_unico`              | pendiente |
| R07 | AC07 | T03   | `test_r07_devolver`                 | pendiente |
| R08 | AC08 | T03   | `test_r08_devolucion_inexistente`   | pendiente |

## Verificacion manual de decisiones sin prueba automatica

Las decisiones D01-D13 que no tienen una de las 8 pruebas del contrato se comprueban a mano (paso 23).

| Id  | Decision verificada | Evidencia |
|-----|---------------------|-----------|
| M01 | D01: `20260901`, `2026-9-1`, `2026-09-01\n` rechazadas | pendiente |
| M02 | D02: `" 2026-09-01"` rechazada | pendiente |
| M03 | D03: `None`, `123` como usuario/libro/fecha -> ValueError | pendiente |
| M04 | D04: `9999-12-25` -> ValueError y lista intacta | pendiente |
| M05 | D05: "Ana" y "ana" son distintos | pendiente |
| M06 | D07: libro devuelto puede volver a prestarse; devolver actua sobre el activo | pendiente |
| M07 | D09: devolver a nombre de otro usuario -> ValueError | pendiente |
| M08 | D10: `prestamos` no-lista -> ValueError; dict devuelto es el de la lista | pendiente |

## Puntos de control

| Control | Documento                | Fecha      | Estado    |
|---------|--------------------------|------------|-----------|
| 1       | `spec.md` (antes de programar) | 2026-10-28 | revisado |
| 2       | `tasks.md` (plan y tareas)     | 2026-10-28 | revisado |
