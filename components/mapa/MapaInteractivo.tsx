'use client'

import { useMemo, useState } from 'react'
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps'
import Image from 'next/image'
import Link from 'next/link'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyectos: Proyecto[]
  apiKey: string
  mapId: string
}

interface ProyectoConCoordenadas extends Proyecto {
  lat: number
  lng: number
}

function parseCoordenadas(coordenadas: string): { lat: number; lng: number } | null {
  const parts = coordenadas.split(',').map((s) => s.trim())
  if (parts.length !== 2) return null
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  if (!isFinite(lat) || !isFinite(lng)) return null
  return { lat, lng }
}

function calcularCentro(proyectos: ProyectoConCoordenadas[]): { lat: number; lng: number } {
  if (proyectos.length === 0) return { lat: -34.9, lng: -54.5 } // Default Punta del Este
  const sum = proyectos.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 },
  )
  return { lat: sum.lat / proyectos.length, lng: sum.lng / proyectos.length }
}

export default function MapaInteractivo({ proyectos, apiKey, mapId }: Props) {
  const proyectosConCoords: ProyectoConCoordenadas[] = useMemo(
    () =>
      proyectos
        .map((p) => {
          const coords = parseCoordenadas(p.coordenadas)
          return coords ? { ...p, ...coords } : null
        })
        .filter((p): p is ProyectoConCoordenadas => p !== null),
    [proyectos],
  )

  const center = useMemo(() => calcularCentro(proyectosConCoords), [proyectosConCoords])
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  if (!apiKey || !mapId) {
    const missing: string[] = []
    if (!apiKey) missing.push('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
    if (!mapId) missing.push('NEXT_PUBLIC_GOOGLE_MAPS_ID')
    return (
      <div className="flex h-[70vh] w-full items-center justify-center bg-[#F5F0E8] text-center">
        <div className="max-w-md px-6">
          <p className="text-xs font-medium tracking-widest text-[#C6A665] uppercase">
            Configuración pendiente
          </p>
          <h3 className="mt-3 text-2xl font-light text-[#0A0A0A]">
            Mapa no disponible
          </h3>
          <p className="mt-3 text-sm text-[#0A0A0A]/60">
            Falta configurar {missing.length === 1 ? 'la variable' : 'las variables'} de entorno{' '}
            {missing.map((v, i) => (
              <span key={v}>
                <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-xs">{v}</code>
                {i < missing.length - 1 ? ' y ' : ''}
              </span>
            ))}{' '}
            en Vercel.
          </p>
        </div>
      </div>
    )
  }

  const activo = proyectosConCoords.find((p) => p.slug === activeSlug)

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[calc(100vh-180px)] min-h-[520px] w-full overflow-hidden rounded-2xl border border-black/10 shadow-sm">
        <Map
          defaultCenter={center}
          defaultZoom={10}
          mapId={mapId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          className="h-full w-full"
        >
          {proyectosConCoords.map((p) => (
            <AdvancedMarker
              key={p.slug}
              position={{ lat: p.lat, lng: p.lng }}
              onClick={() => setActiveSlug(p.slug)}
              title={p.nombre}
            >
              <Pin
                background="#C6A665"
                borderColor="#0A0A0A"
                glyphColor="#0A0A0A"
                scale={1.2}
              />
            </AdvancedMarker>
          ))}

          {activo && (
            <InfoWindow
              position={{ lat: activo.lat, lng: activo.lng }}
              pixelOffset={[0, -40]}
              onCloseClick={() => setActiveSlug(null)}
              headerDisabled
            >
              <ProyectoCard proyecto={activo} />
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  )
}

function ProyectoCard({ proyecto }: { proyecto: ProyectoConCoordenadas }) {
  return (
    <article className="w-[280px] overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={proyecto.imagenes.hero}
          alt={proyecto.nombre}
          fill
          sizes="280px"
          className="object-cover"
        />
      </div>
      <div className="px-1 pt-3 pb-1">
        <p className="text-[9px] font-medium tracking-[0.25em] text-[#C6A665] uppercase">
          {proyecto.ubicacion}
        </p>
        <h3 className="mt-1 text-lg font-light tracking-wide text-[#0A0A0A]">
          {proyecto.nombre}
        </h3>
        <p className="mt-2 text-xs text-[#0A0A0A]/60">
          Desde <span className="font-medium text-[#0A0A0A]">USD ${proyecto.precioDesde.toLocaleString('es-UY')}</span>
        </p>
        <Link
          href={`/chacras/${proyecto.slug}`}
          className="mt-3 inline-block w-full rounded-full bg-[#0A0A0A] px-4 py-2 text-center text-[10px] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#0A0A0A]/80"
        >
          Ver proyecto
        </Link>
      </div>
    </article>
  )
}
