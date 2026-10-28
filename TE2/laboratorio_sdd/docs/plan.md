# Plan tecnico v1.0

Basado en: `constitution.md` y `spec.md` v1.0 (aprobada).

- Archivo: prestamos.py; funciones registrar_prestamo y
  devolver_prestamo. tests/test_prestamos.py para aceptacion.
- date.fromisoformat + comprobacion de formato estricto.
- timedelta(days=14) para vencimiento.
- Validar todo ANTES de append() o de mutar un dict.
- No dependencias externas, red, BD ni fecha del sistema.
- La lista de prestamos la proporciona quien llama.

## Interfaces

```
registrar_prestamo(prestamos, usuario, libro, fecha) -> dict
devolver_prestamo(prestamos, usuario, libro)         -> dict
```

Ambas lanzan ValueError ante cualquier entrada invalida, sin mutar nada.

## Estructura interna de prestamos.py

| Elemento                    | Tipo       | Responsabilidad                                                              | Req.          |
|-----------------------------|------------|------------------------------------------------------------------------------|---------------|
| `PLAZO_DIAS = 14`           | constante  | plazo unico, sin numeros magicos                                             | R02           |
| `MAX_PRESTAMOS_ACTIVOS = 3` | constante  | tope por usuario en UN solo lugar (facilita un cambio futuro de limite)      | R05           |
| `_texto(valor, campo)`      | pura       | exige `str`, recorta, rechaza vacio                                          | R04, D03, D08 |
| `_fecha(valor)`             | pura       | regex ASCII `[0-9]{4}-[0-9]{2}-[0-9]{2}` + `date.fromisoformat`              | R03, D01, D02 |
| `_activos(prestamos)`       | pura       | filtra `devuelto == False`                                                   | D06           |
| `registrar_prestamo`        | publica    | valida todo, calcula vencimiento, comprueba R05/R06, y solo al final `append` | R01, R02, R05, R06 |
| `devolver_prestamo`         | publica    | valida textos, busca el prestamo activo, y solo si existe lo marca           | R07, R08, D07 |

Orden de `registrar_prestamo`: tipo de lista -> textos -> fecha -> vencimiento (con desborde) -> limite por usuario -> libro unico -> construir dict -> `append`.
Orden de `devolver_prestamo`: tipo de lista -> textos -> buscar activo -> marcar `devuelto=True`.

## Riesgos

| Riesgo                                                                         | Mitigacion                                                               |
|--------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `fromisoformat` acepta formatos laxos en 3.11+ (`20260901`, semanas ISO)       | regex estricta previa (D01)                                              |
| `\d` en regex acepta digitos Unicode (`٢٠٢٦`)                                  | usar `[0-9]`, no `\d`                                                    |
| `$` en regex acepta salto de linea final                                       | usar `fullmatch`                                                         |
| `date + timedelta` lanza `OverflowError` cerca de `9999-12-31`                 | capturar y convertir a `ValueError` (D04)                                |
| Mutar la lista antes de terminar de validar                                    | `append` / `devuelto = True` son la ULTIMA instruccion                   |
| Tipos no-`str` rompen `.strip()` con `AttributeError`                          | `isinstance` previo, `ValueError` explicito (D03)                        |
| Cambios de limite (3 -> 2) dispersos por el codigo                             | constante unica `MAX_PRESTAMOS_ACTIVOS`                                  |
