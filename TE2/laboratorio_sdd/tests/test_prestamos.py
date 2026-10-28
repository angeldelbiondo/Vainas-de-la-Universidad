import unittest
from prestamos import registrar_prestamo, devolver_prestamo

class TestPrestamos(unittest.TestCase):
    def setUp(self):
        self.p = []

    def alta(self, u="Ana", b="Python", f="2026-09-01"):
        return registrar_prestamo(self.p, u, b, f)

    def test_r01_registro(self):
        r = self.alta()
        self.assertEqual((r["usuario"], r["libro"]), ("Ana", "Python"))
        self.assertEqual((len(self.p), r["devuelto"]), (1, False))

    def test_r02_vencimiento(self):
        self.assertEqual(self.alta()["fecha_vencimiento"], "2026-09-15")

    def test_r03_fecha_invalida(self):
        for fecha in ("01/09/2026", "2026-02-30"):
            with self.subTest(fecha=fecha):
                with self.assertRaises(ValueError):
                    self.alta(b="Libro " + fecha, f=fecha)
        self.assertEqual(self.p, [])

    def test_r04_campos_vacios(self):
        for u, b in ((" ", "Libro"), ("Ana", " ")):
            with self.assertRaises(ValueError):
                self.alta(u=u, b=b)
        self.assertEqual(self.p, [])

    def test_r05_maximo_activos(self):
        for b in ("A", "B"):
            self.alta(b=b)
        with self.assertRaises(ValueError):
            self.alta(b="C")
        self.assertEqual(len(self.p), 2)
        devolver_prestamo(self.p, "Ana", "A")
        self.alta(b="C")

    def test_r06_libro_unico(self):
        self.alta()
        with self.assertRaises(ValueError):
            self.alta(u="Luis")
        self.assertEqual(len(self.p), 1)
        devolver_prestamo(self.p, "Ana", "Python")
        self.alta(u="Luis")

    def test_r07_devolver(self):
        self.alta()
        r = devolver_prestamo(self.p, "Ana", "Python")
        self.assertTrue(r["devuelto"])

    def test_r08_devolucion_inexistente(self):
        with self.assertRaises(ValueError):
            devolver_prestamo(self.p, "Ana", "Python")
        self.alta()
        devolver_prestamo(self.p, "Ana", "Python")
        with self.assertRaises(ValueError):
            devolver_prestamo(self.p, "Ana", "Python")

if __name__ == "__main__":
    unittest.main()
