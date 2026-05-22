import type { Metadata } from 'next'
import ProyectosGrid from '@/components/proyectos/ProyectosGrid'
import ProyectosHeader from '@/components/proyectos/ProyectosHeader'
import PageTransition from '@/components/shared/PageTransition'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Nuestros proyectos | CTP Real Estate',
  description: 'Explora todas las chacras disponibles. Inversión rural premium en los puntos más exclusivos de Uruguay.',
}

export const revalidate = 10

export default async function ProyectosPage() {
  const proyectos = await getProyectos()

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#F5F0E8] pb-24">
        <ProyectosHeader />

        <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
          <ProyectosGrid proyectos={proyectos} />
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
