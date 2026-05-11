'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const STORAGE_KEY = (url: string) => `scroll:${url}`

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const isBack    = useRef(false)

  // Detectar navegación back/forward (popstate se dispara ANTES del re-render)
  useEffect(() => {
    const onPopstate = () => { isBack.current = true }
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  // Guardar posición de scroll en tiempo real
  useEffect(() => {
    const save = () =>
      sessionStorage.setItem(STORAGE_KEY(pathname), String(window.scrollY))
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [pathname])

  // Restaurar o resetear scroll al cambiar de ruta
  // useLayoutEffect para evitar flash visible antes del primer paint
  useLayoutEffect(() => {
    if (isBack.current) {
      // Back / forward → restaurar posición guardada
      const saved = sessionStorage.getItem(STORAGE_KEY(pathname))
      window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, behavior: 'instant' })
      isBack.current = false
    } else {
      // Navegación nueva → siempre al tope
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
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
