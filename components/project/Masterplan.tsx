'use client'

import { motion } from 'framer-motion'
import InteractiveEmbed from '@/components/shared/InteractiveEmbed'

interface Props {
  src: string
  claro?: boolean
}

export default function Masterplan({ src, claro = false }: Props) {
  const bg = claro ? 'bg-[#F5F0E8]' : 'bg-[#0A0A0A]'
  const accent = claro ? 'text-[#9a6642]' : 'text-[#C6A665]'
  const titulo = claro ? 'text-[#9a6642]' : 'text-white'

  return (
    <section id="masterplan" className={bg}>

      {/* Encabezado editorial */}
      <div className="px-10 pt-20 pb-10 md:px-16 md:pt-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className={`mb-4 text-[15px] font-medium tracking-[0.35em] ${accent} uppercase`}>
            Masterplan
          </p>
          <h2 className={`text-3xl font-light leading-snug tracking-wide ${titulo} md:text-4xl lg:text-5xl`}>
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
