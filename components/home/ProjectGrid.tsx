import ProjectCard from './ProjectCard'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyectos: Proyecto[]
}

export default function ProjectGrid({ proyectos }: Props) {
  return (
    <section>
      {proyectos.map((p, i) => (
        <ProjectCard key={p.slug} proyecto={p} index={i} />
      ))}
    </section>
  )
}
