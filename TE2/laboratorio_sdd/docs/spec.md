# Especificacion: prestamos de libros (version 1.1)

Objetivo: registrar y devolver prestamos sin base de datos.
Fuera de alcance: UI, login, multas, renovaciones, persistencia.

## Requisitos

```
R01: registrar_prestamo(prestamos, usuario, libro, fecha)
     agrega un dict y lo devuelve. Los textos se recortan.
R02: fecha_vencimiento = fecha_prestamo + 14 dias calendario.
R03: fecha debe ser valida y tener formato AAAA-MM-DD.
R04: usuario y libro no pueden quedar vacios tras strip().
R05: cada usuario admite a lo sumo 2 prestamos activos.   [v1.1; en v1.0 eran 3]
R06: un libro admite a lo sumo un prestamo activo global.
R07: devolver_prestamo(prestamos, usuario, libro)
     marca devuelto=True y devuelve ese dict.
R08: devolver algo inexistente o ya devuelto produce ValueError.
```

Estructura: usuario, libro, fecha_prestamo,
fecha_vencimiento (str AAAA-MM-DD), devuelto (bool).
Todo error produce ValueError y no modifica la lista.

## Decisiones de negocio (paso 5)

| Id  | Decision                                                                    | Afecta   |
|-----|-----------------------------------------------------------------------------|----------|
| N01 | Un usuario puede tener maximo 2 prestamos activos (v1.1; en v1.0 eran 3)    | R05      |
| N02 | Un libro no puede estar prestado a dos usuarios simultaneamente             | R06      |
| N03 | El plazo es exactamente 14 dias calendario                                  | R02      |
| N04 | La fecha se recibe en formato AAAA-MM-DD                                    | R03      |
| N05 | Devolver un prestamo inexistente o ya devuelto produce ValueError           | R08      |
| N06 | No hay persistencia ni autenticacion                                        | alcance  |

## Auditoria de ambiguedades (pasos 7 y 8)

Hallazgos de la auditoria QA y la decision tomada para cada uno.
Ninguna decision cambia R01-R08; solo fijan la conducta donde el texto era ambiguo.

| Id  | Ambiguedad detectada                                                                 | Decision                                                                                                                            |
|-----|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| D01 | "Formato AAAA-MM-DD" no es comprobable: `date.fromisoformat` (3.11+) tambien acepta `20260901` y fechas semanales | Formato estricto: exactamente 10 caracteres ASCII `DDDD-DD-DD` y ademas fecha real de calendario (rechaza `2026-02-30`, `0000-01-01`) |
| D02 | "Los textos se recortan" no dice si incluye la fecha                                  | Solo `usuario` y `libro` se recortan. La fecha NO se recorta: `" 2026-09-01"` es invalida                                          |
| D03 | No se define que pasa si algun argumento no es `str` (None, int, date)               | `ValueError` (no `TypeError` ni `AttributeError`), porque "todo error produce ValueError"                                           |
| D04 | `fecha + 14 dias` puede desbordar el calendario (`9999-12-25` en adelante)           | `ValueError` y la lista queda intacta (no se deja escapar `OverflowError`)                                                          |
| D05 | No se define si "Ana" y "ana" son el mismo usuario/libro                             | Comparacion exacta, sensible a mayusculas, sobre el texto ya recortado. No se normaliza                                             |
| D06 | "Prestamo activo" no esta definido                                                   | Activo = `devuelto == False`. Los devueltos no cuentan para R05 ni R06                                                              |
| D07 | Los devueltos no se borran, entonces `(usuario, libro)` puede repetirse en la lista  | Los devueltos quedan como historial. `devolver_prestamo` actua sobre el prestamo ACTIVO que coincida (R06 garantiza que hay a lo sumo uno) |
| D08 | `devolver_prestamo` no dice si recorta/valida sus textos                             | Aplica las mismas reglas que R04: se recortan; vacios o no-`str` producen `ValueError`                                              |
| D09 | Libro activo a nombre de otro usuario al devolver                                    | Para el usuario indicado es "inexistente": R08, `ValueError`                                                                        |
| D10 | No se define el tipo de `prestamos` ni el dict devuelto                              | `prestamos` debe ser `list`, si no `ValueError`. El dict devuelto es el MISMO objeto que queda en la lista (R01 y R07)              |
| D11 | Orden de validacion y mensajes de error                                              | Se valida todo ANTES de mutar. El contrato es el tipo `ValueError`; el texto del mensaje no es contrato                             |
| D12 | "Quedan valores acordados" en AC01 no estaba enumerado                               | Valores acordados: usuario `Ana`, libro `Python`, fecha_prestamo `2026-09-01`, fecha_vencimiento `2026-09-15`, devuelto `False`    |
| D13 | Fechas pasadas, futuras o fuera de orden                                             | Todas permitidas. No se compara con la fecha del sistema (constitucion)                                                             |

