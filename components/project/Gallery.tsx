'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Props {
  imagenes: string[]
}

export default function Gallery({ imagenes }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const [hero, ...rest] = imagenes

  const open_ = (i: number) => { setIndex(i); setOpen(true) }

  return (
    <section id="galeria">

      {/* Primera imagen — a sangre, pantalla completa */}
      {hero && (
        <motion.div
          className="relative h-[70vh] w-full cursor-pointer overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => open_(0)}
        >
          <Image
            src={hero}
            alt="Galería 1"
            fill
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/15" />
          {/* Etiqueta */}
          <div className="absolute bottom-6 left-8 md:left-12">
            <p className="text-[10px] font-medium tracking-[0.35em] text-white/60 uppercase">
              Galería
            </p>
          </div>
        </motion.div>
      )}

      {/* Resto — grid de 2 columnas */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3">
          {rest.map((src, i) => (
            <motion.div
              key={src}
              className="relative aspect-square cursor-pointer overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              onClick={() => open_(i + 1)}
            >
              <Image
                src={src}
                alt={`Galería ${i + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
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
        slides={imagenes.map((src) => ({ src }))}
      />
    </section>
  )
}
