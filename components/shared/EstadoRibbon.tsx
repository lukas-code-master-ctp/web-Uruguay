interface Props {
  /** Texto de la franja, ej. "Próximamente" o "Sold out". */
  label: string
  /** 'lg' para heros a pantalla completa, 'sm' para tarjetas chicas (mapa). */
  size?: 'lg' | 'sm'
}

/**
 * Franja diagonal en la esquina superior izquierda (estado del proyecto).
 * El contenedor padre debe ser `relative` y tener `overflow-hidden`.
 */
export default function EstadoRibbon({ label, size = 'lg' }: Props) {
  const box = size === 'lg' ? 'h-[150px] w-[150px]' : 'h-[88px] w-[88px]'
  const band =
    size === 'lg'
      ? 'top-[34px] left-[-46px] w-[210px] py-2 text-[11px] tracking-[0.3em]'
      : 'top-[18px] left-[-32px] w-[132px] py-1 text-[7px] tracking-[0.2em]'

  return (
    <div className={`pointer-events-none absolute left-0 top-0 z-30 overflow-hidden ${box}`}>
      <span
        className={`absolute -rotate-45 bg-[#C6A665] text-center font-semibold uppercase text-[#0A0A0A] shadow-md ${band}`}
      >
        {label}
      </span>
    </div>
  )
}
