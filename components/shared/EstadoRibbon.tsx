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
  const box =
    size === 'lg'
      ? 'h-[280px] w-[280px] md:h-[480px] md:w-[480px]'
      : 'h-[88px] w-[88px]'
  const band =
    size === 'lg'
      ? 'top-[65px] left-[-84px] w-[392px] py-2 text-[16px] md:top-[112px] md:left-[-144px] md:w-[672px] md:py-3.5 md:text-[30px] tracking-[0.3em]'
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
