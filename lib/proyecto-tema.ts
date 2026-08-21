/**
 * Personalización visual por proyecto.
 *
 * Por defecto las páginas de proyecto usan el tema oscuro (#0A0A0A + dorado
 * #C6A665). La Martina usa el "tema claro": fondo verde salvia texturado,
 * acento oliva #AFA27F, títulos verde #475242 — y suma piezas propias
 * (mapa ilustrado, plano de lotes, video de YouTube).
 *
 * Las piezas gráficas viven en `public/proyectos/<slug>/`. Los textos siguen
 * viniendo de la Google Sheet: acá solo va lo que no tiene columna en la Sheet.
 */
export interface TemaProyecto {
  /** Activa el tema claro completo (hero editorial, fondo salvia, acento oliva). */
  claro: boolean
  /** Bajada bajo la marca en el hero editorial (ej. "Barrio privado"). */
  bajada?: string
  /** Textura de fondo de introducción, calculadora y contacto. */
  fondo?: string
  /** Mapa ilustrado que reemplaza la foto vertical en la introducción. */
  mapaIlustrado?: string
  /** Plano de lotes que abre la sección de ubicación (recortado, sin margen blanco). */
  planoLotes?: { src: string; ancho: number; alto: number }
  /** ID del video de YouTube; su miniatura se usa como fondo de la sección. */
  youtubeId?: string
  /** Datos destacados que acompañan al video (label arriba, valor abajo). */
  datosVideo?: { label: string; valor: string }[]
  /** Foto que acompaña al formulario de contacto. */
  fotoContacto?: string
}

const TEMA_OSCURO: TemaProyecto = { claro: false }

const TEMAS: Record<string, TemaProyecto> = {
  'la-martina': {
    claro: true,
    bajada: 'Barrio privado',
    fondo: '/proyectos/la-martina/fondo.jpg',
    mapaIlustrado: '/proyectos/la-martina/mapa-ilustrado.jpg',
    planoLotes: { src: '/proyectos/la-martina/plano-lotes.jpg', ancho: 1065, alto: 293 },
    youtubeId: 'llxoXRY64Cc',
    datosVideo: [
      { label: 'Lotes de', valor: '1.000 m²' },
      { label: 'Sector de', valor: 'área común' },
    ],
    fotoContacto: '/proyectos/la-martina/galeria-5.jpg',
  },
}

export function getTema(slug: string): TemaProyecto {
  return TEMAS[slug] ?? TEMA_OSCURO
}

/** Miniatura de un video de YouTube, servida por el propio YouTube. */
export function miniaturaYoutube(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}
