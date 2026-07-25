import { Clock3, MoreHorizontal, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useApp } from '../context/AppContext'

export default function DashboardPage() {
  const { projects } = useApp()
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-5 py-12 sm:px-8 lg:px-16">
      <div
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(230,28,56,0.13), transparent 68%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10">
          {/* "CREATOR WORKSPACE" — small red monospace caps */}
          <p
            className="text-[11px] font-semibold tracking-[0.22em] text-[#E61C38] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Creator workspace
          </p>
          {/* "Your stories" — large bold white */}
          <h2 className="mt-3 text-[2.6rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Your stories
          </h2>
          {/* subtitle */}
          <p
            className="mt-3 max-w-xl text-[13px] leading-6 text-white/45"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Continue an existing story or start something new.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            className="group flex h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-transparent p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#E61C38]/50 hover:bg-[#E61C38]/[0.02] hover:shadow-[0_18px_45px_rgba(230,28,56,0.09)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-300 group-hover:border-[#E61C38]/60 group-hover:bg-[#E61C38]/10 group-hover:text-[#E61C38]">
              <Plus className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="mt-5 text-sm font-semibold text-white/80 group-hover:text-white">
              Add new story
            </span>
            <span className="mt-1.5 text-xs text-white/40">
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
    <div 
      onClick={onOpen}
      className="group relative h-[260px] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-[#E61C38]/50 hover:shadow-[0_0_20px_rgba(230,28,56,0.18)]"
    >
      {/* Background */}
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
      
      {/* Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

      {/* Top actions */}
      <div className="absolute top-0 right-0 left-0 z-20 flex items-start justify-between p-5">
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-white/90 uppercase backdrop-blur-md">
          {project.type}
        </span>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute right-0 bottom-0 left-0 z-20 flex flex-col p-5 text-left">
        <h3 className="truncate text-xl font-bold leading-tight text-white shadow-sm">
          {project.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white/40 uppercase">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={2.5} />
          {project.updated}
        </div>
      </div>
    </div>
  )
}
