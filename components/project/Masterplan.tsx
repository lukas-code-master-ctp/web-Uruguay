'use client'

import { motion } from 'framer-motion'
import InteractiveEmbed from '@/components/shared/InteractiveEmbed'

interface Props {
  src: string
}

export default function Masterplan({ src }: Props) {
  return (
    <section id="masterplan" className="bg-[#0A0A0A]">

      {/* Encabezado editorial */}
      <div className="px-10 pt-20 pb-10 md:px-16 md:pt-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[10px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
            Masterplan
          </p>
          <h2 className="text-3xl font-light leading-snug tracking-wide text-white md:text-4xl lg:text-5xl">
            Plano del proyecto
          </h2>
        </motion.div>
      </div>

      {/* Iframe a sangre */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <InteractiveEmbed
          src={src}
          title="Masterplan del proyecto"
          height={600}
        />
      </motion.div>

    </section>
  )
}
