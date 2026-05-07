'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

interface NavProyecto {
  slug: string
  nombre: string
}

interface Props {
  proyectos?: NavProyecto[]
}

export default function Nav({ proyectos = [] }: Props) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Cierra el menú mobile al hacer click fuera
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuOpen])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Frosted glass bar */}
      <div className="mx-4 mt-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-lg shadow-lg md:mx-8">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="blanco" className="h-8 w-auto" />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {proyectos.map((p) => (
              <Link
                key={p.slug}
                href={`/chacras-${p.slug}`}
                className="text-xs font-medium tracking-widest text-white/80 uppercase transition-colors hover:text-white"
              >
                {p.nombre}
              </Link>
            ))}
          </div>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            <Link
              href="/mapa"
              className="text-xs font-medium tracking-widest text-white/80 uppercase transition-colors hover:text-white"
            >
              Mapa
            </Link>
            <Link
              href="/#contacto"
              className="rounded-full border border-white/30 bg-white/15 px-5 py-2 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white/30"
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
            <span className={`block h-px w-5 bg-white transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-5 bg-white transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Menú mobile desplegable */}
        {menuOpen && (
          <div
            className="mt-4 flex flex-col gap-4 border-t border-white/15 pt-4 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {proyectos.map((p) => (
              <Link
                key={p.slug}
                href={`/chacras-${p.slug}`}
                className="text-xs font-medium tracking-widest text-white/80 uppercase"
                onClick={() => setMenuOpen(false)}
              >
                {p.nombre}
              </Link>
            ))}
            <Link
              href="/mapa"
              className="text-xs font-medium tracking-widest text-white/80 uppercase"
              onClick={() => setMenuOpen(false)}
            >
              Mapa
            </Link>
            <Link
              href="/#contacto"
              className="text-xs font-medium tracking-widest text-white/80 uppercase"
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
