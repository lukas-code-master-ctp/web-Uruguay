'use client'

import { motion } from 'framer-motion'

interface Props {
  amenities: string[]
}

export default function Amenities({ amenities }: Props) {
  return (
    <section id="ecosistema" className="bg-[#0F0F0F] px-10 py-20 md:px-16 md:py-28">

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16 max-w-xl"
      >
        <p className="mb-5 text-[10px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
          Ecosistema
        </p>
        <h2 className="text-3xl font-light tracking-wide text-white md:text-4xl lg:text-5xl">
          Servicios &amp; amenities
        </h2>
      </motion.div>

      {/* Grid de amenities */}
      <ul className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 border border-white/10">
        {amenities.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="group flex items-center gap-4 border border-white/5 px-7 py-6 transition-colors duration-300 hover:bg-white/5"
          >
            <span className="h-px w-5 flex-shrink-0 bg-[#C6A665] transition-all duration-300 group-hover:w-8" />
            <span className="text-sm font-light tracking-wide text-white/70 group-hover:text-white/90 transition-colors duration-300">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>

    </section>
  )
}
