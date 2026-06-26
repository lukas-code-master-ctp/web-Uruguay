'use client'

import { motion } from 'framer-motion'

export default function ProyectosHeader() {
  return (
    <header className="px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="mb-4 text-[15px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
          Catálogo
        </p>
        <h1 className="text-4xl font-light tracking-wide text-[#0A0A0A] md:text-6xl lg:text-7xl">
          Nuestros proyectos
        </h1>
        <div className="mx-auto mt-8 h-px w-16 bg-[#0A0A0A]/30" />
        <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-[#0A0A0A]/70 md:text-base">
          Chacras seleccionadas en los puntos más exclusivos de Uruguay.
          Cada proyecto, una oportunidad de inversión única.
        </p>
      </motion.div>
    </header>
  )
}
