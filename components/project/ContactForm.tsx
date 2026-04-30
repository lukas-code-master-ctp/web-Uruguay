'use client'

import { useActionState } from 'react'
import { submitLead } from '@/lib/actions'

interface Props {
  proyectoSlug: string
  proyectoNombre: string
}

const initialState = { success: false, error: null as string | null }

export default function ContactForm({ proyectoSlug, proyectoNombre }: Props) {
  const [state, action, isPending] = useActionState(submitLead, initialState)

  if (state.success) {
    return (
      <section id="contacto" className="bg-[#0A0A0A] px-6 py-20 md:px-16">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">Contacto</p>
          <h2 className="mb-6 text-3xl font-light tracking-wider text-white">¡Mensaje recibido!</h2>
          <p className="text-sm font-light text-white/70">
            Nos comunicaremos contigo a la brevedad para brindarte toda la información sobre {proyectoNombre}.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="bg-[#0A0A0A] px-6 py-20 md:px-16">
      <div className="max-w-xl">
        <p className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">Contacto</p>
        <h2 className="mb-10 text-3xl font-light tracking-wider text-white">
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
              <label className="mb-2 block text-xs tracking-widest text-white/50 uppercase">
                {label}
              </label>
              <input
                name={name}
                type={type}
                required={required}
                className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors"
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
              className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors resize-none"
              placeholder="¿En qué lote estás interesado?"
            />
          </div>

          {state.error && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 border border-white px-8 py-4 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-[#0A0A0A] disabled:opacity-50"
          >
            {isPending ? 'Enviando...' : 'Enviar consulta'}
          </button>
        </form>
      </div>
    </section>
  )
}
