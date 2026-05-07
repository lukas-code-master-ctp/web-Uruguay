import HomeHero from '@/components/home/HomeHero'
import ProjectGrid from '@/components/home/ProjectGrid'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export const revalidate = 30

export default async function Home() {
  const proyectos = await getProyectos()

  return (
    <main>
      <HomeHero />
      <ProjectGrid proyectos={proyectos} />
      <Footer />
    </main>
  )
}
