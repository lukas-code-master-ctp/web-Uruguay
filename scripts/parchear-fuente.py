"""
Agrega los glifos acentuados que le faltan a Meganté (á é í ó ú ñ ü + mayúsculas).

La fuente original solo trae ASCII básico y los acentos sueltos (´ ˜ ¨ `), así que
en español el navegador mezclaba Meganté con Montserrat dentro de la misma palabra.
Este script compone cada letra acentuada como glifo compuesto = letra base + acento
posicionado, y de paso crea la `i` sin punto para que la í no choque con el punto.

Es una transformación de una sola vez; el resultado ya está commiteado en
app/fonts/megante.ttf. Solo hay que volver a correrlo si cambia la fuente original.

Uso (fontTools no es dependencia del proyecto):

    python -m venv .venv-fuente
    .venv-fuente/Scripts/pip install fonttools     # Linux/mac: .venv-fuente/bin/pip
    .venv-fuente/Scripts/python scripts/parchear-fuente.py
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'app' / 'fonts' / 'megante-original.ttf'
DESTINO = RAIZ / 'app' / 'fonts' / 'megante.ttf'

# (codepoint, letra base, acento). El orden importa: la í usa la i sin punto.
COMPUESTOS = [
    (0x00E1, 'a', 'acute'), (0x00E9, 'e', 'acute'), (0x00ED, 'dotlessi', 'acute'),
    (0x00F3, 'o', 'acute'), (0x00FA, 'u', 'acute'),
    (0x00F1, 'n', 'tilde'), (0x00FC, 'u', 'dieresis'),
    (0x00C1, 'A', 'acute'), (0x00C9, 'E', 'acute'), (0x00CD, 'I', 'acute'),
    (0x00D3, 'O', 'acute'), (0x00DA, 'U', 'acute'),
    (0x00D1, 'N', 'tilde'), (0x00DC, 'U', 'dieresis'),
]

# Separación entre el tope de la mayúscula y la base del acento.
AIRE_MAYUSCULA = 30


def bordes(glyph_set, nombre):
    pen = BoundsPen(glyph_set)
    glyph_set[nombre].draw(pen)
    return pen.bounds


def crear_i_sin_punto(fuente):
    """Copia la `i` quedándose solo con el asta: descarta el contorno del punto."""
    glyf = fuente['glyf']
    i = glyf['i']
    i.expand(glyf)

    altura_x = fuente['OS/2'].sxHeight
    coords, fin = i.coordinates, i.endPtsOfContours

    conservados_coords, conservados_flags, conservados_fin = [], [], []
    inicio = 0
    for corte in fin:
        tramo = list(range(inicio, corte + 1))
        y_min = min(coords[p][1] for p in tramo)
        # El punto de la i es el contorno que arranca por encima de la altura de x.
        if y_min <= altura_x:
            for p in tramo:
                conservados_coords.append(coords[p])
                conservados_flags.append(i.flags[p])
            conservados_fin.append(len(conservados_coords) - 1)
        inicio = corte + 1

    from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates

    sin_punto = Glyph()
    sin_punto.numberOfContours = len(conservados_fin)
    sin_punto.coordinates = GlyphCoordinates(conservados_coords)
    sin_punto.flags = bytearray(conservados_flags)
    sin_punto.endPtsOfContours = conservados_fin
    sin_punto.program = i.program
    return sin_punto


def registrar(fuente, nombre, glifo, avance, lsb):
    """Suma un glifo nuevo al final del orden, con sus métricas horizontales."""
    fuente['glyf'].glyphs[nombre] = glifo
    fuente['hmtx'].metrics[nombre] = (avance, lsb)

    orden = list(fuente.getGlyphOrder())
    if nombre not in orden:
        orden.append(nombre)
    fuente.setGlyphOrder(orden)
    fuente['glyf'].glyphOrder = orden


def main():
    fuente = TTFont(ORIGEN)
    glyf = fuente['glyf']
    conjunto = fuente.getGlyphSet()
    cmap_actual = fuente.getBestCmap()
    altura_mayuscula = fuente['OS/2'].sCapHeight

    # 1. i sin punto
    if 'dotlessi' not in fuente.getGlyphOrder():
        avance_i, lsb_i = fuente['hmtx']['i']
        registrar(fuente, 'dotlessi', crear_i_sin_punto(fuente), avance_i, lsb_i)
        conjunto = fuente.getGlyphSet()

    nuevos = {}
    for codepoint, base, acento in COMPUESTOS:
        nombre = f'uni{codepoint:04X}'
        caja_base = bordes(conjunto, base)
        caja_acento = bordes(conjunto, acento)

        # Centrado horizontal: el centro óptico del acento sobre el de la letra.
        centro_base = (caja_base[0] + caja_base[2]) / 2
        centro_acento = (caja_acento[0] + caja_acento[2]) / 2
        dx = centro_base - centro_acento

        # Los acentos vienen dibujados a la altura de la minúscula. Para las
        # mayúsculas hay que subirlos por encima de la altura de caja.
        dy = 0
        if base.isupper():
            dy = (altura_mayuscula + AIRE_MAYUSCULA) - caja_acento[1]

        compuesto = Glyph()
        compuesto.numberOfContours = -1
        compuesto.components = []
        for nombre_pieza, (px, py) in ((base, (0, 0)), (acento, (dx, dy))):
            pieza = GlyphComponent()
            pieza.glyphName = nombre_pieza
            pieza.x, pieza.y = int(round(px)), int(round(py))
            pieza.flags = 0x4  # ROUND_XY_TO_GRID
            compuesto.components.append(pieza)

        avance, lsb = fuente['hmtx'][base]
        registrar(fuente, nombre, compuesto, avance, lsb)
        nuevos[codepoint] = nombre

    # 2. cmap
    for tabla in fuente['cmap'].tables:
        if tabla.isUnicode():
            tabla.cmap.update(nuevos)

    # 3. Recalcular cajas y límites
    for nombre in nuevos.values():
        glyf[nombre].recalcBounds(glyf)
    fuente['maxp'].recalc(fuente)

    fuente.save(DESTINO)

    revision = TTFont(DESTINO).getBestCmap()
    faltan = [chr(cp) for cp, _, _ in COMPUESTOS if cp not in revision]
    print(f'Glifos agregados: {len(nuevos)} (+ dotlessi)')
    print('Faltan:', ''.join(faltan) if faltan else '(ninguno)')
    print('Guardado en', DESTINO)


if __name__ == '__main__':
    main()
