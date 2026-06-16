import HomeHero from '@/components/home/HomeHero'
import ProjectGrid from '@/components/home/ProjectGrid'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export const revalidate = 10

export default async function Home() {
  const proyectos = await getProyectos()
  // En el home aparecen los proyectos activos y los "Próximamente" (como teaser).
  // Los SOLD OUT quedan solo en /proyectos y /mapa.
  const proyectosHome = proyectos.filter((p) => p.activo || p.proximamente)

  return (
    <main>
      <HomeHero />
      <ProjectGrid proyectos={proyectosHome} />
      <Footer />
    </main>
  )
}
