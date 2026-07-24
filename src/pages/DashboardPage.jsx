import { Clock3, MoreHorizontal, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useApp } from '../context/AppContext'

export default function DashboardPage() {
  const { projects, addProject } = useApp()
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
      <div
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(230,28,56,0.13), transparent 68%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-9">
          <p className="text-sm font-medium tracking-[0.2em] text-[#E61C38] uppercase">
            Creator workspace
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Your stories
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
            Continue an existing story or start something new.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => navigate(ROUTES.STUDIO)}
            />
          ))}
          <button
            type="button"
            onClick={addProject}
            className="group flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#E61C38]/65 hover:bg-[#E61C38]/[0.04] hover:shadow-[0_18px_45px_rgba(230,28,56,0.09)]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-white/45 transition-all duration-300 group-hover:border-[#E61C38]/60 group-hover:bg-[#E61C38]/10 group-hover:text-[#E61C38]">
              <Plus className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <span className="mt-5 text-base font-medium text-white/70 group-hover:text-white">
              Add new story
            </span>
            <span className="mt-1.5 text-sm text-white/30">
              Create a fresh project
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, onOpen }) {
  return (
    <article className="group relative min-h-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0d] transition-all duration-300 hover:-translate-y-1 hover:border-[#E61C38]/35 hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-10"
        aria-label={`Open ${project.title}`}
      />
      <div className={`h-32 bg-gradient-to-br ${project.accent} p-5`}>
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white/55 uppercase">
            {project.type}
          </span>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="relative z-20 rounded-full p-1.5 text-white/45 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={`More options for ${project.title}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-7 h-px w-full bg-gradient-to-r from-[#E61C38]/55 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="truncate text-base font-semibold text-white/85 transition-colors group-hover:text-white">
          {project.title}
        </h3>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-white/30">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} />
          {project.updated}
        </div>
      </div>
    </article>
  )
}
