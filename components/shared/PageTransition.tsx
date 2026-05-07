'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  // Asegurar que la página empiece desde el tope
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

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
