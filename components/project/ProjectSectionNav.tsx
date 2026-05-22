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
  const [menuOpen, setMenuOpen] = useState(false)
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

  // Centrar link activo en desktop (la lista horizontal solo existe en md+)
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

  // Cierra el menú mobile al click fuera
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuOpen])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
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
  const hamburgerBar  = isLight ? 'bg-black' : 'bg-white'
  const mobileDivider = isLight ? 'border-black/10' : 'border-white/15'

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
            <Logo variant={isLight ? 'negro' : 'blanco'} className="h-10 w-auto" />
            <span className={`hidden h-5 w-px flex-shrink-0 md:block ${isLight ? 'bg-black/15' : 'bg-white/20'}`} />
          </div>

          {/* Secciones (desktop) */}
          <div
            ref={navRef}
            className="hidden flex-1 items-center gap-1 overflow-x-auto scrollbar-hide md:flex"
          >
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

          {/* Spacer mobile para empujar el hamburger a la derecha */}
          <div className="flex-1 md:hidden" />

          {/* Botón Consultar (desktop) */}
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className={`hidden md:inline-block flex-shrink-0 rounded-full border px-5 py-2 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md transition-all duration-300 ${btnCta}`}
          >
            Consultar
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="flex flex-col gap-1.5 p-1 md:hidden"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            <span className={`block h-px w-5 transition-transform duration-300 ${hamburgerBar} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-px w-5 transition-opacity duration-300 ${hamburgerBar} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-5 transition-transform duration-300 ${hamburgerBar} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Menú desplegable mobile */}
        {menuOpen && (
          <div
            className={`mt-4 flex flex-col gap-4 border-t pt-4 md:hidden ${mobileDivider}`}
            onClick={(e) => e.stopPropagation()}
          >
            {secciones.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-xs font-medium tracking-[0.2em] uppercase transition-colors"
                style={{ color: activeId === id ? textActive : textInactive }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false)
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`mt-1 self-start rounded-full border px-5 py-2 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-md transition-all ${btnCta}`}
            >
              Consultar
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
