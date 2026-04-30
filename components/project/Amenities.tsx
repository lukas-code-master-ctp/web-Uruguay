'use client'

import { motion } from 'framer-motion'

interface Props {
  amenities: string[]
}

export default function Amenities({ amenities }: Props) {
  return (
    <section className="border-t border-[#D9D9D9] px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-[#2E2E2E] uppercase">Servicios y amenities</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-center gap-3 text-sm text-[#0A0A0A]"
          >
            <span className="h-px w-6 bg-[#C6A665] flex-shrink-0" />
            {item}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
