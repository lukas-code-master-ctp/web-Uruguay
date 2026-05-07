'use client'

import { motion } from 'framer-motion'

interface Props {
  puntos: string[]
  nombre: string
  ubicacion: string
}

export default function NearbyPoints({ puntos, nombre, ubicacion }: Props) {
  return (
    <section id="ubicacion" className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">

      {/* Columna izquierda — fondo crema, texto editorial */}
      <div className="bg-[#F5F0E8] flex items-center px-10 py-20 md:px-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-sm"
        >
          <p className="mb-6 text-[10px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
            Ubicación
          </p>
          <h2 className="text-3xl font-light leading-snug tracking-wide text-[#0A0A0A] md:text-4xl lg:text-5xl">
            En el corazón del<br />litoral uruguayo
          </h2>
          <p className="mt-4 text-xs font-medium tracking-widest text-[#0A0A0A]/40 uppercase">
            {nombre} · {ubicacion}
          </p>
        </motion.div>
      </div>

      {/* Columna derecha — fondo oscuro, lista de puntos */}
      <div className="bg-[#0A0A0A] flex items-center px-10 py-20 md:px-16 md:py-24">
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full space-y-0"
        >
          {puntos.map((punto, i) => (
            <motion.li
              key={punto}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-baseline gap-4 border-b border-white/10 py-5"
            >
              <span className="text-[10px] font-medium tracking-widest text-[#C6A665] uppercase w-5 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-light tracking-wide text-white/80">
                {punto}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

    </section>
  )
}
