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
  const rows = await readSheet('proyectos!A2:N1000')
  return rows.map(parseProyecto).filter((p) => p.activo)
})

export const getProyectoBySlug = cache(async (slug: string): Promise<Proyecto | null> => {
  const all = await getProyectos()
  return all.find((p) => p.slug === slug) ?? null
})

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const rows = await readSheet('config!A2:B20')
  return parseConfig(rows)
})
