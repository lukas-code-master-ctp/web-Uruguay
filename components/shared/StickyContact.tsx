'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StickyContact() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between bg-[#0A0A0A]/95 px-6 py-4 backdrop-blur-sm md:px-12">
      <p className="text-xs font-light text-white/70 hidden sm:block">
        ¿Te interesa este proyecto?
      </p>
      <Link
        href="#contacto"
        className="ml-auto rounded-full border border-white/30 bg-white/15 px-6 py-3 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/30"
      >
        Consultar ahora
      </Link>
    </div>
  )
}
