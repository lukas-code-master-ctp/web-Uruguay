import type { MetadataRoute } from 'next'
import { getProyectos } from '@/lib/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const proyectos = await getProyectos()
  const baseUrl = 'https://ctprealestate.com'

  const proyectoUrls = proyectos.map((p) => ({
    url: `${baseUrl}/chacras/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    ...proyectoUrls,
  ]
}
