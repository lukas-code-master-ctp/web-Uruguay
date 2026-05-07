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
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center max-w-2xl">

        {/* Nombre del proyecto */}
        <h2 className="text-6xl font-light tracking-wide text-white md:text-8xl" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {proyecto.nombre}
        </h2>

        {/* Subtítulo — ubicación */}
        <p className="text-xs font-medium tracking-widest text-white/80 uppercase">
          {proyecto.ubicacion}
        </p>

        {/* Separador */}
        <div className="w-16 border-t border-white/50" />

        {/* Descripción */}
        <p className="text-sm font-light leading-relaxed text-white/80 md:text-base">
          {proyecto.descripcion}
        </p>

        {/* CTA */}
        <Link
          href={`/chacras-${proyecto.slug}`}
          className="mt-2 inline-block border border-white px-10 py-4 text-xs font-semibold tracking-widest text-white uppercase transition-all duration-300 hover:bg-white hover:text-[#0A0A0A]"
        >
          Ver proyecto
        </Link>
      </div>
    </motion.section>
  )
}
