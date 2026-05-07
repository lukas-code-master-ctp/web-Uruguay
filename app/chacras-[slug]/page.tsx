import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectHero from '@/components/project/ProjectHero'
import ProjectSectionNav from '@/components/project/ProjectSectionNav'
import ValueProps from '@/components/project/ValueProps'
import Gallery from '@/components/project/Gallery'
import Masterplan from '@/components/project/Masterplan'
import Amenities from '@/components/project/Amenities'
import NearbyPoints from '@/components/project/NearbyPoints'
import MapEmbed from '@/components/project/MapEmbed'
import FinancingCalc from '@/components/project/FinancingCalc'
import ContactForm from '@/components/project/ContactForm'
import StickyContact from '@/components/shared/StickyContact'
import PageTransition from '@/components/shared/PageTransition'
import Footer from '@/components/shared/Footer'
import JsonLd from '@/components/project/JsonLd'
import { getProyectos, getProyectoBySlug } from '@/lib/projects'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const proyectos = await getProyectos()
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proyecto = await getProyectoBySlug(slug)
  if (!proyecto) return {}

  const title = `Chacras en ${proyecto.ubicacion} desde USD $${proyecto.precioDesde.toLocaleString('es-UY')} | ${proyecto.nombre}`
  const description = `${proyecto.nombre} — chacras en ${proyecto.ubicacion}. Desde USD $${proyecto.precioDesde.toLocaleString('es-UY')} con financiamiento en ${proyecto.financiamientoCuotas.join(', ')} cuotas. ${proyecto.puntosCercanos[0] ?? ''}. Consulta hoy.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: proyecto.imagenes.hero }],
      type: 'website',
    },
  }
}

export const revalidate = 30

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params
  const proyecto = await getProyectoBySlug(slug)
  if (!proyecto) notFound()

  return (
    <PageTransition>
      <JsonLd proyecto={proyecto} />

      {/* Hero a pantalla completa */}
      <ProjectHero proyecto={proyecto} />

      {/* Nav de secciones — sticky bajo el hero */}
      <ProjectSectionNav tieneMasterplan={!!proyecto.imagenes.plano} />

      {/* Secciones */}
      <ValueProps destacados={proyecto.destacados} />
      <NearbyPoints puntos={proyecto.puntosCercanos} />
      <Amenities amenities={proyecto.amenities} />
      <Gallery imagenes={proyecto.imagenes.galeria} />
      {proyecto.imagenes.plano && <Masterplan src={proyecto.imagenes.plano} />}
      <MapEmbed coordenadas={proyecto.coordenadas} nombre={proyecto.nombre} />
      <FinancingCalc
        precioBase={proyecto.precioDesde}
        cuotas={proyecto.financiamientoCuotas}
        tasas={proyecto.financiamientoTasas}
      />
      <ContactForm proyectoSlug={proyecto.slug} proyectoNombre={proyecto.nombre} />

      <StickyContact />
      <Footer />
    </PageTransition>
  )
}
