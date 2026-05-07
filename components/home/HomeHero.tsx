'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function HomeHero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Video fondo */}
      <video
        src="/proyectos/la-martina/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Contenido */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 px-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        {/* Logo grande */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Logo variant="blanco" className="h-24 w-auto md:h-36" />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          className="text-sm font-medium tracking-[0.3em] text-white/75 uppercase md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Chacras en Punta del Este
        </motion.p>

        {/* Headline principal */}
        <motion.h1
          className="max-w-2xl text-sm font-light leading-relaxed tracking-widest text-white/80 uppercase md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: 'easeOut' }}
        >
          Invierte en el balneario más exclusivo de Sudamérica
        </motion.h1>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Link
            href="#proyectos"
            className="mt-2 inline-block rounded-full border border-white/30 bg-white/15 px-10 py-4 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/30"
          >
            Ver proyectos
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        {/* Mouse icon */}
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/40 p-1">
          <motion.div
            className="h-1.5 w-px rounded-full bg-white/70"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
