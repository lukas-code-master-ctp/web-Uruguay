'use client'

import { motion } from 'framer-motion'
import Logo from '@/components/ui/Logo'

export default function HomeHero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      <video
        src="/proyectos/la-martina/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Logo variant="blanco" className="mb-2" />
        <p className="text-sm font-light tracking-widest text-white/80 uppercase">
          Chacras en Uruguay
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-xs tracking-widest text-white/60 uppercase">Explorar</span>
        <motion.div
          className="h-8 w-px bg-white/40"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  )
}
