import { describe, it, expect } from 'vitest'
import { parseProyecto, parseConfig } from '@/lib/projects'

const mockRow = [
  'la-martina',
  'La Martina',
  'José Ignacio, Uruguay',
  '90000',
  '130000',
  'Barrio privado con vista al mar en José Ignacio.',
  'Vista al mar,Seguridad 24h,Naturaleza',
  'Portón controlado,Caminería interna,Agua potable',
  'Playa a 500m,José Ignacio a 8km,Montevideo a 180km',
  '-34.8412,-54.6721',
  '40',
  '12,24,36',
  '0.6,0.7,0.75',
  'TRUE',
]

describe('parseProyecto', () => {
  it('parses a raw sheet row into a Proyecto object', () => {
    const result = parseProyecto(mockRow)
    expect(result.slug).toBe('la-martina')
    expect(result.nombre).toBe('La Martina')
    expect(result.precioDesde).toBe(90000)
    expect(result.precioHasta).toBe(130000)
    expect(result.destacados).toEqual(['Vista al mar', 'Seguridad 24h', 'Naturaleza'])
    expect(result.amenities).toEqual(['Portón controlado', 'Caminería interna', 'Agua potable'])
    expect(result.puntosCercanos).toEqual(['Playa a 500m', 'José Ignacio a 8km', 'Montevideo a 180km'])
    expect(result.financiamientoCuotas).toEqual([12, 24, 36])
    expect(result.financiamientoTasas).toEqual([0.6, 0.7, 0.75])
    expect(result.activo).toBe(true)
  })

  it('attaches correct image paths based on slug', () => {
    const result = parseProyecto(mockRow)
    expect(result.imagenes.hero).toBe('/proyectos/la-martina/hero.jpg')
    expect(result.imagenes.galeria[0]).toBe('/proyectos/la-martina/galeria-1.jpg')
    expect(result.imagenes.video).toBe('/proyectos/la-martina/video.mp4')
  })

  it('returns activo=false when column N is not TRUE', () => {
    const inactiveRow = [...mockRow]
    inactiveRow[13] = 'FALSE'
    expect(parseProyecto(inactiveRow).activo).toBe(false)
  })
})

describe('parseConfig', () => {
  it('parses config rows into SiteConfig', () => {
    const rows = [
      ['whatsapp_numero', '+59899123456'],
      ['whatsapp_mensaje', 'Hola, quiero info'],
      ['email_contacto', 'info@ctp.com'],
    ]
    const result = parseConfig(rows)
    expect(result.whatsappNumero).toBe('+59899123456')
    expect(result.whatsappMensaje).toBe('Hola, quiero info')
    expect(result.emailContacto).toBe('info@ctp.com')
  })
})
