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
    descripcion: 'Barrio privado con vista al mar en José Ignacio, Uruguay. Chacras de alto valor con acceso controlado y entorno natural privilegiado.',
    descripcionPreview: 'Chacras frente al mar. Entorno natural privilegiado con acceso controlado en José Ignacio.',
    destacados: ['Vista al mar', 'Seguridad 24h', 'Entorno natural'],
    amenities: ['Portón controlado', 'Caminería interna', 'Agua potable', 'Energía eléctrica'],
    puntosCercanos: ['Playa a 500m', 'José Ignacio a 8km', 'Punta del Este a 35km', 'Montevideo a 180km'],
    coordenadas: '-34.8412,-54.6721',
    mapEmbed: null,
    masterplanEmbed: null,
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/la-martina/hero.jpg',
      galeria: Array.from({ length: 7 }, (_, i) => `/proyectos/la-martina/galeria-${i + 1}.jpg`),
      video: '/proyectos/la-martina/video.mp4',
    },
  },
  {
    slug: 'aires-manantiales',
    nombre: 'Aires de Manantiales',
    ubicacion: 'Manantiales, Uruguay',
    precioDesde: 70000,
    precioHasta: 100000,
    descripcion: 'Chacras en Manantiales rodeadas de naturaleza exuberante. Una de las zonas de mayor crecimiento en Uruguay.',
    descripcionPreview: 'Naturaleza pura en una de las zonas de mayor crecimiento de Uruguay.',
    destacados: ['Naturaleza pura', 'Acceso directo', 'Alta valorización'],
    amenities: ['Acceso controlado', 'Caminería interna', 'Agua potable'],
    puntosCercanos: ['José Ignacio a 10km', 'Laguna Garzón a 15km', 'Punta del Este a 45km'],
    coordenadas: '-34.7900,-54.5800',
    mapEmbed: null,
    masterplanEmbed: null,
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/aires-manantiales/hero.jpg',
      galeria: Array.from({ length: 6 }, (_, i) => `/proyectos/aires-manantiales/galeria-${i + 1}.jpg`),
      video: '/proyectos/aires-manantiales/video.mp4',
    },
  },
  {
    slug: 'ama-jose-ignacio',
    nombre: 'Ama José Ignacio',
    ubicacion: 'José Ignacio, Uruguay',
    precioDesde: 55000,
    precioHasta: 130000,
    descripcion: 'Chacras en el corazón de José Ignacio. Vive rodeado de la belleza natural uruguaya con todas las comodidades.',
    descripcionPreview: 'En el corazón de José Ignacio. Vistas panorámicas y financiamiento flexible.',
    destacados: ['Ubicación premium', 'Vistas panorámicas', 'Financiamiento flexible'],
    amenities: ['Portón controlado', 'Caminería pavimentada', 'Agua potable', 'Iluminación'],
    puntosCercanos: ['Centro José Ignacio a 5km', 'Playa a 3km', 'Punta del Este a 30km'],
    coordenadas: '-34.8600,-54.6400',
    mapEmbed: null,
    masterplanEmbed: null,
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/ama-jose-ignacio/hero.jpg',
      galeria: Array.from({ length: 7 }, (_, i) => `/proyectos/ama-jose-ignacio/galeria-${i + 1}.jpg`),
      video: '/proyectos/ama-jose-ignacio/video.mp4',
    },
  },
  {
    slug: 'tierras-del-este',
    nombre: 'Tierras del Este',
    ubicacion: 'Rocha, Uruguay',
    precioDesde: 80000,
    precioHasta: 90000,
    descripcion: 'Amplias chacras en la región este de Uruguay. Tranquilidad, naturaleza y potencial de valorización excepcional.',
    descripcionPreview: 'Grandes extensiones en el este de Uruguay. Tranquilidad y potencial de valorización excepcional.',
    destacados: ['Grandes extensiones', 'Precio accesible', 'Alta valorización'],
    amenities: ['Acceso asfaltado', 'Agua potable', 'Electricidad'],
    puntosCercanos: ['Rocha a 20km', 'La Paloma a 35km', 'Montevideo a 220km'],
    coordenadas: '-34.4800,-54.3400',
    mapEmbed: null,
    masterplanEmbed: null,
    financiamientoInicial: 40,
    financiamientoCuotas: [12, 24, 36],
    financiamientoTasas: [0.6, 0.7, 0.75],
    activo: true,
    imagenes: {
      hero: '/proyectos/tierras-del-este/hero.jpg',
      galeria: Array.from({ length: 8 }, (_, i) => `/proyectos/tierras-del-este/galeria-${i + 1}.jpg`),
      video: null,
    },
  },
]

export function parseProyecto(row: string[]): Proyecto {
  const slug = row[0]
  const count = GALLERY_COUNTS[slug] ?? 6
  const galeria = Array.from({ length: count }, (_, i) => `/proyectos/${slug}/galeria-${i + 1}.jpg`)

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
    descripcionPreview: row[13] ?? '',
    activo: row[14]?.toUpperCase() === 'TRUE',
    mapEmbed: row[15]?.trim() || null,
    masterplanEmbed: row[16]?.trim() || null,
    imagenes: {
      hero: `/proyectos/${slug}/hero.jpg`,
      galeria,
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
  try {
    const rows = await readSheet('proyectos!A2:Q1000')
    const parsed = rows.map(parseProyecto).filter((p) => p.activo)
    // Si la Sheet devuelve vacío, usar mock para no romper el sitio
    return parsed.length > 0 ? parsed : MOCK_PROYECTOS
  } catch (err) {
    console.error('[getProyectos] Error fetching from Sheet, using mock data:', err)
    return MOCK_PROYECTOS
  }
})

export const getProyectoBySlug = cache(async (slug: string): Promise<Proyecto | null> => {
  const all = await getProyectos()
  return all.find((p) => p.slug === slug) ?? null
})

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  if (IS_DEV_NO_SHEET) {
    return {
      whatsappNumero: '+59899000000',
      whatsappMensaje: 'Hola, me interesa información sobre una de sus chacras',
      emailContacto: 'info@ctprealestate.com',
    }
  }
  const rows = await readSheet('config!A2:B20')
  return parseConfig(rows)
})
