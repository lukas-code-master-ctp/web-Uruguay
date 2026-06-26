'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calcularFinanciamiento } from '@/lib/financing'

interface Props {
  precioBase: number
  cuotas: number[]
  tasas: number[]
  claro?: boolean
}

export default function FinancingCalc({ precioBase, cuotas, tasas, claro = false }: Props) {
  const [precio, setPrecio] = useState(precioBase)
  const [plazoIdx, setPlazoIdx] = useState(1)

  // La Martina reemplaza los acentos negros/dorados por #9a6642.
  const accentTxt = claro ? 'text-[#9a6642]' : 'text-[#C6A665]'
  const focusBorde = claro ? 'focus:border-[#9a6642]' : 'focus:border-[#0A0A0A]'
  const btnSel = claro
    ? 'border-[#9a6642] bg-[#9a6642] text-white'
    : 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
  const btnUnsel = claro
    ? 'border-[#D9D9D9] bg-white text-[#0A0A0A] hover:border-[#9a6642]'
    : 'border-[#D9D9D9] bg-white text-[#0A0A0A] hover:border-[#0A0A0A]'

  const safeIdx = Math.min(plazoIdx, Math.min(cuotas.length, tasas.length) - 1)
  const result = calcularFinanciamiento(precio, cuotas[safeIdx], tasas[safeIdx])

  const fmt = (n: number) =>
    `USD $${n.toLocaleString('es-UY')}`

  return (
    <section id="calculadora" className="border-t border-[#D9D9D9] bg-[#f5f5f5] px-6 py-16 md:px-16">
      <p className={`mb-2 text-xs font-semibold tracking-widest uppercase ${claro ? 'text-[#9a6642]' : 'text-[#2E2E2E]'}`}>Calculadora de financiamiento</p>
      <p className="mb-10 text-sm text-[#2E2E2E]">40% de pie + cuotas mensuales. Valores orientativos.</p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-xs tracking-wider text-[#2E2E2E] uppercase">
              Precio del lote (USD)
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => {
                const raw = Number(e.target.value)
                if (!isFinite(raw)) return
                setPrecio(Math.min(200000, Math.max(50000, raw)))
              }}
              step={5000}
              min={50000}
              max={200000}
              className={`w-full border border-[#D9D9D9] bg-white px-4 py-3 text-sm text-[#0A0A0A] outline-none ${focusBorde}`}
            />
          </div>

          <div>
            <label className="mb-3 block text-xs tracking-wider text-[#2E2E2E] uppercase">Plazo</label>
            <div className="flex gap-3">
              {cuotas.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setPlazoIdx(i)}
                  className={`flex-1 border py-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
                    safeIdx === i ? btnSel : btnUnsel
                  }`}
                >
                  {c} cuotas
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          {[
            { label: 'Pie inicial (40%)', value: result.pie },
            { label: 'Cuota mensual', value: result.cuotaMensual, highlight: true },
            { label: 'Total financiado', value: result.totalFinanciado },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`flex items-center justify-between border-b border-[#D9D9D9] pb-4 ${highlight ? 'text-[#0A0A0A]' : 'text-[#2E2E2E]'}`}>
              <span className="text-xs tracking-wider uppercase">{label}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className={`font-semibold ${highlight ? `text-xl ${accentTxt}` : 'text-sm'}`}
                >
                  {fmt(value)}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
