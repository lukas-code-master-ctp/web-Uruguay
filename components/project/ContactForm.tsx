'use client'

import Image from 'next/image'
import { useActionState } from 'react'
import { submitLead } from '@/lib/actions'
import type { TemaProyecto } from '@/lib/proyecto-tema'

interface Props {
  proyectoSlug: string
  proyectoNombre: string
  tema: TemaProyecto
}

const CAMPOS = [
  { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', required: true },
]

const initialState = { success: false, error: null as string | null }

export default function ContactForm({ proyectoSlug, proyectoNombre, tema }: Props) {
  const [state, action, isPending] = useActionState(submitLead, initialState)

  const claro = tema.claro

  // La Martina: fondo verde salvia texturado, campos crema y botón oliva.
  const bg = claro ? 'relative overflow-hidden bg-martina-fondo' : 'bg-[#0A0A0A]'
  const eyebrow = claro ? 'text-martina-grafito/70' : 'text-white/50'
  const titulo = claro ? 'font-marca text-martina-verde' : 'text-white'
  const cuerpo = claro ? 'text-martina-grafito' : 'text-white/70'
  const labelCls = claro ? 'text-martina-grafito' : 'text-white/50'
  const inputCls = claro
    ? 'border-martina-oro/30 bg-martina-crema text-martina-grafito placeholder-martina-grafito/40 focus:border-martina-oro'
    : 'border-white/20 bg-transparent text-white placeholder-white/30 focus:border-white'
  const btnCls = claro
    ? 'border-martina-oro bg-martina-oro text-white hover:bg-martina-oro/85'
    : 'border-white text-white hover:bg-white hover:text-[#0A0A0A]'
  const errorCls = claro ? 'text-red-700' : 'text-red-400'

  const textura = claro && tema.fondo && (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${tema.fondo})` }}
    />
  )

  if (state.success) {
    return (
      <section id="contacto" className={`${bg} px-6 py-20 md:px-16`}>
        {textura}
        <div className="relative max-w-xl">
          <p className={`mb-3 text-xs font-semibold tracking-widest ${eyebrow} uppercase`}>Contacto</p>
          <h2 className={`mb-6 text-3xl font-light tracking-wider ${titulo}`}>¡Mensaje recibido!</h2>
          <p className={`text-sm font-light ${cuerpo}`}>
            Nos comunicaremos contigo a la brevedad para brindarte toda la información sobre {proyectoNombre}.
          </p>
        </div>
      </section>
    )
  }

  const formulario = (
    <div className={claro ? 'w-full' : 'max-w-xl'}>
      {!claro && (
        <p className={`mb-3 text-xs font-semibold tracking-widest ${eyebrow} uppercase`}>Contacto</p>
      )}
      <h2
        className={`mb-10 text-3xl font-light ${titulo} ${
          claro ? 'tracking-[0.15em] uppercase' : 'tracking-wider'
        }`}
      >
        Consulta sobre {proyectoNombre}
      </h2>

      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="proyecto" value={proyectoSlug} />

        {CAMPOS.map(({ name, label, type, required }) => (
          <div key={name}>
            <label htmlFor={`contacto-${name}`} className={`mb-2 block text-xs tracking-widest ${labelCls} uppercase`}>
              {label}
            </label>
            <input
              id={`contacto-${name}`}
              name={name}
              type={type}
              required={required}
              className={`w-full border px-4 py-3 text-sm outline-none transition-colors ${inputCls}`}
            />
          </div>
        ))}

        <div>
          <label htmlFor="contacto-mensaje" className={`mb-2 block text-xs tracking-widest ${labelCls} uppercase`}>
            Mensaje (opcional)
          </label>
          <textarea
            id="contacto-mensaje"
            name="mensaje"
            rows={4}
            className={`w-full border px-4 py-3 text-sm outline-none transition-colors resize-none ${inputCls}`}
            placeholder="¿En qué lote estás interesado?"
          />
        </div>

        {state.error && (
          <p className={`text-xs ${errorCls}`}>{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`mt-2 border px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-colors disabled:opacity-50 ${btnCls}`}
        >
          {isPending ? 'Enviando...' : 'Enviar consulta'}
        </button>
      </form>
    </div>
  )

  if (claro) {
    return (
      <section id="contacto" className={`${bg} px-6 py-20 md:px-16 md:py-24`}>
        {textura}
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {formulario}

          {tema.fotoContacto && (
            <div className="relative aspect-[4/5] w-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={tema.fotoContacto}
                alt={proyectoNombre}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={90}
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className={`${bg} px-6 py-20 md:px-16`}>
      {formulario}
    </section>
  )
}
