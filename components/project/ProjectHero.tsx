'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function ProjectHero({ proyecto }: Props) {
  return (
    <section
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Imagen de fondo */}
      <Image
        src={proyecto.imagenes.hero}
        alt={proyecto.nombre}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Contenido centrado — igual que ProjectCard en el home */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center max-w-2xl">

        <h1 className="text-6xl font-light tracking-wide text-white md:text-8xl">
          {proyecto.nombre}
        </h1>

        <p className="text-xs font-medium tracking-widest text-white/80 uppercase">
          {proyecto.ubicacion}
        </p>

        <div className="w-16 border-t border-white/50" />

        <p className="text-sm font-light leading-relaxed text-white/80 md:text-base">
          {proyecto.descripcionPreview || proyecto.descripcion}
        </p>

        <button
          onClick={() => {
            document.getElementById('introduccion')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="mt-2 rounded-full border border-white/30 bg-white/15 px-10 py-4 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/30"
        >
          Ver más
        </button>
      </div>

      {/* Precio — esquina inferior derecha, fade suave */}
      <motion.div
        className="absolute bottom-8 right-20 z-10 text-right md:right-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.4, ease: 'easeOut' }}
      >
        <p className="text-[10px] font-medium tracking-[0.25em] text-white/40 uppercase mb-1">
          Precio desde
        </p>
        <p className="text-2xl font-light tracking-wide text-white/30 md:text-3xl">
          USD ${proyecto.precioDesde.toLocaleString('es-UY')}
        </p>
      </motion.div>
    </section>
  )
}
