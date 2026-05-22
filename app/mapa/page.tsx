import type { Metadata } from 'next'
import MapaInteractivo from '@/components/mapa/MapaInteractivo'
import PageTransition from '@/components/shared/PageTransition'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Mapa de proyectos | CTP Real Estate',
  description: 'Ubicación de todas nuestras chacras en Uruguay. Explora el mapa interactivo y conoce cada proyecto.',
}

export const revalidate = 10

export default async function MapaPage() {
  const proyectos = await getProyectos()
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? ''

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#F5F0E8] pb-16">
        <header className="px-6 pt-32 pb-10 text-center md:pt-36 md:pb-12">
          <p className="mb-4 text-[10px] font-medium tracking-[0.35em] text-[#C6A665] uppercase">
            Ubicación
          </p>
          <h1 className="text-4xl font-light tracking-wide text-[#0A0A0A] md:text-5xl lg:text-6xl">
            Mapa de proyectos
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-[#0A0A0A]/70 md:text-base">
            Clickea un pin para ver el detalle de cada chacra.
          </p>
        </header>

        <section className="mx-auto max-w-7xl px-6 md:px-10">
          <MapaInteractivo proyectos={proyectos} apiKey={apiKey} mapId={mapId} />
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
