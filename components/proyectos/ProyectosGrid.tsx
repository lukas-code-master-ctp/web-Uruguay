'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyectos: Proyecto[]
}

export default function ProyectosGrid({ proyectos }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {proyectos.map((p, i) => (
        <ProyectoTile key={p.slug} proyecto={p} index={i} />
      ))}
    </div>
  )
}

function ProyectoTile({ proyecto, index }: { proyecto: Proyecto; index: number }) {
  const isSoldOut = !proyecto.activo

  const card = (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 bg-[#F5F0E8] md:aspect-[16/10] ${
        isSoldOut ? 'cursor-not-allowed' : ''
      }`}
    >
      {/* Imagen de fondo */}
      <Image
        src={proyecto.imagenes.hero}
        alt={proyecto.nombre}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-transform duration-700 ${
          isSoldOut ? 'grayscale' : 'group-hover:scale-105'
        }`}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          isSoldOut
            ? 'bg-black/55'
            : 'bg-gradient-to-b from-black/15 via-black/35 to-black/65'
        }`}
      />

      {/* Badge SOLD OUT */}
      {isSoldOut && (
        <div className="absolute top-5 right-5 z-20 rounded-full border border-white/40 bg-white/15 px-4 py-1.5 text-[10px] font-semibold tracking-[0.3em] text-white uppercase backdrop-blur-md">
          Sold out
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between p-6 text-center md:p-10">
        <span className="block" />

        <div className="flex flex-col items-center gap-2 text-white">
          <h2
            className={`text-3xl font-light tracking-wide md:text-5xl ${
              isSoldOut ? 'opacity-75' : ''
            }`}
          >
            {proyecto.nombre}
          </h2>
          <p
            className={`text-[10px] font-medium tracking-[0.3em] uppercase opacity-80 md:text-xs ${
              isSoldOut ? 'opacity-60' : ''
            }`}
          >
            {proyecto.ubicacion}
          </p>
        </div>

        {/* CTA — solo si activo */}
        {isSoldOut ? (
          <span className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-[10px] font-semibold tracking-[0.25em] text-white/50 uppercase md:text-xs">
            No disponible
          </span>
        ) : (
          <span className="rounded-full border border-white/30 bg-white/15 px-8 py-3 text-[10px] font-semibold tracking-[0.25em] text-white uppercase backdrop-blur-md transition-all duration-300 group-hover:bg-white/30 md:text-xs">
            Ir al proyecto
          </span>
        )}
      </div>
    </motion.article>
  )

  if (isSoldOut) return card

  return (
    <Link href={`/chacras/${proyecto.slug}`} aria-label={`Ver proyecto ${proyecto.nombre}`}>
      {card}
    </Link>
  )
}
