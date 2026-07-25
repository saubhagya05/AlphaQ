import { Clock3, MoreHorizontal, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useApp } from '../context/AppContext'

export default function DashboardPage() {
  const { projects } = useApp()
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
          <p
            className="text-base font-medium tracking-[0.2em] text-[#E61C38] uppercase sm:text-lg"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Creator workspace
          </p>
          <h2
            className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Your stories
          </h2>
          <p
            className="mt-3 max-w-xl text-sm leading-6 text-white/40"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Continue an existing story or start something new.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => navigate(ROUTES.ideaboard(project.id))}
            />
          ))}
          <button
            type="button"
            onClick={() => navigate(ROUTES.STUDIO)}
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
    <article className="group relative h-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-[#E61C38]/50 hover:shadow-[0_0_20px_rgba(230,28,56,0.18)]">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-10"
        aria-label={`Open ${project.title}`}
      />

      {/* Full-bleed thumbnail */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.accent} transition-transform duration-500 group-hover:scale-105`}
      />
      {project.cover && (
        <img
          src={project.cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Readability overlay — same pattern as character cards */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />

      {/* Top details */}
      <div className="absolute top-0 right-0 left-0 z-20 flex items-start justify-between p-4">
        <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white/70 uppercase backdrop-blur-sm">
          {project.type}
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={`More options for ${project.title}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom details */}
      <div className="absolute right-0 bottom-0 left-0 z-20 flex flex-col p-4 text-left">
        <h3 className="truncate text-lg font-bold leading-tight text-white shadow-sm">
          {project.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
          <Clock3 className="h-3 w-3" strokeWidth={1.75} />
          {project.updated}
        </div>
      </div>
    </article>
  )
}
