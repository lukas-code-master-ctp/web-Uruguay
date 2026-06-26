'use client'

import { motion } from 'framer-motion'
import InteractiveEmbed from '@/components/shared/InteractiveEmbed'

interface Props {
  puntos: string[]
  nombre: string
  ubicacion: string
  mapEmbed: string | null
  claro?: boolean
}

export default function NearbyPoints({ puntos, nombre, ubicacion, mapEmbed, claro = false }: Props) {
  const accent = claro ? 'text-[#9a6642]' : 'text-[#C6A665]'
  const tituloIzq = claro ? 'text-[#9a6642]' : 'text-[#0A0A0A]'
  const bgDerecha = claro ? 'bg-white' : 'bg-[#0A0A0A]'
  const puntoTexto = claro ? 'text-[#0A0A0A]/80' : 'text-white/80'
  const puntoBorde = claro ? 'border-[#0A0A0A]/10' : 'border-white/10'

  return (
    <section id="ubicacion">

      {/* Split: editorial izquierda / lista derecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">

        {/* Columna izquierda — fondo crema, texto editorial */}
        <div className="bg-[#F5F0E8] flex items-center px-10 py-20 md:px-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-sm"
          >
            <p className={`mb-6 text-[15px] font-medium tracking-[0.35em] ${accent} uppercase`}>
              Ubicación
            </p>
            <h2 className={`text-3xl font-light leading-snug tracking-wide ${tituloIzq} md:text-4xl lg:text-5xl`}>
              En el corazón del<br />litoral uruguayo
            </h2>
            <p className="mt-4 text-xs font-medium tracking-widest text-[#0A0A0A]/40 uppercase">
              {nombre} · {ubicacion}
            </p>
          </motion.div>
        </div>

        {/* Columna derecha — lista de puntos */}
        <div className={`${bgDerecha} flex items-center px-10 py-20 md:px-16 md:py-24`}>
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
                className={`flex items-baseline gap-4 border-b ${puntoBorde} py-5`}
              >
                <span className={`text-[15px] font-medium tracking-widest ${accent} uppercase w-5 flex-shrink-0`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`text-sm font-light tracking-wide ${puntoTexto}`}>
                  {punto}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Mapa a sangre */}
      {mapEmbed && (
        <InteractiveEmbed
          src={mapEmbed}
          title={`Ubicación ${nombre}`}
          height={480}
        />
      )}

    </section>
  )
}
