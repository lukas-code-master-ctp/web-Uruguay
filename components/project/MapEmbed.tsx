interface Props {
  coordenadas: string
  nombre: string
}

function buildMapSrc(coordenadas: string): string | null {
  const parts = coordenadas.split(',')
  if (parts.length !== 2) return null
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  if (!isFinite(lat) || !isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`
}

export default function MapEmbed({ coordenadas, nombre }: Props) {
  const src = buildMapSrc(coordenadas)
  if (!src) return null

  return (
    <section id="mapa" className="px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-[#2E2E2E] uppercase">Ubicación</p>
      <div className="overflow-hidden border border-[#D9D9D9]">
        <iframe
          src={src}
          title={`Ubicación ${nombre}`}
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin"
          className="block"
        />
      </div>
    </section>
  )
}
