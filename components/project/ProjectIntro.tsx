'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Proyecto } from '@/lib/types'
import type { TemaProyecto } from '@/lib/proyecto-tema'

interface Props {
  proyecto: Proyecto
  tema: TemaProyecto
}

type BloqueIntro =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'lista'; items: string[] }

/**
 * Convierte la `descripcion` de la Sheet en bloques.
 * Las líneas que empiezan con viñeta (`•`, `-`, `*`) forman una lista; una línea
 * suelta terminada en `:` es un subtítulo; el resto son párrafos.
 */
export function parsearDescripcion(texto: string): BloqueIntro[] {
  const bloques: BloqueIntro[] = []
  let parrafo: string[] = []
  let lista: string[] = []

  const cerrarParrafo = () => {
    if (parrafo.length) bloques.push({ tipo: 'parrafo', texto: parrafo.join(' ') })
    parrafo = []
  }
  const cerrarLista = () => {
    if (lista.length) bloques.push({ tipo: 'lista', items: lista })
    lista = []
  }

  for (const cruda of texto.split('\n')) {
    const linea = cruda.trim()

    if (!linea) {
      cerrarLista()
      cerrarParrafo()
      continue
    }
    if (/^[•\-*]\s+/.test(linea)) {
      cerrarParrafo()
      lista.push(linea.replace(/^[•\-*]\s+/, ''))
      continue
    }
    cerrarLista()
    if (linea.endsWith(':')) {
      cerrarParrafo()
      bloques.push({ tipo: 'subtitulo', texto: linea })
      continue
    }
    parrafo.push(linea)
  }

  cerrarLista()
  cerrarParrafo()
  return bloques
}

function IconoPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  )
}

export default function ProjectIntro({ proyecto, tema }: Props) {
  // Variante La Martina: fondo verde salvia texturado + mapa ilustrado a la derecha.
  if (tema.claro) {
    const bloques = parsearDescripcion(proyecto.descripcion)

    return (
      <section id="introduccion" className="relative overflow-hidden bg-martina-fondo">
        {/* Textura de fondo */}
        {tema.fondo && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${tema.fondo})` }}
          />
        )}

        {/* Mapa — capa anclada a la derecha, sin recortar. Su ancho es un 66%
            fijo de la sección (no su alto), así el contenido del mapa siempre
            arranca pasado el 50% y nunca se mete debajo del texto. Los dos
            degradados anidados lo funden con el fondo por izquierda y por
            arriba/abajo, que es lo que hace invisible el borde de la imagen. */}
        {tema.mapaIlustrado && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[66%] items-center lg:flex [-webkit-mask-image:linear-gradient(to_right,transparent,black_26%)] [mask-image:linear-gradient(to_right,transparent,black_26%)]"
          >
            <div className="w-full [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]">
              <Image
                src={tema.mapaIlustrado}
                alt=""
                width={1260}
                height={1047}
                sizes="66vw"
                quality={90}
                className="h-auto w-full"
              />
            </div>
          </div>
        )}

        <div className="relative px-10 py-20 md:px-16 md:py-24 lg:px-24">

          {/* Texto editorial */}
          <div className="flex items-center lg:min-h-[38rem]">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl lg:w-[46%]"
            >
              <p className="mb-6 text-[15px] font-medium tracking-[0.35em] text-martina-grafito/70 uppercase">
                Introducción
              </p>

              <h2 className="font-marca text-4xl font-light tracking-[0.06em] text-martina-marfil uppercase md:text-5xl lg:text-6xl">
                {proyecto.nombre}
              </h2>

              <p className="mt-4 text-xs font-medium tracking-[0.25em] text-martina-grafito uppercase">
                {proyecto.ubicacion}
              </p>

              <div className="mt-10 space-y-7">
                {bloques.map((bloque, i) => {
                  if (bloque.tipo === 'subtitulo') {
                    return (
                      <p key={i} className="text-sm font-light text-martina-grafito italic">
                        {bloque.texto}
                      </p>
                    )
                  }
                  if (bloque.tipo === 'lista') {
                    return (
                      <ul key={i} className="space-y-3">
                        {bloque.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <IconoPin className="mt-1 h-4 w-4 flex-shrink-0 text-martina-grafito/70" />
                            <span className="text-sm font-light leading-snug text-martina-grafito">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={i} className="text-sm font-light leading-relaxed text-martina-grafito">
                      {bloque.texto}
                    </p>
                  )
                })}
              </div>

              <div className="mt-14">
                <p className="mb-1 text-[15px] font-medium tracking-[0.3em] text-martina-grafito/70 uppercase">
                  Desde
                </p>
                <p className="font-marca text-4xl font-light tracking-wide text-martina-marfil md:text-5xl">
                  {proyecto.precioDesde.toLocaleString('es-UY')} USD
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bajo lg no hay ancho para la capa: el mapa va en flujo y completo. */}
        {tema.mapaIlustrado && (
          <div className="relative lg:hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_10%)] [mask-image:linear-gradient(to_bottom,transparent,black_10%)]">
            <Image
              src={tema.mapaIlustrado}
              alt={`Ubicación de ${proyecto.nombre}`}
              width={1260}
              height={1047}
              sizes="100vw"
              quality={90}
              className="h-auto w-full"
            />
          </div>
        )}
      </section>
    )
  }

  return (
    <section id="introduccion" className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Columna izquierda — texto editorial */}
      <div className="bg-[#0A0A0A] flex items-center px-10 py-20 md:px-16 md:py-24 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md"
        >
          <p className="mb-6 text-[15px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
            Introducción
          </p>

          <h2 className="text-4xl font-light tracking-wide text-white md:text-5xl lg:text-6xl leading-tight">
            {proyecto.nombre}
          </h2>

          <p className="mt-3 text-xs font-medium tracking-[0.25em] text-white/35 uppercase">
            {proyecto.ubicacion}
          </p>

          <div className="my-8 w-10 border-t border-[#C6A665]/40" />

          <p className="whitespace-pre-line text-sm font-light leading-relaxed text-white/60 md:text-base">
            {proyecto.descripcion}
          </p>

          <div className="mt-10">
            <p className="text-[15px] font-medium tracking-[0.3em] text-white/30 uppercase mb-1">
              Desde
            </p>
            <p className="text-2xl font-light tracking-wide text-white/80">
              USD ${proyecto.precioDesde.toLocaleString('es-UY')}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Columna derecha — imagen a sangre */}
      <div className="relative min-h-[55vw] md:min-h-full order-1 md:order-2">
        <Image
          src={proyecto.imagenes.introVertical}
          alt={proyecto.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={90}
          className="object-cover"
        />
        {/* velo sutil para suavizar el borde */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

    </section>
  )
}
