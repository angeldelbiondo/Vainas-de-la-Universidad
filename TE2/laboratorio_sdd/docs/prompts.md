# Prompts por tarea

Disciplina usada con la IA: una tarea por iteracion, alcance escrito en el prompt, el humano ejecuta las pruebas por su cuenta
y la IA nunca declara "terminado" ni "validado" sin evidencia independiente (`docs/evidencia/`).

## Resumen

| Paso | Prompt                          | Salida pedida        | Resultado y evidencia                                           |
|------|---------------------------------|----------------------|-----------------------------------------------------------------|
| 4    | Analista de requisitos          | preguntas, NO codigo | 8 preguntas -> decisiones N01-N06 (`spec.md`)                   |
| 7    | Auditoria QA de la spec         | hallazgos, NO codigo | 13 decisiones D01-D13 (`spec.md`)                               |
| 11   | Plan tecnico                    | plan, NO codigo      | `plan.md`                                                       |
| 19   | **T01** limitado a R01-R04      | solo `prestamos.py`  | AC01-AC04 verdes, resto pendiente (`02_tras_T01`)               |
| 21a  | **T02** limitado a R05-R06      | solo `prestamos.py`  | tope y libro unico; avanza hasta T03 (`03_tras_T02`)            |
| 21b  | **T03** limitado a R07-R08      | solo `prestamos.py`  | 8 de 8 verdes (`04_v1_0_verde`)                                 |
| 22   | Correccion por referencia (plantilla) | una discrepancia | no fue necesaria en v1.0: 8/8 a la primera                |
| 28   | **T06** cambio v1.1 limitado a R05 | solo la regla de limite | rojo (`07`) -> verde (`08`), 1 linea cambiada            |

## Paso 4 - aclaraciones, sin codigo

```
Actua como analista de requisitos. Necesito un gestor de prestamos
de libros para un laboratorio. Haz preguntas sobre reglas ambiguas,
casos limite y datos de entrada. NO generes codigo ni arquitectura.
```

Preguntas devueltas y decision del responsable (paso 5):

| Pregunta de la IA                                         | Decision                                                  |
|-----------------------------------------------------------|-----------------------------------------------------------|
| Cuantos prestamos activos por usuario?                    | N01: maximo 3 (v1.0), luego 2 (v1.1)                      |
| Un libro puede estar con dos usuarios a la vez?           | N02: no, un prestamo activo global por libro              |
| Cual es el plazo y en que unidad?                         | N03: exactamente 14 dias calendario                       |
| Que formato de fecha se recibe?                           | N04: AAAA-MM-DD                                           |
| Que pasa al devolver algo inexistente o ya devuelto?      | N05: ValueError                                           |
| Hay persistencia, autenticacion, multas o renovaciones?   | N06: no; fuera de alcance                                 |
| Se usa la fecha actual del sistema?                       | Constitucion: nunca, fechas deterministas                 |
| Que hacer ante entradas invalidas?                        | ValueError y la lista no se altera                        |

## Paso 7 - auditoria de ambiguedades, sin codigo

```
Revisa esta especificacion como analista QA. Identifica
contradicciones, reglas no comprobables o decisiones implicitas.
Devuelveme preguntas y cambios propuestos, NO codigo.
[contenido de docs/spec.md]
```

Resultado: D01-D13 en `spec.md` (formato estricto de fecha, tipos no-`str`, desborde de calendario, mayusculas,
definicion de "activo", historial de devueltos, etc.). El responsable acepto o ajusto cada una antes de aprobar v1.0.

## Paso 11 - plan tecnico, sin implementacion

```
Disena un plan tecnico para esta spec aprobada. Usa solo
Python estandar, funciones puras salvo modificacion explicita
de la lista, datetime.date para fechas y unittest para pruebas.
Define interfaces, estructura y riesgos. NO escribas el codigo.
[spec y constitucion]
```

## Paso 19 - T01, solo R01-R04

```
Implementa UNICAMENTE T01. Lee constitution.md, spec.md,
plan.md y tasks.md. Cambia solo prestamos.py; conserva las
firmas, cumple AC01-AC04 y explica tu diff. No anadas UI,
BD, dependencias ni codigo para T02/T03 todavia.
```

Revision humana (paso 20): fecha y textos se validan ANTES del `append`; `devolver_prestamo` sigue con `NotImplementedError`;
pruebas: 4 verdes, `test_r05`/`test_r06` FAIL y `test_r07`/`test_r08` ERROR (esperado).

## Pasos 21a y 21b - T02 y luego T03, una iteracion por tarea

```
Ahora implementa SOLO T02: R05-R06. Revisa el limite de
3 prestamos activos y el libro activo global. No cambies
interfaces, pruebas ni otros requisitos; informa los cambios.
```

```
Despues de revisarlo, en una nueva interaccion: implementa
SOLO T03, R07-R08; valida antes de modificar los datos.
```

## Paso 22 - correccion asociada a un requisito (plantilla)

```
Falla AC05 / test_r05_maximo_activos; corrige solo esa
discrepancia, sin ampliar el alcance. No sustituyas la prueba
ni alteres la especificacion.
```

En v1.0 no hizo falta: las 8 pruebas pasaron al cerrar T03. La correccion real asociada a un requisito fue el cambio v1.1 (siguiente).

## Paso 28 - T06, cambio v1.1 limitado a R05

Orden respetada: spec v1.1 -> `test_r05` actualizada y en rojo (`07`) -> prompt -> verde (`08`).

```
Cambio aprobado: spec v1.1, R05/AC05 reduce el limite de
3 a 2. La prueba actualizada falla. Modifica exclusivamente
la regla de limite en prestamos.py. No cambies otras funciones
ni tests. Ejecutare las pruebas independientemente.
```

Diff recibido (revisado con `git diff` antes de aceptar):

```diff
-MAX_PRESTAMOS_ACTIVOS = 3
+MAX_PRESTAMOS_ACTIVOS = 2
```

Una sola linea: la constante unica prevista en el plan hizo que el cambio de requisito no se disperse por el codigo.
