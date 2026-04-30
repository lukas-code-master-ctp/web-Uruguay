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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
    >
      <Link href={`/parcelas-${proyecto.slug}`} className="group block overflow-hidden bg-[#F5F5F5]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={proyecto.imagenes.hero}
            alt={proyecto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="inline-block border border-white px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase">
              Ver proyecto
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-1 text-xs font-medium tracking-widest text-[#2E2E2E] uppercase">
            {proyecto.ubicacion}
          </p>
          <h3 className="mb-2 text-xl font-light tracking-wider text-[#0A0A0A]">{proyecto.nombre}</h3>
          <p className="text-sm text-[#2E2E2E]">
            Desde{' '}
            <span className="font-semibold text-[#0A0A0A]">
              USD ${proyecto.precioDesde.toLocaleString('es-UY')}
            </span>
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
