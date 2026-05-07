export interface Proyecto {
  slug: string
  nombre: string
  ubicacion: string
  precioDesde: number
  precioHasta: number
  descripcion: string
  descripcionPreview: string
  destacados: string[]
  amenities: string[]
  puntosCercanos: string[]
  coordenadas: string
  financiamientoInicial: number
  financiamientoCuotas: number[]
  financiamientoTasas: number[]
  activo: boolean
  imagenes: {
    hero: string
    galeria: string[]
    plano: string | null
    video: string | null
  }
}

export interface Lead {
  nombre: string
  email: string
  telefono: string
  mensaje: string
  proyecto: string
}

export interface SiteConfig {
  whatsappNumero: string
  whatsappMensaje: string
  emailContacto: string
}
