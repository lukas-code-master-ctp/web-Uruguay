'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SECCIONES = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'ubicacion',    label: 'Ubicación'    },
  { id: 'ecosistema',   label: 'Ecosistema'   },
  { id: 'galeria',      label: 'Galería'      },
  { id: 'masterplan',   label: 'Masterplan'   },
  { id: 'mapa',         label: 'Mapa'         },
  { id: 'contacto',     label: 'Contacto'     },
]

interface Props {
  tieneMasterplan: boolean
}

export default function ProjectSectionNav({ tieneMasterplan }: Props) {
  const [activeId, setActiveId] = useState('introduccion')
  const navRef = useRef<HTMLDivElement>(null)

  const secciones = SECCIONES.filter(
    (s) => s.id !== 'masterplan' || tieneMasterplan
  )

  // Scroll-spy: activa la sección cuyo top entra en el 20% superior del viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    secciones.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: '-5% 0px -85% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tieneMasterplan])

  // Centra el link activo en mobile
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const activeEl = nav.querySelector<HTMLButtonElement>(`[data-id="${activeId}"]`)
    if (!activeEl) return
    const navCenter = nav.offsetWidth / 2
    const elCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2
    nav.scrollTo({ left: elCenter - navCenter, behavior: 'smooth' })
  }, [activeId])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 56 // altura del ProjectSectionNav
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div
        ref={navRef}
        className="flex items-center gap-1 overflow-x-auto px-4 scrollbar-hide md:justify-center md:px-8"
      >
        {secciones.map(({ id, label }) => (
          <button
            key={id}
            data-id={id}
            onClick={() => scrollTo(id)}
            className="relative flex-shrink-0 px-4 py-4 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-200"
            style={{ color: activeId === id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)' }}
          >
            {label}
            {activeId === id && (
              <motion.span
                layoutId="section-underline"
                className="absolute bottom-0 left-0 right-0 h-px bg-white/70"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
