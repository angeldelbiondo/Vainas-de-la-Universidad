# Trazabilidad

Nada se implementa por accidente: cada requisito baja hasta una prueba, una tarea y una evidencia.

```
REQUISITO  ->  PRUEBA DE ACEPTACION  ->  TAREA  ->  EVIDENCIA
R02: vencimiento 14 dias -> AC02: fecha + 14 dias -> T01: fechas -> test_r02: OK
R05: maximo 3 (v1.0) / 2 (v1.1) -> AC05: bloqueo del excedente -> T02: limite -> test_r05: OK
```

## Matriz por grupos (paso 14)

| Requisito | Aceptacion  | Tarea | Evidencia esperada          |
|-----------|-------------|-------|-----------------------------|
| R01-R04   | AC01-AC04   | T01   | test_r01 a test_r04         |
| R05-R06   | AC05-AC06   | T02   | test_r05 y test_r06         |
| R07-R08   | AC07-AC08   | T03   | test_r07 y test_r08         |

## Matriz completa R -> AC -> Tarea -> Prueba -> Evidencia

Evidencia en `docs/evidencia/`. Comando: `python -m unittest discover -s tests -v`

| Req | AC   | Tarea | Prueba (`tests/test_prestamos.py`) | Codigo (`prestamos.py`)               | Evidencia v1.0                          | Evidencia v1.1 |
|-----|------|-------|------------------------------------|---------------------------------------|-----------------------------------------|----------------|
| R01 | AC01 | T01   | `test_r01_registro`                | `registrar_prestamo` L30-55           | rojo `01` -> verde `02`, `04`           | verde `08` (sin regresion) |
| R02 | AC02 | T01   | `test_r02_vencimiento`             | `PLAZO_DIAS` L5, L36-39               | rojo `01` -> verde `02`, `04`           | verde `08` (sin regresion) |
| R03 | AC03 | T01   | `test_r03_fecha_invalida`          | `_fecha` L20-23                       | rojo `01` -> verde `02`, `04`; M01, M02 | verde `08`; M01, M02 (`09`) |
| R04 | AC04 | T01   | `test_r04_campos_vacios`           | `_texto` L11-17                       | rojo `01` -> verde `02`, `04`; M03      | verde `08`; M03 (`09`) |
| R05 | AC05 | T02   | `test_r05_maximo_activos`          | `MAX_PRESTAMOS_ACTIVOS` L6, L42-43    | rojo `03` -> verde `04`; N3 (tope 3)    | rojo `07` -> verde `08`; N3 con tope 2 (`09`) |
| R06 | AC06 | T02   | `test_r06_libro_unico`             | `registrar_prestamo` L44-45           | rojo `03` -> verde `04`; N2             | verde `08`; N2 (`09`) |
| R07 | AC07 | T03   | `test_r07_devolver`                | `devolver_prestamo` L58-66            | rojo `03` -> verde `04`; M06            | verde `08`; M06 (`09`) |
| R08 | AC08 | T03   | `test_r08_devolucion_inexistente`  | `devolver_prestamo` L67               | rojo `03` -> verde `04`; M07            | verde `08`; M07 (`09`) |

Archivos de evidencia:
`01_linea_base_roja` (8 pruebas en ERROR) · `02_tras_T01` (4 verdes, 2 FAIL, 2 ERROR) ·
`03_tras_T02` (avanzan hasta `devolver_prestamo`) · `04_v1_0_verde` (8 de 8) ·
`05_verificacion_manual_v1_0` (N1-N3 y M01-M08) · `06_mutacion_requisito_sin_cubrir` ·
`07_v1_1_rojo_esperado` (solo R05 en rojo) · `08_v1_1_verde` (8 de 8) · `09_verificacion_manual_v1_1` (N3 ahora con el 3er prestamo).

## Verificacion manual de decisiones sin prueba automatica (paso 23)

Script: `docs/evidencia/verificacion_manual.py`. En cada caso fallido comprueba ademas que la lista queda intacta.

