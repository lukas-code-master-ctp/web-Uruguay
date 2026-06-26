'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from './Logo'

interface NavProyecto {
  slug: string
  nombre: string
}

interface Props {
  proyectos?: NavProyecto[]
}

// Rutas con tema claro (texto oscuro + glass blanco).
// Cualquier otra ruta usa tema oscuro por defecto.
const LIGHT_THEME_PATHS = new Set(['/proyectos', '/mapa'])

export default function Nav({ proyectos = [] }: Props) {
  const pathname = usePathname()
  const isLightTheme = LIGHT_THEME_PATHS.has(pathname)
  // En home (con hero) el nav aparece tras scrollear; en cualquier otra ruta es siempre visible.
  const isAlwaysVisible = pathname !== '/'
  const [visible, setVisible] = useState(isAlwaysVisible)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  // Mostrar/ocultar nav con histéresis — solo en home (que tiene hero)
  useEffect(() => {
    if (isAlwaysVisible) {
      setVisible(true)
      return
    }
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
  }, [isAlwaysVisible])

  // Scroll-spy: en cada scroll, elige el proyecto cuya sección está más cerca
  // del centro del viewport. Más fiable que múltiples IntersectionObservers
  // que disparan en orden indeterminado.
  useEffect(() => {
    if (proyectos.length === 0) return

    let rafId = 0

    const update = () => {
      const center = window.innerHeight / 2
      let bestSlug: string | null = null
      let bestDistance = Infinity

      for (const { slug } of proyectos) {
        const el = document.getElementById(slug)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Sección debe estar al menos parcialmente visible.
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue

        const sectionCenter = rect.top + rect.height / 2
        const distance = Math.abs(sectionCenter - center)
        if (distance < bestDistance) {
          bestDistance = distance
          bestSlug = slug
        }
      }
      setActiveSlug(bestSlug)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    update() // calcular en mount
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [proyectos])

  // Cierra menú mobile al click fuera
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuOpen])

  // No mostrar en páginas de proyecto — tienen su propio nav
  if (pathname.startsWith('/chacras/')) return null

  // Tokens de color según tema
  const pillClasses = isLightTheme
    ? 'border-black/10 bg-white/70 shadow-sm'
    : 'border-white/20 bg-white/10 shadow-lg'
  const linkBase = isLightTheme ? 'text-[#0A0A0A]/70 hover:text-[#0A0A0A]' : 'text-white/80 hover:text-white'
  const linkActive = isLightTheme ? 'bg-[#0A0A0A]/40' : 'bg-white/60'
  const ctaClasses = isLightTheme
    ? 'border-[#0A0A0A]/20 bg-[#0A0A0A]/5 text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
    : 'border-white/30 bg-white/15 text-white hover:bg-white/30'
  const hamburgerBar = isLightTheme ? 'bg-[#0A0A0A]' : 'bg-white'
  const mobileDivider = isLightTheme ? 'border-[#0A0A0A]/10' : 'border-white/15'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Frosted glass bar */}
      <div className={`mx-4 mt-3 rounded-2xl border px-6 py-3 backdrop-blur-lg md:mx-8 ${pillClasses}`}>
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Logo variant={isLightTheme ? 'negro' : 'blanco'} className="h-10 w-auto" />
          </div>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {proyectos.map((p) => (
              <Link
                key={p.slug}
                href={`/chacras/${p.slug}`}
                className={`relative pb-1 text-[12px] font-medium tracking-widest uppercase transition-colors ${linkBase}`}
              >
                {p.nombre}
                {activeSlug === p.slug && (
                  <motion.span
                    layoutId="nav-underline"
                    className={`absolute bottom-0 left-0 right-0 h-px ${linkActive}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            <Link
              href="/mapa"
              className={`text-[12px] font-medium tracking-widest uppercase transition-colors ${linkBase}`}
            >
              Mapa
            </Link>
            <Link
              href="/#contacto"
              className={`rounded-full border px-5 py-2 text-[12px] font-semibold tracking-widest uppercase backdrop-blur-md transition-all ${ctaClasses}`}
            >
              Contacto
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            className="flex md:hidden flex-col gap-1.5 p-1"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            aria-label="Menú"
          >
            <span className={`block h-px w-5 transition-transform duration-300 ${hamburgerBar} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-px w-5 transition-opacity duration-300 ${hamburgerBar} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-5 transition-transform duration-300 ${hamburgerBar} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Menú mobile desplegable */}
        {menuOpen && (
          <div
            className={`mt-4 flex flex-col gap-4 border-t pt-4 md:hidden ${mobileDivider}`}
            onClick={(e) => e.stopPropagation()}
          >
            {proyectos.map((p) => (
              <Link
                key={p.slug}
                href={`/chacras/${p.slug}`}
                className={`text-[12px] font-medium tracking-widest uppercase transition-colors ${
                  activeSlug === p.slug
                    ? isLightTheme ? 'text-[#0A0A0A]' : 'text-white'
                    : linkBase
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {p.nombre}
              </Link>
            ))}
            <Link
              href="/mapa"
              className={`text-[12px] font-medium tracking-widest uppercase ${linkBase}`}
              onClick={() => setMenuOpen(false)}
            >
              Mapa
            </Link>
            <Link
              href="/#contacto"
              className={`text-[12px] font-medium tracking-widest uppercase ${linkBase}`}
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
