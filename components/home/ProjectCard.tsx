'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
  index: number
}

export default function ProjectCard({ proyecto, index }: Props) {
  return (
    <motion.section
      className="relative flex h-screen w-full items-end overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Imagen de fondo */}
      <Image
        src={proyecto.imagenes.hero}
        alt={proyecto.nombre}
        fill
        priority={index === 0}
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Número de proyecto */}
      <span className="absolute top-10 right-10 text-xs font-light tracking-widest text-white/40">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Contenido */}
      <div className="relative z-10 w-full px-8 pb-16 md:px-16 md:pb-20">
        <p className="mb-3 text-xs font-medium tracking-widest text-white/60 uppercase">
          {proyecto.ubicacion}
        </p>
        <h2 className="mb-4 text-5xl font-light tracking-wider text-white md:text-7xl">
          {proyecto.nombre}
        </h2>
        <p className="mb-8 text-base font-light text-white/70">
          Desde{' '}
          <span className="font-semibold text-[#C6A665]">
            USD ${proyecto.precioDesde.toLocaleString('es-UY')}
          </span>
        </p>
        <Link
          href={`/chacras-${proyecto.slug}`}
          className="inline-block border border-white px-8 py-4 text-xs font-semibold tracking-widest text-white uppercase transition-all duration-300 hover:bg-white hover:text-[#0A0A0A]"
        >
          Ver proyecto
        </Link>
      </div>
    </motion.section>
  )
}
