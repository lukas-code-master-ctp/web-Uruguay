import type { Proyecto } from '@/lib/types'

interface Props {
  proyecto: Proyecto
}

export default function JsonLd({ proyecto }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Parcelas ${proyecto.nombre}`,
    description: proyecto.descripcion,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: proyecto.precioDesde.toString(),
      availability: 'https://schema.org/InStock',
    },
    areaServed: {
      '@type': 'Place',
      name: proyecto.ubicacion,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
