import { describe, it, expect } from 'vitest'
import { calcularFinanciamiento } from '@/lib/financing'

describe('calcularFinanciamiento', () => {
  it('calculates correct monthly payment for 12-month term', () => {
    const result = calcularFinanciamiento(90000, 12, 0.6)
    expect(result.pie).toBe(36000)
    expect(result.saldo).toBe(54000)
    expect(result.cuotaMensual).toBeCloseTo(4677, 0)
    expect(result.totalFinanciado).toBeCloseTo(56124, 0)
  })

  it('calculates correct monthly payment for 24-month term', () => {
    const result = calcularFinanciamiento(90000, 24, 0.7)
    expect(result.pie).toBe(36000)
    expect(result.cuotaMensual).toBeCloseTo(2452, 0)
  })

  it('calculates correct monthly payment for 36-month term', () => {
    const result = calcularFinanciamiento(90000, 36, 0.75)
    expect(result.pie).toBe(36000)
    expect(result.cuotaMensual).toBeCloseTo(1717, 0)
  })
})
