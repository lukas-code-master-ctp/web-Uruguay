import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectHero from '@/components/project/ProjectHero'
import ProjectSectionNav from '@/components/project/ProjectSectionNav'
import ProjectIntro from '@/components/project/ProjectIntro'
import VideoShowcase from '@/components/project/VideoShowcase'
import Gallery from '@/components/project/Gallery'
import Masterplan from '@/components/project/Masterplan'
import NearbyPoints from '@/components/project/NearbyPoints'
import FinancingCalc from '@/components/project/FinancingCalc'
import ContactForm from '@/components/project/ContactForm'
import PageTransition from '@/components/shared/PageTransition'
import Footer from '@/components/shared/Footer'
import JsonLd from '@/components/project/JsonLd'
import { getProyectos, getProyectoBySlug } from '@/lib/projects'
import { getTema } from '@/lib/proyecto-tema'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const proyectos = await getProyectos()
  // Solo se generan páginas estáticas para proyectos activos.
  return proyectos.filter((p) => p.activo).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proyecto = await getProyectoBySlug(slug)
  if (!proyecto || !proyecto.activo) return {}

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

export const revalidate = 10
export const dynamicParams = true

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params
  const proyecto = await getProyectoBySlug(slug)
  // Proyectos SOLD OUT (activo=false) no tienen página dedicada — 404.
  if (!proyecto || !proyecto.activo) notFound()

  // Personalización visual del proyecto (ver lib/proyecto-tema.ts).
  const tema = getTema(proyecto.slug)

  return (
    <PageTransition>
      <JsonLd proyecto={proyecto} />

      {/* Hero a pantalla completa */}
      <ProjectHero proyecto={proyecto} tema={tema} />

      {/* Nav de secciones — sticky bajo el hero */}
      <ProjectSectionNav tieneMasterplan={!!proyecto.masterplanEmbed} />

      {/* Secciones */}
      <ProjectIntro proyecto={proyecto} tema={tema} />
      {tema.youtubeId && (
        <VideoShowcase nombre={proyecto.nombre} youtubeId={tema.youtubeId} datos={tema.datosVideo} />
      )}
      <NearbyPoints puntos={proyecto.puntosCercanos} nombre={proyecto.nombre} ubicacion={proyecto.ubicacion} mapEmbed={proyecto.mapEmbed} tema={tema} />
      {proyecto.masterplanEmbed && <Masterplan src={proyecto.masterplanEmbed} claro={tema.claro} />}
      <Gallery portada={proyecto.imagenes.portadaGaleria} imagenes={proyecto.imagenes.galeria} claro={tema.claro} />
      <FinancingCalc
        precioBase={proyecto.precioDesde}
        cuotas={proyecto.financiamientoCuotas}
        tasas={proyecto.financiamientoTasas}
        tema={tema}
      />
      <ContactForm proyectoSlug={proyecto.slug} proyectoNombre={proyecto.nombre} tema={tema} />

      <Footer />
    </PageTransition>
  )
}
