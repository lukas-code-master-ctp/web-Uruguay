export interface FinanciamientoResult {
  pie: number
  saldo: number
  cuotaMensual: number
  totalFinanciado: number
}

export function calcularFinanciamiento(
  precio: number,
  cuotas: number,
  tasaMensualPct: number
): FinanciamientoResult {
  const pie = precio * 0.4
  const saldo = precio * 0.6
  const tasa = tasaMensualPct / 100

  const cuotaMensualRaw =
    tasa === 0
      ? saldo / cuotas
      : (saldo * tasa) / (1 - Math.pow(1 + tasa, -cuotas))

  const cuotaMensual = Math.round(cuotaMensualRaw)
  const totalFinanciado = cuotaMensual * cuotas

  return {
    pie: Math.round(pie),
    saldo: Math.round(saldo),
    cuotaMensual,
    totalFinanciado,
  }
}
