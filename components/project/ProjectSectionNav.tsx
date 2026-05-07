'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

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
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState('introduccion')
  const navRef = useRef<HTMLDivElement>(null)

  const secciones = SECCIONES.filter(
    (s) => s.id !== 'masterplan' || tieneMasterplan
  )

  // Mostrar nav al scrollear (mismo comportamiento que el home nav)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      setVisible((prev) => {
        if (!prev && y > vh * 0.85) return true
        if (prev && y < vh * 0.2) return false
        return prev
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    secciones.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
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
    const activeEl = nav.querySelector<HTMLElement>(`[data-id="${activeId}"]`)
    if (!activeEl) return
    const navCenter = nav.offsetWidth / 2
    const elCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2
    nav.scrollTo({ left: elCenter - navCenter, behavior: 'smooth' })
  }, [activeId])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 64
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Frosted glass pill — mismo estilo que el home nav */}
      <div className="mx-4 mt-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-lg shadow-lg md:mx-8">
        <div className="flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="blanco" className="h-8 w-auto" />
          </Link>

          {/* Secciones — scrolleables en mobile */}
          <div
            ref={navRef}
            className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-hide"
          >
            {secciones.map(({ id, label }) => (
              <button
                key={id}
                data-id={id}
                onClick={() => scrollTo(id)}
                className="relative flex-shrink-0 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 md:px-4"
                style={{
                  color: activeId === id
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.55)',
                }}
              >
                {label}
                {activeId === id && (
                  <motion.span
                    layoutId="section-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-white/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Contacto — mismo botón glass del home */}
          <button
            onClick={() => scrollTo('contacto')}
            className="hidden md:inline-block flex-shrink-0 rounded-full border border-white/30 bg-white/15 px-5 py-2 text-[10px] font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white/30"
          >
            Consultar
          </button>
        </div>
      </div>
    </nav>
  )
}
