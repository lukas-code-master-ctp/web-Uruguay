'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { getLenis } from './LenisProvider'

if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual'
}

/**
 * Reset agresivo del scroll, forzando el estado interno de Lenis
 * y el de la ventana, eliminando cualquier animación en curso.
 */
function forceScrollTo(top: number): void {
  // 1. Reset nativo del browser.
  window.scrollTo({ top, left: 0, behavior: 'instant' })
  document.documentElement.scrollTop = top
  document.body.scrollTop = top

  // 2. Reset del estado interno de Lenis.
  const lenis = getLenis()
  if (lenis) {
    if (typeof lenis.stop === 'function') lenis.stop()

    try {
      lenis.animatedScroll = top
      lenis.targetScroll = top
    } catch {}

    lenis.scrollTo(top, { immediate: true, force: true, lock: false })

    if (typeof lenis.start === 'function') lenis.start()
  }
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const timeoutIds = useRef<number[]>([])
  const previousPathname = useRef<string | null>(null)

  // Siempre scrollea a top en cada cambio de ruta — incluyendo back/forward.
  useIsomorphicLayoutEffect(() => {
    const isFirstRun = previousPathname.current === null
    const pathChanged = previousPathname.current !== pathname
    previousPathname.current = pathname

    if (!isFirstRun && !pathChanged) return

    // Reset inmediato — antes del paint.
    forceScrollTo(0)

    // Resets adicionales para sobreescribir cualquier scroll que
    // Next.js o Lenis intenten aplicar después.
    for (const delay of [0, 50, 150, 300]) {
      const id = window.setTimeout(() => forceScrollTo(0), delay)
      timeoutIds.current.push(id)
    }

    return () => {
      timeoutIds.current.forEach(clearTimeout)
      timeoutIds.current = []
    }
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
