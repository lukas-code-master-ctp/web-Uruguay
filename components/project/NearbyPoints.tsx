'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import InteractiveEmbed from '@/components/shared/InteractiveEmbed'
import type { TemaProyecto } from '@/lib/proyecto-tema'

interface Props {
  puntos: string[]
  nombre: string
  ubicacion: string
  mapEmbed: string | null
  tema: TemaProyecto
}

export default function NearbyPoints({ puntos, nombre, ubicacion, mapEmbed, tema }: Props) {
  const claro = tema.claro

  const accent = claro ? 'text-martina-oro' : 'text-[#C6A665]'
  const eyebrow = claro ? 'text-martina-grafito/70' : 'text-[#C6A665]'
  // Meganté no tiene cursiva; con font-marca el navegador la sintetizaría mal.
  const tituloIzq = claro ? 'font-marca text-martina-verde' : 'text-[#0A0A0A]'
  const bgIzquierda = claro ? 'bg-white' : 'bg-[#F5F0E8]'
  const bgDerecha = claro ? 'bg-white' : 'bg-[#0A0A0A]'
  const puntoTexto = claro ? 'text-martina-grafito' : 'text-white/80'
  const puntoBorde = claro ? 'border-transparent' : 'border-white/10'
  const subtitulo = claro ? 'text-martina-grafito/70' : 'text-[#0A0A0A]/40'

  return (
    <section id="ubicacion">

      {/* Plano de lotes — abre la sección */}
      {tema.planoLotes && (
        <motion.div
          className="bg-white px-6 pt-20 pb-4 md:px-16 md:pt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={tema.planoLotes.src}
            alt={`Plano de lotes de ${nombre}`}
            width={tema.planoLotes.ancho}
            height={tema.planoLotes.alto}
            sizes="(max-width: 768px) 100vw, 80vw"
            quality={90}
            className="mx-auto h-auto w-full max-w-6xl"
          />
        </motion.div>
      )}

      {/* Split: editorial izquierda / lista derecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">

        {/* Columna izquierda — texto editorial */}
        <div className={`${bgIzquierda} flex items-center px-10 py-20 md:px-16 md:py-24`}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-sm"
          >
            <p className={`mb-6 text-[15px] font-medium tracking-[0.35em] ${eyebrow} uppercase`}>
              Ubicación
            </p>
            <h2 className={`text-3xl font-light leading-snug tracking-wide ${tituloIzq} md:text-4xl lg:text-5xl`}>
              En el corazón del<br />litoral uruguayo
            </h2>
            <p className={`mt-4 text-xs font-medium tracking-widest ${subtitulo} uppercase`}>
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
            className={`w-full space-y-0 ${claro ? 'border-l border-martina-oro/60 pl-10' : ''}`}
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
