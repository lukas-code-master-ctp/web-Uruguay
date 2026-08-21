'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Props {
  portada: string
  imagenes: string[]
  claro?: boolean
}

export default function Gallery({ portada, imagenes, claro = false }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Lightbox: la portada va primero, luego las fotos del grid.
  const slides = [portada, ...imagenes]

  const open_ = (i: number) => { setIndex(i); setOpen(true) }

  // Variante La Martina: encabezado centrado y fotos contenidas con aire.
  if (claro) {
    return (
      <section id="galeria" className="bg-white px-6 py-20 md:px-16 md:py-24">
        <motion.h2
          className="mb-12 text-center font-marca text-3xl font-light tracking-[0.12em] text-martina-grafito uppercase md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Disfruta de nuestra <span className="text-martina-oro">Galería</span>
        </motion.h2>

        <div className="mx-auto max-w-6xl">
          {portada && (
            <motion.div
              className="relative aspect-[3/2] w-full cursor-pointer overflow-hidden"
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
                sizes="(max-width: 768px) 100vw, 72rem"
                quality={90}
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </motion.div>
          )}

          {imagenes.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
              {imagenes.map((src, i) => (
                <motion.div
                  key={src}
                  className="relative aspect-[16/9] cursor-pointer overflow-hidden"
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
                    sizes="(max-width: 768px) 50vw, 24rem"
                    quality={90}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={slides.map((src) => ({ src }))}
        />
      </section>
    )
  }

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
