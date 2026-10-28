"""Verificacion manual (paso 23): casos negativos y decisiones D01-D13.

Uso, desde laboratorio_sdd/:  python docs/evidencia/verificacion_manual.py
No es codigo de producto: solo ejercita prestamos.py y comprueba que, ante un
error, la lista queda exactamente igual que antes de la llamada.
"""
import copy
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import prestamos as m
from prestamos import devolver_prestamo as dev
from prestamos import registrar_prestamo as reg

fallos = 0
MAX = m.MAX_PRESTAMOS_ACTIVOS


def marca(ok, etiqueta, detalle=""):
    global fallos
    fallos += 0 if ok else 1
    print(f"[{'OK ' if ok else 'MAL'}] {etiqueta:<4} {detalle}")


def caso(etiqueta):
    """Ejecuta el caso al definirlo; una excepcion inesperada cuenta como fallo, no como crash."""
    def ejecutar(funcion):
        try:
            funcion()
        except Exception as e:
            marca(False, etiqueta, f"excepcion inesperada {type(e).__name__}: {e}")
    return ejecutar


def rechaza(etiqueta, detalle, lista, funcion, *args):
    """La llamada debe lanzar ValueError y dejar la lista intacta."""
    antes = copy.deepcopy(lista)
    try:
        funcion(lista, *args)
    except ValueError:
        marca(lista == antes, etiqueta, f"ValueError, lista intacta={lista == antes} | {detalle}")
    except Exception as e:  # cualquier otro tipo de error incumple la spec
        marca(False, etiqueta, f"lanzo {type(e).__name__} en vez de ValueError | {detalle}")
    else:
        marca(False, etiqueta, f"NO lanzo error | {detalle}")


def acepta(etiqueta, detalle, condicion):
    marca(condicion, etiqueta, detalle)


def con_activos(usuario, n, fecha="2026-09-01"):
    """Lista con n prestamos activos de un usuario."""
    l = []
    for i in range(n):
        reg(l, usuario, f"Libro{i}", fecha)
    return l


print(f"Limite de activos en vigor: {MAX}\n")

print("-- Tres casos negativos obligatorios --")


@caso("N1")
def _():
    l = con_activos("Ana", 1)
    rechaza("N1", "fecha imposible 2026-02-30", l, reg, "Ana", "Libro", "2026-02-30")


@caso("N2")
def _():
    l = con_activos("Ana", 1)
    rechaza("N2", "libro ya prestado (otro usuario)", l, reg, "Luis", "Libro0", "2026-09-02")


@caso("N3")
def _():
    l = con_activos("Ana", MAX)
    rechaza("N3", f"prestamo activo numero {MAX + 1} del mismo usuario", l, reg, "Ana", "Extra", "2026-09-02")


print("\n-- Decisiones sin prueba automatica --")


for f in ("20260901", "2026-9-1", "2026-09-01\n", "2026-W36-2", "2026-09-01T00"):
    rechaza("M01", f"formato laxo {f!r}", [], reg, "Ana", "Python", f)
rechaza("M02", "fecha con espacio inicial", [], reg, "Ana", "Python", " 2026-09-01")
for u, b, f in ((None, "L", "2026-09-01"), ("Ana", 123, "2026-09-01"),
                ("Ana", "L", None), ("Ana", "L", 20260901), ("Ana", "L", date(2026, 9, 1))):
    rechaza("M03", f"no-str {(u, b, f)!r}", [], reg, u, b, f)
rechaza("M03", "devolver con usuario None", [], dev, None, "L")


@caso("M04")
def _():
    l = []
    rechaza("M04", "9999-12-25 desborda el calendario", l, reg, "Ana", "Python", "9999-12-25")
    r = reg(l, "Ana", "Python", "9999-12-17")
    acepta("M04", "9999-12-17 + 14 = 9999-12-31 es el ultimo valido", r["fecha_vencimiento"] == "9999-12-31")


@caso("M05")
def _():
    l = []
    reg(l, "Ana", "Python", "2026-09-01")
    r = reg(l, "ana", "python", "2026-09-01")
    acepta("M05", "'Ana'/'Python' y 'ana'/'python' son distintos", len(l) == 2 and r["usuario"] == "ana")


@caso("M06")
def _():
    l = []
    r1 = reg(l, "  Ana ", " Python  ", "2026-09-01")
    acepta("M06", "textos recortados al guardar", (r1["usuario"], r1["libro"]) == ("Ana", "Python"))
    dev(l, "Ana", "Python")
    r2 = reg(l, "Ana", "Python", "2026-09-20")
    devuelto = dev(l, "Ana", "Python")
    acepta("M06", "libro devuelto puede volver a prestarse (historial=2)", len(l) == 2)
    acepta("M06", "devolver actua sobre el prestamo ACTIVO, no el viejo",
           devuelto is r2 and l[0] is r1 and r1["devuelto"] and r2["devuelto"])


@caso("M07")
def _():
    l = con_activos("Ana", 1)
    rechaza("M07", "devolver a nombre de otro usuario", l, dev, "Luis", "Libro0")
    rechaza("M07", "devolver con libro vacio", l, dev, "Ana", "   ")


rechaza("M08", "'prestamos' no es list (tupla) en registrar", (), reg, "Ana", "Python", "2026-09-01")
rechaza("M08", "'prestamos' no es list (None) en devolver", None, dev, "Ana", "Python")


@caso("M08")
def _():
    l = []
    r = reg(l, "Ana", "Python", "2026-09-01")
    acepta("M08", "el dict devuelto es el mismo objeto de la lista", r is l[0])


@caso("M09")
def _():
    l = con_activos("Ana", MAX)
    r = reg(l, "Luis", "LibroLuis", "2026-09-02")
    acepta("M09", "el tope es POR USUARIO: Luis registra aunque Ana este en su limite",
           r["usuario"] == "Luis" and len(l) == MAX + 1)


print(f"\nResultado: {'TODO OK' if fallos == 0 else f'{fallos} comprobaciones fallidas'}")
sys.exit(1 if fallos else 0)
