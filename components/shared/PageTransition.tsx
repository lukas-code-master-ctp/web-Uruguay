'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

// Flag a nivel de módulo — sobrevive remounts del componente.
// popstate se dispara ANTES de que la nueva página monte,
// así que la nueva instancia del componente lo leerá correctamente.
let pendingBack = false

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => { pendingBack = true })
  history.scrollRestoration = 'manual'
}

const scrollKey = (url: string) => `scroll:${url}`

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Ejecuta una sola vez al montar (= cada vez que carga una página nueva)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (pendingBack) {
        pendingBack = false
        const saved = sessionStorage.getItem(scrollKey(pathname))
        window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Guarda la posición de scroll en tiempo real
  useEffect(() => {
    const save = () =>
      sessionStorage.setItem(scrollKey(pathname), String(window.scrollY))
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [pathname])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
