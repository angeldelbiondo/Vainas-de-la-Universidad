"""Gestor de prestamos de libros (spec v1.0). Python estandar, sin persistencia."""
import re
from datetime import date, timedelta

PLAZO_DIAS = 14

_FORMATO_FECHA = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}")


def _texto(valor, campo):
    if not isinstance(valor, str):
        raise ValueError(f"{campo} debe ser texto")
    valor = valor.strip()
    if not valor:
        raise ValueError(f"{campo} no puede estar vacio")
    return valor


def _fecha(valor):
    if not isinstance(valor, str) or not _FORMATO_FECHA.fullmatch(valor):
        raise ValueError("fecha debe tener formato AAAA-MM-DD")
    return date.fromisoformat(valor)


def registrar_prestamo(prestamos, usuario, libro, fecha):
    if not isinstance(prestamos, list):
        raise ValueError("prestamos debe ser una lista")
    usuario = _texto(usuario, "usuario")
    libro = _texto(libro, "libro")
    inicio = _fecha(fecha)
    try:
        vencimiento = inicio + timedelta(days=PLAZO_DIAS)
    except OverflowError:
        raise ValueError("fecha fuera del calendario soportado") from None

    prestamo = {
        "usuario": usuario,
        "libro": libro,
        "fecha_prestamo": inicio.isoformat(),
        "fecha_vencimiento": vencimiento.isoformat(),
        "devuelto": False,
    }
    prestamos.append(prestamo)
    return prestamo


def devolver_prestamo(prestamos, usuario, libro):
    raise NotImplementedError("Pendiente de especificacion")
