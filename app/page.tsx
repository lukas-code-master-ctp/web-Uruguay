import HomeHero from '@/components/home/HomeHero'
import ProjectGrid from '@/components/home/ProjectGrid'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export const revalidate = 10

export default async function Home() {
  const proyectos = await getProyectos()
  // En el home aparecen los proyectos activos (incluye los "Próximamente", que
  // son navegables y se marcan con una franja). Los SOLD OUT quedan fuera.
  const proyectosActivos = proyectos.filter((p) => p.activo)

  return (
    <main>
      <HomeHero />
      <ProjectGrid proyectos={proyectosActivos} />
      <Footer />
    </main>
  )
}
