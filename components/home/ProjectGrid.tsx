import ProjectCard from './ProjectCard'
import type { Proyecto } from '@/lib/types'

interface Props {
  proyectos: Proyecto[]
}

export default function ProjectGrid({ proyectos }: Props) {
  return (
    <section className="px-6 py-20 md:px-12 lg:px-24">
      <div className="mb-14 max-w-xl">
        <p className="mb-3 text-xs font-semibold tracking-widest text-[#2E2E2E] uppercase">
          Proyectos
        </p>
        <h2 className="text-4xl font-light tracking-wider text-[#0A0A0A] md:text-5xl">
          Nuestras parcelas
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {proyectos.map((p, i) => (
          <ProjectCard key={p.slug} proyecto={p} index={i} />
        ))}
      </div>
    </section>
  )
}
