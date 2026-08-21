'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Proyecto } from '@/lib/types'
import type { TemaProyecto } from '@/lib/proyecto-tema'
import EstadoRibbon from '@/components/shared/EstadoRibbon'

interface Props {
  proyecto: Proyecto
  tema: TemaProyecto
}

/**
 * Parte el claim del hero en dos líneas; la segunda se muestra en mayúsculas.
 * Respeta un salto de línea explícito en `descripcion_preview` de la Sheet y,
 * si no lo hay, corta antes del último " en "
 * ("Donde la inversión se transforma" / "EN CALIDAD DE VIDA").
 */
export function partirClaim(texto: string): [string, string] {
  const salto = texto.indexOf('\n')
  if (salto !== -1) return [texto.slice(0, salto).trim(), texto.slice(salto + 1).trim()]

  const corte = texto.toLowerCase().lastIndexOf(' en ')
  if (corte > 0) return [texto.slice(0, corte).trim(), texto.slice(corte + 1).trim()]

  return [texto.trim(), '']
}

export default function ProjectHero({ proyecto, tema }: Props) {
  const irAIntroduccion = () =>
    document.getElementById('introduccion')?.scrollIntoView({ behavior: 'smooth' })

  const claim = proyecto.descripcionPreview || proyecto.descripcion

  // Variante editorial (La Martina): marca arriba a la izquierda, claim a la
  // derecha y foto sin velo oscuro — solo degradados suaves para la lectura.
  if (tema.claro) {
    const [linea1, linea2] = partirClaim(claim)

    return (
      <section className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
        <Image
          src={proyecto.imagenes.hero}
          alt={proyecto.nombre}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />

        {/* Degradados de lectura, sin oscurecer el centro de la foto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-transparent" />

        {proyecto.proximamente && <EstadoRibbon label="Próximamente" />}

        {/* Marca */}
        <motion.div
          className="absolute top-8 left-8 z-10 md:top-12 md:left-14"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <p className="font-marca text-4xl font-light tracking-[0.1em] text-white uppercase md:text-6xl">
            {proyecto.nombre}
          </p>
          {tema.bajada && (
            <p className="mt-1 text-[11px] font-light tracking-[0.45em] text-white/85 uppercase md:text-xs">
              {tema.bajada}
            </p>
          )}
        </motion.div>

        {/* Claim */}
        <motion.div
          className="absolute inset-x-8 top-[34%] z-10 text-center md:inset-x-auto md:top-1/2 md:right-16 md:max-w-3xl md:-translate-y-1/2 md:text-right"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
        >
          <h1 className="font-marca text-3xl leading-tight text-white md:text-5xl lg:text-6xl">
            <span className="block font-light">{linea1}</span>
            {linea2 && (
              <span className="block font-light tracking-wide uppercase">{linea2}</span>
            )}
          </h1>
          <p className="mt-4 text-[11px] font-light tracking-[0.2em] text-white/85 uppercase md:text-xs">
            {proyecto.ubicacion}
          </p>
        </motion.div>

        {/* Ver más */}
        <motion.button
          onClick={irAIntroduccion}
          className="absolute top-[76%] left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/40 bg-white/15 px-7 py-[11px] text-[12.6px] font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Ver más
        </motion.button>
      </section>
    )
  }

  return (
    <section
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Imagen de fondo */}
      <Image
        src={proyecto.imagenes.hero}
        alt={proyecto.nombre}
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Franja informativa */}
      {proyecto.proximamente && <EstadoRibbon label="Próximamente" />}

      {/* Contenido centrado — igual que ProjectCard en el home */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center max-w-2xl">

        <h1 className="text-6xl font-light tracking-wide text-white md:text-8xl">
          {proyecto.nombre}
        </h1>

        <p className="text-xs font-medium tracking-widest text-white/80 uppercase">
          {proyecto.ubicacion}
        </p>

        <div className="w-16 border-t border-white/50" />

        <p className="whitespace-pre-line text-sm font-light leading-relaxed text-white/80 md:text-base">
          {claim}
        </p>

        <button
          onClick={irAIntroduccion}
          className="mt-2 rounded-full border border-white/30 bg-white/15 px-10 py-4 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/30"
        >
          Ver más
        </button>
      </div>

      {/* Precio — esquina inferior derecha, fade suave */}
      <motion.div
        className="absolute bottom-8 right-20 z-10 text-right md:right-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.4, ease: 'easeOut' }}
      >
        <p className="text-[15px] font-medium tracking-[0.25em] text-white/40 uppercase mb-1">
          Precio desde
        </p>
        <p className="text-2xl font-light tracking-wide text-white/30 md:text-3xl">
          USD ${proyecto.precioDesde.toLocaleString('es-UY')}
        </p>
      </motion.div>
    </section>
  )
}
