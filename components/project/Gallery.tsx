'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Props {
  portada: string
  imagenes: string[]
}

export default function Gallery({ portada, imagenes }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Lightbox: la portada va primero, luego las fotos del grid.
  const slides = [portada, ...imagenes]

  const open_ = (i: number) => { setIndex(i); setOpen(true) }

  return (
    <section id="galeria">

      {/* Portada de galería — a sangre, pantalla completa */}
      {portada && (
        <motion.div
          className="relative h-[70vh] w-full cursor-pointer overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => open_(0)}
        >
          <Image
            src={portada}
            alt="Galería"
            fill
            sizes="100vw"
            quality={90}
            priority
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/15" />
          {/* Etiqueta */}
          <div className="absolute bottom-6 left-8 md:left-12">
            <p className="text-[15px] font-medium tracking-[0.35em] text-white/60 uppercase">
              Galería
            </p>
          </div>
        </motion.div>
      )}

      {/* Fotos — grid de 3 columnas */}
      {imagenes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3">
          {imagenes.map((src, i) => (
            <motion.div
              key={src}
              className="relative aspect-[3/2] cursor-pointer overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              onClick={() => open_(i + 1)}
            >
              <Image
                src={src}
                alt={`Galería ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                quality={90}
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides.map((src) => ({ src }))}
      />
    </section>
  )
}
