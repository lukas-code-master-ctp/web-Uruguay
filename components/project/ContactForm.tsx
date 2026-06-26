'use client'

import { useActionState } from 'react'
import { submitLead } from '@/lib/actions'

interface Props {
  proyectoSlug: string
  proyectoNombre: string
  claro?: boolean
}

const initialState = { success: false, error: null as string | null }

export default function ContactForm({ proyectoSlug, proyectoNombre, claro = false }: Props) {
  const [state, action, isPending] = useActionState(submitLead, initialState)

  // La Martina: fondo arena, texto oscuro, acento #9a6642 (sin negro).
  const bg = claro ? 'bg-[#F5F0E8]' : 'bg-[#0A0A0A]'
  const eyebrow = claro ? 'text-[#9a6642]' : 'text-white/50'
  const titulo = claro ? 'text-[#9a6642]' : 'text-white'
  const cuerpo = claro ? 'text-[#0A0A0A]/70' : 'text-white/70'
  const labelCls = claro ? 'text-[#0A0A0A]/50' : 'text-white/50'
  const inputCls = claro
    ? 'border-[#0A0A0A]/20 bg-transparent text-[#0A0A0A] placeholder-[#0A0A0A]/30 focus:border-[#9a6642]'
    : 'border-white/20 bg-transparent text-white placeholder-white/30 focus:border-white'
  const btnCls = claro
    ? 'border-[#9a6642] text-[#9a6642] hover:bg-[#9a6642] hover:text-white'
    : 'border-white text-white hover:bg-white hover:text-[#0A0A0A]'
  const errorCls = claro ? 'text-red-600' : 'text-red-400'

  if (state.success) {
    return (
      <section id="contacto" className={`${bg} px-6 py-20 md:px-16`}>
        <div className="max-w-xl">
          <p className={`mb-3 text-xs font-semibold tracking-widest ${eyebrow} uppercase`}>Contacto</p>
          <h2 className={`mb-6 text-3xl font-light tracking-wider ${titulo}`}>¡Mensaje recibido!</h2>
          <p className={`text-sm font-light ${cuerpo}`}>
            Nos comunicaremos contigo a la brevedad para brindarte toda la información sobre {proyectoNombre}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className={`${bg} px-6 py-20 md:px-16`}>
      <div className="max-w-xl">
        <p className={`mb-3 text-xs font-semibold tracking-widest ${eyebrow} uppercase`}>Contacto</p>
        <h2 className={`mb-10 text-3xl font-light tracking-wider ${titulo}`}>
          Consulta sobre {proyectoNombre}
        </h2>

        <form action={action} className="flex flex-col gap-5">
          <input type="hidden" name="proyecto" value={proyectoSlug} />

          {[
            { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', required: true },
          ].map(({ name, label, type, required }) => (
            <div key={name}>
              <label className={`mb-2 block text-xs tracking-widest ${labelCls} uppercase`}>
                {label}
              </label>
              <input
                name={name}
                type={type}
                required={required}
                className={`w-full border px-4 py-3 text-sm outline-none transition-colors ${inputCls}`}
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-xs tracking-widest text-white/50 uppercase">
              Mensaje (opcional)
            </label>
            <textarea
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
    </section>
  )
}
