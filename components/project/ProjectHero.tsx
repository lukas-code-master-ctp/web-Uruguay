import Image from 'next/image'
import Link from 'next/link'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function ProjectHero({ proyecto }: Props) {
  return (
    <section className="relative flex h-screen w-full items-end overflow-hidden bg-[#0A0A0A]">
      <Image
        src={proyecto.imagenes.hero}
        alt={proyecto.nombre}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      <div className="relative z-10 w-full px-6 pb-16 md:px-16 md:pb-24">
        <p className="mb-3 text-xs font-medium tracking-widest text-white/60 uppercase">
          {proyecto.ubicacion}
        </p>
        <h1 className="mb-4 text-5xl font-light tracking-wider text-white md:text-7xl">
          {proyecto.nombre}
        </h1>
        <p className="mb-8 text-lg font-light text-white/80">
          Desde{' '}
          <span className="font-semibold text-[#C6A665]">
            USD ${proyecto.precioDesde.toLocaleString('es-UY')}
          </span>
        </p>
        <Link
          href="#contacto"
          className="inline-block border border-white px-8 py-4 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:border-[#C6A665] hover:text-[#C6A665]"
        >
          Consultar
        </Link>
      </div>
    </section>
  )
}
