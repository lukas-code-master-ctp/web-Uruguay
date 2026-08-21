'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { miniaturaYoutube } from '@/lib/proyecto-tema'

interface Props {
  nombre: string
  youtubeId: string
  datos?: { label: string; valor: string }[]
}

/**
 * Sección de video: la miniatura de YouTube hace de fondo a sangre y el
 * reproductor va encima. El iframe recién se monta al hacer click, así la
 * página no carga scripts de YouTube hasta que el usuario los pide.
 */
export default function VideoShowcase({ nombre, youtubeId, datos = [] }: Props) {
  const [reproduciendo, setReproduciendo] = useState(false)
  const [miniatura, setMiniatura] = useState(miniaturaYoutube(youtubeId))

  // maxresdefault no existe para todos los videos; hqdefault siempre está.
  const alFallarMiniatura = () =>
    setMiniatura(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)

  return (
    <section id="video" className="relative overflow-hidden bg-[#0A0A0A]">

      {/* Fondo — la misma imagen que la miniatura del video */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={miniatura}
          alt=""
          aria-hidden
          onError={alFallarMiniatura}
          className="h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/35" />
      </div>

      <div className="relative px-8 py-12 md:px-14 md:py-16">

        {/* Encabezado: marca + datos destacados */}
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
          <p className="font-marca text-4xl font-light tracking-[0.1em] text-white uppercase md:text-6xl">
            {nombre}
          </p>

          {datos.length > 0 && (
            <div className="flex items-center divide-x divide-white/40">
              {datos.map(({ label, valor }) => (
                <div key={label} className="px-7 first:pl-0 last:pr-0">
                  <p className="text-xs font-light tracking-[0.2em] text-white/85 uppercase">
                    {label}
                  </p>
                  <p className="text-2xl font-light tracking-wide text-white md:text-3xl">
                    {valor}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reproductor */}
        <motion.div
          className="mx-auto mt-10 w-full max-w-4xl md:mt-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative aspect-video overflow-hidden shadow-2xl ring-1 ring-white/25">
            {reproduciendo ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={`Video de ${nombre}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setReproduciendo(true)}
                aria-label={`Reproducir el video de ${nombre}`}
                className="group absolute inset-0 h-full w-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={miniatura}
                  alt=""
                  aria-hidden
                  onError={alFallarMiniatura}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                <span className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7 text-white" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
