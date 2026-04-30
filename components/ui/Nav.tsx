'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <Logo variant={scrolled ? 'negro' : 'blanco'} />
      <Link
        href="#contacto"
        className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
          scrolled ? 'text-black hover:text-[#C6A665]' : 'text-white hover:text-[#C6A665]'
        }`}
      >
        Contacto
      </Link>
    </nav>
  )
}