Resultado: sin ambiguedades abiertas que alteren la conducta del programa.

## Criterios de aceptacion (paso 9)

```
AC01 (R01): al registrar Ana / Python / 2026-09-01,
  queda un prestamo activo con los valores acordados (D12).
AC02 (R02): el vencimiento es 2026-09-15.
AC03 (R03): fecha malformada o imposible -> ValueError.
AC04 (R04): texto vacio o espacios -> ValueError.
AC05 (R05): al intentar el tercer prestamo activo -> ValueError.   [v1.1; en v1.0 el cuarto]
AC06 (R06): libro activo repetido, incluso otro usuario -> ValueError.
AC07 (R07): devolver cambia devuelto a True.
AC08 (R08): devolver sin prestamo activo -> ValueError.
En cada caso fallido, la lista queda intacta.
```

## Punto de control 1 (paso 10): antes de programar

Revision realizada el 2026-10-28 por angeldelbiondo.

- [x] Alcance explicito: objetivo y "fuera de alcance" definidos al inicio.
- [x] R01-R08 sin contradicciones: la auditoria (D01-D13) no encontro conflictos entre requisitos, solo huecos, ya cerrados.
- [x] AC01-AC08 verificables: cada uno se traduce a una prueba unittest con resultado binario (ver `traceability.md`).
- [x] Fechas y limites definidos: formato estricto (D01), plazo 14 dias (R02), tope de activos por usuario (R05: 3 en v1.0, 2 en v1.1), desborde de calendario (D04).
- [x] Comportamiento ante errores definido: `ValueError` + lista intacta (R03-R06, R08, D03, D04, D08, D10, D11).

Todas las casillas revisadas: se autoriza continuar al plan.

## Historial de cambios

| Version | Fecha      | Responsable   | Cambio                                   | Motivo                                                                  | Afecta     |
|---------|------------|---------------|------------------------------------------|-------------------------------------------------------------------------|------------|
| 1.0     | 2026-10-28 | angeldelbiondo | Especificacion inicial R01-R08, AC01-AC08 | Contrato inicial aprobado                                               | todos      |
| 1.1     | 2026-10-28 | angeldelbiondo | R05 y AC05: maximo 3 -> 2 prestamos activos | Solicitud del cliente: "por una restriccion de espacio, cada usuario ahora puede mantener maximo DOS prestamos activos en lugar de tres" | R05, AC05 |

Conducta del resto de requisitos (R01-R04, R06-R08, AC01-AC04, AC06-AC08) sin cambios en v1.1.
Cadena del cambio: spec v1.1 -> prueba `test_r05` (rojo esperado) -> `MAX_PRESTAMOS_ACTIVOS` en `prestamos.py` (verde).

## Control de aprobacion

Version 1.0 revisada: fecha 2026-10-28; aprobador(es) angeldelbiondo
Version 1.1 revisada: fecha 2026-10-28; aprobador(es) angeldelbiondo
