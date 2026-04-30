import Nav from '@/components/ui/Nav'
import HomeHero from '@/components/home/HomeHero'
import ProjectGrid from '@/components/home/ProjectGrid'
import Footer from '@/components/shared/Footer'
import { getProyectos } from '@/lib/projects'

export default async function Home() {
  const proyectos = await getProyectos()

  return (
    <main>
      <Nav />
      <HomeHero />
      <ProjectGrid proyectos={proyectos} />
      <Footer />
    </main>
  )
}
