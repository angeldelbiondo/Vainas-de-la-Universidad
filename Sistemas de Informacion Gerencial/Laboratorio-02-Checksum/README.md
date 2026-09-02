# Laboratorio #2 — Checksum o Suma de Verificacion

**Estudiante:** Angel Del Biondo
**Materia:** Sistemas de Informacion Gerencial
**Algoritmo:** SHA-256
**Herramienta de referencia:** <https://defuse.ca/checksums.htm#checksums>

---

## Que es un checksum

Un checksum (suma de verificacion) es una cadena de longitud fija que se calcula
a partir del contenido completo de un archivo. Funciona como una **huella digital**:
si un solo bit del archivo cambia, la huella cambia por completo. Sirve para
comprobar que un archivo no fue alterado durante una transferencia, una copia o
un almacenamiento prolongado.

SHA-256 produce siempre 256 bits = 64 caracteres hexadecimales, sin importar si
el archivo pesa 17 bytes o 17 gigabytes.

---

## Desarrollo del laboratorio

### Pasos 1 y 2 — Crear el archivo plano e ingresar el texto

Se creo el archivo `archivo-plano.txt` con el nombre y apellido del estudiante.

```
Angel Del Biondo
```

Tamano: **17 bytes** (16 caracteres + salto de linea final).

### Pasos 3 y 4 — Calcular y almacenar el SHA-256 (Estado 1)

| Campo | Valor |
|-------|-------|
| Contenido | `Angel Del Biondo` |
| Tamano | 17 bytes |
| **SHA-256** | `81de97d0e767fb855ed05b385d787a3c62247dbf3ec2fff31f64eabc63d8d89b` |

Copia de respaldo: `evidencia/01-original.txt`

### Pasos 5 y 6 — Modificar el texto y recalcular (Estado 2)

Se abrio el archivo, se modifico el texto y se salvo:

```
Angel Del Biondo - Sistemas de Informacion Gerencial
```

| Campo | Valor |
|-------|-------|
| Contenido | `Angel Del Biondo - Sistemas de Informacion Gerencial` |
| Tamano | 53 bytes |
| **SHA-256** | `deed9fb8a8c719b4a2452840927679bb2b545b6f46a2e3f74df71c95739c8732` |

**Comparacion con el Estado 1:** los dos hashes son **completamente distintos**.
No se parecen ni en el primer caracter, aunque el 100% del texto original sigue
presente dentro del archivo modificado. Esto es el **efecto avalancha**: cualquier
cambio, por minimo que sea, redistribuye por completo el resultado del hash.

Copia de respaldo: `evidencia/02-modificado.txt`

### Pasos 7 y 8 — Restaurar el texto original y recalcular (Estado 3)

Se devolvio el archivo exactamente a su contenido original y se salvo.

| Campo | Valor |
|-------|-------|
| Contenido | `Angel Del Biondo` |
| Tamano | 17 bytes |
| **SHA-256** | `81de97d0e767fb855ed05b385d787a3c62247dbf3ec2fff31f64eabc63d8d89b` |

**Comparacion con el Estado 1:** los hashes son **identicos**.

Copia de respaldo: `evidencia/03-restaurado.txt`

---

## Tabla comparativa final

| Estado | Contenido | Bytes | SHA-256 | vs. Estado 1 |
|--------|-----------|-------|---------|--------------|
| 1. Original | `Angel Del Biondo` | 17 | `81de97d0…63d8d89b` | — |
| 2. Modificado | `Angel Del Biondo - Sistemas de Informacion Gerencial` | 53 | `deed9fb8…739c8732` | **DIFERENTE** |
| 3. Restaurado | `Angel Del Biondo` | 17 | `81de97d0…63d8d89b` | **IDENTICO** |

Hashes completos en `evidencia/hashes.txt`.

---

## Conclusiones

1. **El hash depende solo del contenido.** No influye el nombre del archivo, la
   fecha de modificacion, la ruta ni el equipo donde se calcule. El mismo texto
   produce el mismo SHA-256 en cualquier maquina del mundo.
2. **El cambio mas pequeno destruye la coincidencia.** Un caracter distinto genera
   un hash sin ningun parecido al anterior, por lo que es imposible disimular una
   alteracion.
3. **El proceso es reversible en verificacion, no en contenido.** Al restaurar el
   texto exacto se recupera el hash original, lo que confirma que el archivo volvio
   a su estado integro. El hash en si mismo no permite reconstruir el texto: es una
   funcion de una sola via.
4. **Aplicacion gerencial.** En una organizacion el checksum permite validar que
   respaldos, contratos digitales, estados financieros o instaladores descargados
   no fueron modificados por error humano, falla de disco o manipulacion dolosa,
   sin necesidad de revisar el archivo completo.

---

## Como reproducir la verificacion

**Windows (PowerShell):**
```powershell
.\verificar.ps1
```
o de forma manual:
```powershell
Get-FileHash .\archivo-plano.txt -Algorithm SHA256
```

**Linux / macOS:**
```bash
./verificar.sh
```
o de forma manual:
```bash
sha256sum archivo-plano.txt
```

**Navegador:** subir el archivo en <https://defuse.ca/checksums.htm#checksums> y
leer la fila `SHA256`.

Los tres metodos devuelven exactamente el mismo valor.

---

## Estructura de la entrega

```
Laboratorio-02-Checksum/
├── README.md              — informe del laboratorio
├── informe.html           — informe visual (imprimible a PDF)
├── archivo-plano.txt      — archivo del laboratorio (estado final = original)
├── verificar.sh           — script de verificacion (Linux/macOS)
├── verificar.ps1          — script de verificacion (Windows)
└── evidencia/
    ├── 01-original.txt
    ├── 02-modificado.txt
    ├── 03-restaurado.txt
    └── hashes.txt         — registro de los tres SHA-256
```
