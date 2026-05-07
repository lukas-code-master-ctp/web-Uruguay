'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function ProjectIntro({ proyecto }: Props) {
  const imagenLateral = proyecto.imagenes.galeria[0] ?? proyecto.imagenes.hero

  return (
    <section id="introduccion" className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Columna izquierda — texto editorial, fondo oscuro */}
      <div className="bg-[#0A0A0A] flex items-center px-10 py-20 md:px-16 md:py-24 order-2 md:order-1">
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

          <h2 className="text-4xl font-light tracking-wide text-white md:text-5xl lg:text-6xl leading-tight">
            {proyecto.nombre}
          </h2>

          <p className="mt-3 text-xs font-medium tracking-[0.25em] text-white/35 uppercase">
            {proyecto.ubicacion}
          </p>

          <div className="my-8 w-10 border-t border-[#C6A665]/40" />

          <p className="text-sm font-light leading-relaxed text-white/60 md:text-base">
            {proyecto.descripcion}
          </p>

          <div className="mt-10">
            <p className="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase mb-1">
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
          src={imagenLateral}
          alt={proyecto.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {/* velo sutil para suavizar el borde */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

    </section>
  )
}
