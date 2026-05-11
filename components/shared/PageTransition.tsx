'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const STORAGE_KEY = (url: string) => `scroll:${url}`

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBack   = useRef(false)
  const prevPath = useRef(pathname)

  // Tomar control total del scroll — desactivar restauración automática del browser
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  // Detectar back/forward antes del re-render
  useEffect(() => {
    const onPopstate = () => { isBack.current = true }
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  // Guardar posición en tiempo real
  useEffect(() => {
    const save = () =>
      sessionStorage.setItem(STORAGE_KEY(pathname), String(window.scrollY))
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [pathname])

  // Resetear o restaurar scroll cuando cambia la ruta
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    if (isBack.current) {
      const saved = sessionStorage.getItem(STORAGE_KEY(pathname))
      window.scrollTo({ top: saved ? parseInt(saved, 10) : 0, behavior: 'instant' })
      isBack.current = false
    } else {
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
