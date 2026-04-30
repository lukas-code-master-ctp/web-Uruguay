import { cache } from 'react'
import { readSheet } from './sheets'
import type { Proyecto, SiteConfig } from './types'

const NO_VIDEO_SLUGS = new Set(['tierras-del-este'])

const GALLERY_COUNTS: Record<string, number> = {
  'la-martina': 7,
  'aires-manantiales': 6,
  'ama-jose-ignacio': 7,
  'tierras-del-este': 8,
}

const IS_DEV_NO_SHEET =
  !process.env.GOOGLE_SHEET_ID ||
  process.env.GOOGLE_SHEET_ID === 'REPLACE_WITH_SHEET_ID_AFTER_CREATION'

const MOCK_PROYECTOS: Proyecto[] = [
  {
    slug: 'la-martina',
    nombre: 'La Martina',
    ubicacion: 'José Ignacio, Uruguay',
    precioDesde: 90000,
    precioHasta: 130000,
    descripcion: 'Barrio privado con vista al mar en José Ignacio, Uruguay. Parcelas de alto valor con acceso controlado y entorno natural privilegiado.',
    destacados: ['Vista al mar', 'Seguridad 24h', 'Entorno natural'],
    amenities: ['Portón controlado', 'Caminería interna', 'Agua potable', 'Energía eléctrica'],
    puntosCercanos: ['Playa a 500m', 'José Ignacio a 8km', 'Punta del Este a 35km', 'Montevideo a 180km'],
    coordenadas: '-34.8412,-54.6721',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/la-martina/hero.jpg',
      galeria: Array.from({ length: 7 }, (_, i) => `/proyectos/la-martina/galeria-${i + 1}.jpg`),
      plano: '/proyectos/la-martina/plano.png',
      video: '/proyectos/la-martina/video.mp4',
    },
  },
  {
    slug: 'aires-manantiales',
    nombre: 'Aires de Manantiales',
    ubicacion: 'Manantiales, Uruguay',
    precioDesde: 70000,
    precioHasta: 100000,
    descripcion: 'Parcelas en Manantiales rodeadas de naturaleza exuberante. Una de las zonas de mayor crecimiento en Uruguay.',
    destacados: ['Naturaleza pura', 'Acceso directo', 'Alta valorización'],
    amenities: ['Acceso controlado', 'Caminería interna', 'Agua potable'],
    puntosCercanos: ['José Ignacio a 10km', 'Laguna Garzón a 15km', 'Punta del Este a 45km'],
    coordenadas: '-34.7900,-54.5800',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/aires-manantiales/hero.jpg',
      galeria: Array.from({ length: 6 }, (_, i) => `/proyectos/aires-manantiales/galeria-${i + 1}.jpg`),
      plano: null,
      video: '/proyectos/aires-manantiales/video.mp4',
    },
  },
  {
    slug: 'ama-jose-ignacio',
    nombre: 'Ama José Ignacio',
    ubicacion: 'José Ignacio, Uruguay',
    precioDesde: 55000,
    precioHasta: 130000,
    descripcion: 'Parcelas en el corazón de José Ignacio. Vive rodeado de la belleza natural uruguaya con todas las comodidades.',
    destacados: ['Ubicación premium', 'Vistas panorámicas', 'Financiamiento flexible'],
    amenities: ['Portón controlado', 'Caminería pavimentada', 'Agua potable', 'Iluminación'],
    puntosCercanos: ['Centro José Ignacio a 5km', 'Playa a 3km', 'Punta del Este a 30km'],
    coordenadas: '-34.8600,-54.6400',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/ama-jose-ignacio/hero.jpg',
      galeria: Array.from({ length: 7 }, (_, i) => `/proyectos/ama-jose-ignacio/galeria-${i + 1}.jpg`),
      plano: '/proyectos/ama-jose-ignacio/plano.png',
      video: '/proyectos/ama-jose-ignacio/video.mp4',
    },
  },
  {
    slug: 'tierras-del-este',
    nombre: 'Tierras del Este',
    ubicacion: 'Rocha, Uruguay',
    precioDesde: 80000,
    precioHasta: 90000,
    descripcion: 'Amplias parcelas en la región este de Uruguay. Tranquilidad, naturaleza y potencial de valorización excepcional.',
    destacados: ['Grandes extensiones', 'Precio accesible', 'Alta valorización'],
    amenities: ['Acceso asfaltado', 'Agua potable', 'Electricidad'],
    puntosCercanos: ['Rocha a 20km', 'La Paloma a 35km', 'Montevideo a 220km'],
    coordenadas: '-34.4800,-54.3400',
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/tierras-del-este/hero.jpg',
      galeria: Array.from({ length: 8 }, (_, i) => `/proyectos/tierras-del-este/galeria-${i + 1}.jpg`),
      plano: null,
      video: null,
    },
  },
]

export function parseProyecto(row: string[]): Proyecto {
  const slug = row[0]
  const count = GALLERY_COUNTS[slug] ?? 6
  const galeria = Array.from({ length: count }, (_, i) => `/proyectos/${slug}/galeria-${i + 1}.jpg`)

  const hasPlano =
    slug === 'la-martina' ||
    slug === 'ama-jose-ignacio'

  return {
    slug,
    nombre: row[1],
    ubicacion: row[2],
    precioDesde: Number(row[3]),
    precioHasta: Number(row[4]),
    descripcion: row[5],
    destacados: row[6]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    amenities: row[7]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    puntosCercanos: row[8]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    coordenadas: row[9],
    financiamientoInicial: Number(row[10]),
    financiamientoCuotas: row[11]?.split(',').map(Number) ?? [12, 24, 36],
    financiamientoTasas: row[12]?.split(',').map(Number) ?? [0.6, 0.7, 0.75],
    activo: row[13]?.toUpperCase() === 'TRUE',
    imagenes: {
      hero: `/proyectos/${slug}/hero.jpg`,
      galeria,
      plano: hasPlano ? `/proyectos/${slug}/plano.png` : null,
      video: NO_VIDEO_SLUGS.has(slug) ? null : `/proyectos/${slug}/video.mp4`,
    },
  }
}

export function parseConfig(rows: string[][]): SiteConfig {
  const map = Object.fromEntries(rows.map(([k, v]) => [k, v]))
  return {
    whatsappNumero: map['whatsapp_numero'] ?? '',
    whatsappMensaje: map['whatsapp_mensaje'] ?? '',
    emailContacto: map['email_contacto'] ?? '',
  }
}

export const getProyectos = cache(async (): Promise<Proyecto[]> => {
  if (IS_DEV_NO_SHEET) return MOCK_PROYECTOS
  const rows = await readSheet('proyectos!A2:N1000')
  return rows.map(parseProyecto).filter((p) => p.activo)
})

export const getProyectoBySlug = cache(async (slug: string): Promise<Proyecto | null> => {
  const all = await getProyectos()
  return all.find((p) => p.slug === slug) ?? null
})

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  if (IS_DEV_NO_SHEET) {
    return {
      whatsappNumero: '+59899000000',
      whatsappMensaje: 'Hola, me interesa información sobre una de sus parcelas',
      emailContacto: 'info@ctprealestate.com',
    }
  }
  const rows = await readSheet('config!A2:B20')
  return parseConfig(rows)
})
