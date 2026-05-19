'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { getLenis } from './LenisProvider'

// Flag a nivel de módulo — sobrevive remounts del componente.
let pendingBack = false

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => { pendingBack = true })
  history.scrollRestoration = 'manual'
}

const scrollKey = (url: string) => `scroll:${url}`

/**
 * Reset agresivo del scroll, forzando el estado interno de Lenis
 * y el de la ventana, eliminando cualquier animación en curso.
 */
function forceScrollTo(top: number): void {
  // 1. Reset nativo del browser (cubre el caso sin Lenis o donde Lenis
  //    todavía no manejó el cambio).
  window.scrollTo({ top, left: 0, behavior: 'instant' })
  document.documentElement.scrollTop = top
  document.body.scrollTop = top

  // 2. Reset del estado interno de Lenis.
  const lenis = getLenis()
  if (lenis) {
    // Detener cualquier animación que estuviera en curso.
    if (typeof lenis.stop === 'function') lenis.stop()

    // Setear las propiedades internas directamente (Lenis las expone)
    // para que el próximo frame del RAF no "tire" hacia el target viejo.
    try {
      lenis.animatedScroll = top
      lenis.targetScroll = top
    } catch {}

    // Llamada explícita inmediata.
    lenis.scrollTo(top, { immediate: true, force: true, lock: false })

    // Re-iniciar el RAF loop.
    if (typeof lenis.start === 'function') lenis.start()
  }
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const rafIds = useRef<number[]>([])
  const previousPathname = useRef<string | null>(null)

  // useLayoutEffect: corre ANTES del primer paint del nuevo path.
  // Esto cubre el caso del cache de App Router donde el componente no remonta.
  useIsomorphicLayoutEffect(() => {
    const isFirstRun = previousPathname.current === null
    const pathChanged = previousPathname.current !== pathname
    previousPathname.current = pathname

    if (!isFirstRun && !pathChanged) return

    // Reset inmediato — antes del paint.
    if (pendingBack) {
      pendingBack = false
      const saved = sessionStorage.getItem(scrollKey(pathname))
      forceScrollTo(saved ? parseInt(saved, 10) : 0)
    } else {
      forceScrollTo(0)
    }

    // Resets adicionales en frames posteriores para sobreescribir
    // cualquier scroll que Next.js o Lenis intenten aplicar después.
    const targets = pendingBack
      ? parseInt(sessionStorage.getItem(scrollKey(pathname)) ?? '0', 10)
      : 0

    for (const delay of [0, 50, 150, 300]) {
      const id = window.setTimeout(() => forceScrollTo(targets), delay)
      rafIds.current.push(id)
    }

    return () => {
      rafIds.current.forEach(clearTimeout)
      rafIds.current = []
    }
  }, [pathname])

  // Guarda la posición de scroll en tiempo real
  useEffect(() => {
    const save = () =>
      sessionStorage.setItem(scrollKey(pathname), String(window.scrollY))
    window.addEventListener('scroll', save, { passive: true })
    // Lenis también expone su propio evento — escucharlo en caso de que
    // los eventos nativos no se disparen.
    const lenis = getLenis()
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', save)
    }
    return () => {
      window.removeEventListener('scroll', save)
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', save)
      }
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
