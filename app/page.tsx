import HomeHero from '@/components/home/HomeHero'
import ProjectGrid from '@/components/home/ProjectGrid'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export const revalidate = 10

export default async function Home() {
  const proyectos = await getProyectos()
  // Solo proyectos activos aparecen en el home — los SOLD OUT viven solo en /proyectos y /mapa.
  const proyectosActivos = proyectos.filter((p) => p.activo)

  return (
    <main>
      <HomeHero />
      <ProjectGrid proyectos={proyectosActivos} />
      <Footer />
    </main>
  )
}
