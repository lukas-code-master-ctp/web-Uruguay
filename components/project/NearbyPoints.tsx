'use client'

import { motion } from 'framer-motion'

interface Props {
  puntos: string[]
}

export default function NearbyPoints({ puntos }: Props) {
  return (
    <section className="bg-[#0A0A0A] px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-white/50 uppercase">Entorno</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puntos.map((punto, i) => (
          <motion.div
            key={punto}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border-b border-white/10 pb-4"
          >
            <p className="text-sm font-light text-white">{punto}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
