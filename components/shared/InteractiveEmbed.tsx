'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  title: string
  height?: number
  className?: string
  ctaLabel?: string
}

/**
 * Iframe con overlay clickeable. Mientras no está "activo", el overlay bloquea
 * cualquier interacción con el iframe (incluyendo wheel events) y el scroll
 * pasa al body como en cualquier sección. Al clickear se activa el iframe y
 * se evita el scroll de la página (Lenis). Se desactiva si el usuario hace
 * click afuera o si la sección sale del viewport.
 */
export default function InteractiveEmbed({
  src,
  title,
  height = 480,
  className = '',
  ctaLabel = 'Click para interactuar',
}: Props) {
  const [active, setActive] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
    <div
      ref={wrapperRef}
      {...(active ? { 'data-lenis-prevent': '' } : {})}
      className={`relative w-full overflow-hidden ${className}`}
    >
      <iframe
        src={src}
        title={title}
        width="100%"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        className="block border-0"
      />

      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/0 transition-colors hover:bg-black/20 focus:outline-none"
          aria-label={ctaLabel}
        >
          <span className="rounded-full border border-white/40 bg-white/15 px-6 py-3 text-[10px] font-semibold tracking-[0.25em] text-white uppercase backdrop-blur-md transition-all hover:bg-white/25">
            {ctaLabel}
          </span>
        </button>
      )}
    </div>
  )
}
