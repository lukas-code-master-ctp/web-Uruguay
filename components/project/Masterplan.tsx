'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  src: string
}

export default function Masterplan({ src }: Props) {
  const [active, setActive] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Desactivar la interacción si el usuario clickea fuera del masterplan
  // o si la sección sale del viewport (scrollea lejos).
  useEffect(() => {
    if (!active) return

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setActive(false)
      }
    }

    const handleVisibility = () => {
      const el = wrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleVisibility, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleVisibility)
    }
  }, [active])

  return (
    <section id="masterplan" className="bg-[#0A0A0A]">

      {/* Encabezado editorial */}
      <div className="px-10 pt-20 pb-10 md:px-16 md:pt-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[10px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
            Masterplan
          </p>
          <h2 className="text-3xl font-light leading-snug tracking-wide text-white md:text-4xl lg:text-5xl">
            Plano del proyecto
          </h2>
        </motion.div>
      </div>

      {/* Iframe a sangre */}
      <motion.div
        ref={wrapperRef}
        // Cuando el masterplan está activo, Lenis no debe scrollear la página.
        {...(active ? { 'data-lenis-prevent': '' } : {})}
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <iframe
          src={src}
          title="Masterplan del proyecto"
          width="100%"
          height="600"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
          className="block border-0"
        />

        {/* Overlay: bloquea interacción hasta que el usuario haga click.
            Mientras está visible, el scroll del wheel pasa al body (Lenis). */}
        {!active && (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/0 transition-colors hover:bg-black/20 focus:outline-none"
            aria-label="Activar interacción con el masterplan"
          >
            <span className="rounded-full border border-white/40 bg-white/15 px-6 py-3 text-[10px] font-semibold tracking-[0.25em] text-white uppercase backdrop-blur-md transition-all hover:bg-white/25">
              Click para interactuar
            </span>
          </button>
        )}
      </motion.div>

    </section>
  )
}