| Id  | Que se verifica                                                                        | Decision | v1.0 (`05`) | v1.1 |
|-----|----------------------------------------------------------------------------------------|----------|-------------|------|
| N1  | fecha imposible `2026-02-30` -> ValueError, lista intacta                              | R03      | OK          | OK (`09`) |
| N2  | libro ya prestado a otro usuario -> ValueError, lista intacta                          | R06      | OK          | OK (`09`) |
| N3  | prestamo activo numero N+1 del mismo usuario -> ValueError, lista intacta              | R05      | OK (4o)     | OK (`09`) |
| M01 | `20260901`, `2026-9-1`, `2026-09-01\n`, `2026-W36-2`, `...T00` rechazadas              | D01      | OK          | OK (`09`) |
| M02 | `" 2026-09-01"` rechazada (la fecha no se recorta)                                     | D02      | OK          | OK (`09`) |
| M03 | `None`, `123`, `date(...)` como usuario/libro/fecha -> ValueError, no TypeError        | D03, D08 | OK          | OK (`09`) |
| M04 | `9999-12-25` -> ValueError; `9999-12-17` -> vence `9999-12-31`                         | D04      | OK          | OK (`09`) |
| M05 | "Ana"/"Python" y "ana"/"python" son distintos                                          | D05      | OK          | OK (`09`) |
| M06 | textos recortados; libro devuelto se vuelve a prestar; devolver actua sobre el activo  | R01, D07 | OK          | OK (`09`) |
| M07 | devolver a nombre de otro usuario o con libro vacio -> ValueError                      | D08, D09 | OK          | OK (`09`) |
| M08 | `prestamos` no-lista -> ValueError; el dict devuelto es el objeto de la lista          | D10      | OK          | OK (`09`) |

## Revision del codigo contra la spec v1.0 (paso 24)

Realizada el 2026-10-28 por angeldelbiondo, con `git diff` por tarea y sin tomar como validacion lo que diga la IA.

| Req | Cumple | Comprobacion independiente                                                                    |
|-----|--------|-----------------------------------------------------------------------------------------------|
| R01 | si     | `append` en L54 devuelve el mismo dict (M08); textos recortados (M06)                         |
| R02 | si     | `timedelta(days=PLAZO_DIAS)`; AC02 `2026-09-01` -> `2026-09-15`; borde de calendario (M04)    |
| R03 | si     | regex ASCII + `fullmatch` + `fromisoformat`; 5 formatos laxos rechazados (M01)                |
| R04 | si     | `_texto`: `strip()` y rechazo de vacio y no-`str` (M03)                                       |
| R05 | si     | cuenta solo activos del mismo usuario (L42); devueltos no cuentan (`test_r05`)                |
| R06 | si     | cualquier activo con el mismo libro, de cualquier usuario (L44); devuelto libera (`test_r06`) |
| R07 | si     | marca `devuelto=True` y devuelve el dict (L65-66)                                             |
| R08 | si     | sin activo coincidente -> ValueError (L67); doble devolucion cubierta por `test_r08`          |

- Funciones no solicitadas: ninguna. Publicas solo `registrar_prestamo` y `devolver_prestamo`; el resto son auxiliares `_privadas` del plan.
- Sin UI, red, BD, login, multas, renovaciones ni fecha del sistema (`grep` de `datetime.now|today|open(|import ` solo muestra `re` y `datetime.date/timedelta`).
- Todo `append` / `devuelto = True` ocurre DESPUES de toda validacion (orden del plan).
- Limite: `06_mutacion_requisito_sin_cubrir` muestra que las 8 pruebas pueden estar verdes con un requisito (D01) roto; por eso existe la verificacion manual.

## Cambio R05 v1.1 (paso 29)

| Elemento           | Antes (v1.0)                              | Despues (v1.1)                                   |
|--------------------|-------------------------------------------|--------------------------------------------------|
| Spec R05           | a lo sumo 3 prestamos activos             | a lo sumo 2 prestamos activos                    |
| Spec AC05          | cuarto prestamo activo -> ValueError      | tercer prestamo activo -> ValueError             |
| Prueba `test_r05`  | libros A, B, C; falla D; len 3; devolver A; alta D | libros A, B; falla C; len 2; devolver A; alta C |
| Codigo             | `MAX_PRESTAMOS_ACTIVOS = 3`               | `MAX_PRESTAMOS_ACTIVOS = 2` (unica linea cambiada) |
| Resultado          | 8 de 8 verdes (`04`)                      | rojo esperado (`07`, solo R05) -> 8 de 8 verdes (`08`) |

Regresiones: R01-R04 y R06-R08 siguen en verde en `08`; su prueba no se toco (el unico cambio en `tests/` es `test_r05`).
Orden respetado: spec v1.1 -> prueba -> rojo -> codigo -> verde. Nada se cambio solo en el prompt ni solo en el codigo.

## Puntos de control

| Control | Documento                      | Fecha      | Estado   |
|---------|--------------------------------|------------|----------|
| 1       | `spec.md` (antes de programar) | 2026-10-28 | revisado |
| 2       | `tasks.md` (plan y tareas)     | 2026-10-28 | revisado |
| 3       | codigo vs spec v1.0 (arriba)   | 2026-10-28 | revisado |
| 4       | cambio R05 v1.1 y regresiones  | 2026-10-28 | revisado |
