'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { getLenis } from './LenisProvider'

// Flag a nivel de módulo — sobrevive remounts del componente.
// popstate se dispara ANTES de que la nueva página monte,
// así que la nueva instancia del componente lo leerá correctamente.
let pendingBack = false

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => { pendingBack = true })
  history.scrollRestoration = 'manual'
}

const scrollKey = (url: string) => `scroll:${url}`

/**
 * Scroll inmediato (sin animación) compatible con Lenis.
 * Si Lenis está activo, lo usa; si no, cae a window.scrollTo.
 */
function instantScrollTo(top: number): void {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(top, { immediate: true, force: true })
  } else {
    window.scrollTo({ top, left: 0, behavior: 'instant' })
  }
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const rafIds = useRef<number[]>([])

  // Ejecuta una sola vez al montar (= cada vez que carga una página nueva)
  useEffect(() => {
    // Doble RAF: el primero deja que Lenis se inicialice/sincronice,
    // el segundo asegura que nuestro scroll corre después de cualquier scroll automático.
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        if (pendingBack) {
          pendingBack = false
          const saved = sessionStorage.getItem(scrollKey(pathname))
          instantScrollTo(saved ? parseInt(saved, 10) : 0)
        } else {
          instantScrollTo(0)
        }
      })
      rafIds.current.push(id2)
    })
    rafIds.current.push(id1)

    return () => {
      rafIds.current.forEach(cancelAnimationFrame)
      rafIds.current = []
    }
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
