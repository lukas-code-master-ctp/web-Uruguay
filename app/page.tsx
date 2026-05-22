import HomeHero from '@/components/home/HomeHero'
import Footer from '@/components/shared/Footer'

export const revalidate = 10

export default async function Home() {
  return (
    <main>
      <HomeHero />
      <Footer />
    </main>
  )
}
