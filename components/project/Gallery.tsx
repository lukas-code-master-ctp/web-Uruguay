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

  return (
    <section className="px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-[#2E2E2E] uppercase">Galería</p>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {imagenes.map((src, i) => (
          <motion.div
            key={i}
            className="mb-4 cursor-pointer overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            onClick={() => { setIndex(i); setOpen(true) }}
          >
            <Image
              src={src}
              alt={`Imagen ${i + 1}`}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={imagenes.map((src) => ({ src }))}
      />
    </section>
  )
}
