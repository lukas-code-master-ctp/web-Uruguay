'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Logo from '@/components/ui/Logo'

const SECCIONES = [
  { id: 'introduccion', label: 'Introducción',   visible: true  },
  { id: 'ubicacion',    label: 'Ubicación',      visible: true  },
  { id: 'masterplan',   label: 'Masterplan',     visible: true  },
  { id: 'galeria',      label: 'Galería',        visible: true  },
  { id: 'calculadora',  label: 'Financiamiento', visible: true  },
  { id: 'contacto',     label: 'Contacto',       visible: false }, // spy only
]

interface Props {
  tieneMasterplan: boolean
}

/** Recorre el árbol DOM desde un elemento hacia arriba buscando el primer
 *  background-color no transparente. Devuelve la luminancia (0–1). */
function getLuminanceBehindNav(): number | null {
  const cx = window.innerWidth / 2
  const cy = 40 // centro vertical aproximado del nav

  const stack = document.elementsFromPoint(cx, cy)

  for (const el of stack) {
    // Ignorar el nav y sus hijos
    if ((el as HTMLElement).closest?.('nav')) continue

    let node: HTMLElement | null = el as HTMLElement
    while (node && node.tagName !== 'HTML') {
      const bg = getComputedStyle(node).backgroundColor
      // Descartar transparentes
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/[\d.]+/g)
        if (m && m.length >= 3) {
          const r = +m[0], g = +m[1], b = +m[2]
          return (0.299 * r + 0.587 * g + 0.114 * b) / 255
        }
      }
      node = node.parentElement
    }
  }
  // Sin color encontrado → asumir claro (blanco body por defecto)
  return 1
}

export default function ProjectSectionNav({ tieneMasterplan }: Props) {
  const [visible, setVisible]   = useState(false)
  const [activeId, setActiveId] = useState('introduccion')
  const [isLight, setIsLight]   = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  // Todas las secciones para el scroll-spy (incluye contacto)
  const seccionesSpy = SECCIONES.filter(
    (s) => s.id !== 'masterplan' || tieneMasterplan
  )
  // Solo las visibles para renderizar en el nav
  const secciones = seccionesSpy.filter((s) => s.visible)

  /** Comprueba el color detrás del nav y actualiza isLight */
  const detectBg = useCallback(() => {
    const lum = getLuminanceBehindNav()
    if (lum !== null) setIsLight(lum > 0.5)
  }, [])

  // Mostrar/ocultar + detectar fondo en cada scroll
  useEffect(() => {
    const onScroll = () => {
      const y  = window.scrollY
      const vh = window.innerHeight

      setVisible(prev => {
        if (!prev && y > vh * 0.85) return true
        if (prev  && y < vh * 0.2)  return false
        return prev
      })

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(detectBg)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [detectBg])

  // Scroll-spy
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    seccionesSpy.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id)
            requestAnimationFrame(detectBg)
          }
        },
        { rootMargin: '-5% 0px -85% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tieneMasterplan, detectBg])

  // Centrar link activo en mobile
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const activeEl = nav.querySelector<HTMLElement>(`[data-id="${activeId}"]`)
    if (!activeEl) return
    nav.scrollTo({
      left: activeEl.offsetLeft + activeEl.offsetWidth / 2 - nav.offsetWidth / 2,
      behavior: 'smooth',
    })
  }, [activeId])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 64,
      behavior: 'smooth',
    })
  }

  // Tokens de color dinámicos
  const pill        = isLight
    ? 'border-black/15 bg-white/60 shadow-sm'
    : 'border-white/20 bg-white/10 shadow-lg'
  const textActive   = isLight ? 'rgba(0,0,0,0.85)'  : 'rgba(255,255,255,0.95)'
  const textInactive = isLight ? 'rgba(0,0,0,0.40)'  : 'rgba(255,255,255,0.55)'
  const underline    = isLight ? 'bg-black/50'        : 'bg-white/60'
  const btnCta       = isLight
    ? 'border-black/20 bg-black/5 text-black hover:bg-black/10'
    : 'border-white/30 bg-white/15 text-white hover:bg-white/30'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`mx-4 mt-3 rounded-2xl border px-4 py-3 backdrop-blur-lg transition-all duration-500 md:mx-8 ${pill}`}
      >
        <div className="flex items-center gap-4">

          {/* Logo */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <Logo variant={isLight ? 'negro' : 'blanco'} className="h-9 w-auto" />
            <span className={`h-5 w-px flex-shrink-0 ${isLight ? 'bg-black/15' : 'bg-white/20'}`} />
          </div>

          {/* Secciones */}
          <div ref={navRef} className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-hide">
            {secciones.map(({ id, label }) => (
              <button
                key={id}
                data-id={id}
                onClick={() => scrollTo(id)}
                className="relative flex-shrink-0 px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 md:px-4"
                style={{ color: activeId === id ? textActive : textInactive }}
              >
                {label}
                {activeId === id && (
                  <motion.span
                    layoutId="section-underline"
                    className={`absolute bottom-0 left-0 right-0 h-px ${underline}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Botón Consultar */}
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className={`hidden md:inline-block flex-shrink-0 rounded-full border px-5 py-2 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md transition-all duration-300 ${btnCta}`}
          >
            Consultar
          </button>
        </div>
      </div>
    </nav>
  )
}
