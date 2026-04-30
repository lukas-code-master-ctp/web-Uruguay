'use client'

import { motion } from 'framer-motion'

interface Props {
  destacados: string[]
}

const ICONS = ['◈', '◇', '◉']

export default function ValueProps({ destacados }: Props) {
  return (
    <section className="border-b border-[#D9D9D9] px-6 py-16 md:px-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {destacados.slice(0, 3).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="flex flex-col gap-3"
          >
            <span className="text-2xl text-[#C6A665]">{ICONS[i]}</span>
            <p className="text-base font-light tracking-wide text-[#0A0A0A]">{item}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
