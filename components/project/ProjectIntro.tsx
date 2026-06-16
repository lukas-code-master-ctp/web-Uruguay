'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function ProjectIntro({ proyecto }: Props) {
  const imagenLateral = proyecto.imagenes.introVertical

  // La Martina usa la variante clara (fondo beige + letras negras); el resto, fondo oscuro.
  const esBeige = proyecto.slug === 'la-martina'
  const bg = esBeige ? 'bg-[#F5F0E8]' : 'bg-[#0A0A0A]'
  const txtTitulo = esBeige ? 'text-[#0A0A0A]' : 'text-white'
  const txtUbicacion = esBeige ? 'text-[#0A0A0A]/45' : 'text-white/35'
  const txtCuerpo = esBeige ? 'text-[#0A0A0A]/75' : 'text-white/60'
  const txtLabel = esBeige ? 'text-[#0A0A0A]/40' : 'text-white/30'
  const txtPrecio = esBeige ? 'text-[#0A0A0A]/85' : 'text-white/80'

  return (
    <section id="introduccion" className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Columna izquierda — texto editorial */}
      <div className={`${bg} flex items-center px-10 py-20 md:px-16 md:py-24 order-2 md:order-1`}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md"
        >
          <p className="mb-6 text-[10px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
            Introducción
          </p>

          <h2 className={`text-4xl font-light tracking-wide ${txtTitulo} md:text-5xl lg:text-6xl leading-tight`}>
            {proyecto.nombre}
          </h2>

          <p className={`mt-3 text-xs font-medium tracking-[0.25em] ${txtUbicacion} uppercase`}>
            {proyecto.ubicacion}
          </p>

          <div className="my-8 w-10 border-t border-[#C6A665]/40" />

          <p className={`whitespace-pre-line text-sm font-light leading-relaxed ${txtCuerpo} md:text-base`}>
            {proyecto.descripcion}
          </p>

          <div className="mt-10">
            <p className={`text-[10px] font-medium tracking-[0.3em] ${txtLabel} uppercase mb-1`}>
              Desde
            </p>
            <p className={`text-2xl font-light tracking-wide ${txtPrecio}`}>
              USD ${proyecto.precioDesde.toLocaleString('es-UY')}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Columna derecha — imagen a sangre */}
      <div className="relative min-h-[55vw] md:min-h-full order-1 md:order-2">
        <Image
          src={imagenLateral}
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
