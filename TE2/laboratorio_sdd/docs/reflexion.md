# Reflexion

## Vibe coding vs. trabajo dirigido por especificaciones (paso 30)

Si se hubiera pedido "crea un gestor de prestamos" y despues "ajusta el limite" sin documentacion, pruebas ni revision,
la IA habria tenido que adivinar el plazo, el formato de fecha, que cuenta como "activo", si dos usuarios pueden tener el mismo
libro y que hacer ante entradas invalidas; habria devuelto algo que "funciona" en el caso feliz. Al pedir despues "ajusta el limite",
no habria forma de saber a cual limite se refiere, ni de comprobar que el cambio no rompio nada, porque ninguna prueba fijaba el
comportamiento anterior; cualquier regresion (por ejemplo, que el tope pase a contar a todos los usuarios y no a cada uno)
solo se descubriria en produccion. El trabajo dirigido por especificaciones evita eso: cada regla tiene un requisito, un criterio de
aceptacion y una prueba, y el cambio de 3 a 2 se vio como un rojo esperado, una linea modificada y un verde sin regresiones.
**Beneficio:** cambios pequenos, comprobables y trazables, con la IA acotada por tarea. **Costo:** mucho trabajo previo de
documentacion y revision (en este laboratorio hay mas texto que codigo), mas lento al inicio y exige disciplina humana en cada punto de control.

## Preguntas de reflexion

### 1. Que diferencia hay entre una solicitud informal y una especificacion comprobable?

Una solicitud informal ("un gestor de prestamos con limite por usuario") admite muchas lecturas y no dice cuando esta bien hecha.
Una especificacion comprobable fija reglas numeradas (R01-R08), datos exactos (formato `AAAA-MM-DD`, 14 dias) y criterios de aceptacion
con resultado binario (AC01-AC08) que se convierten en pruebas ejecutables. Dos personas distintas llegan a la misma conclusion
de "cumple / no cumple" sin discutir.

### 2. Por que la especificacion define que se necesita y el plan como se hara?

Porque cambian por razones distintas y las aprueban personas distintas. La spec es el contrato con el cliente (que y por que)
y solo cambia si el negocio cambia, como paso con R05. El plan es una decision tecnica (regex estricta mas `fromisoformat`,
`timedelta`, validar antes de mutar) que se puede reemplazar sin tocar el contrato mientras las pruebas sigan en verde.
Mezclarlos hace que una preferencia tecnica parezca un requisito, o que un requisito quede escondido en el codigo.

### 3. En que momento debe decidir el humano si la IA puede implementar?

Cuando se cumplen todas estas condiciones, que son los puntos de control: (1) spec aprobada sin ambiguedades abiertas (control 1);
(2) plan y tareas revisados, sin tareas fuera de alcance (control 2); (3) criterios de aceptacion convertidos en pruebas que
fallan (linea base roja, `01`); (4) tarea concreta y acotada en el prompt. Despues, cada tarea se revisa con `git diff` y se cierra
con pruebas ejecutadas por el humano, nunca con la afirmacion de la IA.

### 4. Por que un cambio exige actualizar requisitos y pruebas antes del codigo?

Porque la spec es la fuente de verdad y la prueba es la spec ejecutable. Si se cambia primero el codigo, no hay forma de saber si el
cambio es el aprobado ni de detectar regresiones, y spec y pruebas quedan describiendo un sistema que ya no existe. En v1.1 el orden
(spec -> prueba -> rojo -> codigo -> verde) demostro ademas que la prueba nueva si detecta el comportamiento viejo
(`07_v1_1_rojo_esperado`: solo R05 en rojo) y que nada mas se movio (`08_v1_1_verde`).

### 5. Puede haber ocho pruebas verdes y aun asi existir un requisito no cubierto? Explique

Si, y se comprobo con mutaciones (`docs/evidencia/06_mutacion_requisito_sin_cubrir.txt`). Con la regex estricta de fecha eliminada
(se aceptan `20260901` y fechas semanales ISO) las 8 pruebas siguen en verde, porque `test_r03` solo usa formatos que `fromisoformat`
ya rechaza. Con el tope contando a todos los usuarios en vez de a cada uno, tambien: `test_r05` solo usa a Ana. Ocho verdes
significan que esos ocho casos pasan, no que todo R01-R08 esta cubierto. Por eso la matriz de trazabilidad revisa cada requisito
y la verificacion manual (M01-M09) cubre las decisiones D01-D13 que las pruebas del contrato no ejercitan.

### 6. Que aporta Spec Kit y que no reemplaza de la ingenieria de software?

Aporta estructura y automatizacion del flujo: plantillas de constitucion, spec, plan y tareas, comandos por fase
(`/speckit-specify`, `-plan`, `-tasks`, `-implement`, ...) y artefactos consistentes que la IA puede leer. No reemplaza las decisiones:
que significa "prestamo activo", si el limite es 2 o 3, que riesgo se acepta, ni la revision del diff, la ejecucion independiente de las
pruebas y la responsabilidad de aprobar. Tampoco garantiza buenas pruebas: una spec mal pensada genera plan, tareas y codigo bien
formateados pero equivocados. (Ruta opcional: no se ejecuto en este laboratorio.)
