interface Props {
  coordenadas: string
  nombre: string
}

export default function MapEmbed({ coordenadas, nombre }: Props) {
  const [lat, lng] = coordenadas.split(',').map(Number)
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`

  return (
    <section className="px-6 py-16 md:px-16">
      <p className="mb-8 text-xs font-semibold tracking-widest text-[#2E2E2E] uppercase">Ubicación</p>
      <div className="overflow-hidden border border-[#D9D9D9]">
        <iframe
          src={src}
          title={`Ubicación ${nombre}`}
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block"
        />
      </div>
    </section>
  )
}
