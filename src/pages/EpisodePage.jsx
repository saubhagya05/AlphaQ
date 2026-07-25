import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import PocketLogo from '../components/PocketLogo'
import { ROUTES } from '../constants/routes'

/**
 * Blank placeholder page reached from the Episode Guide's
 * "Generate / Preview Episode" button. Content TBD.
 */
export default function EpisodePage() {
  const { projectId, episodeId } = useParams()
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen px-4 pb-16 sm:px-6 lg:px-8">
      {/* Corner chrome */}
      <div className="absolute top-4 right-4 left-4 z-30 flex items-center justify-between sm:top-5 sm:right-6 sm:left-6 lg:right-8 lg:left-8">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="select-none"
          aria-label="Pocket FM home"
        >
          <PocketLogo />
        </button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.ideaboard(projectId))}
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#E61C38]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Idea Board
        </button>
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center text-center">
        <p className="text-sm font-medium tracking-[0.25em] text-[#E61C38] uppercase">
          Preview
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Episode {episodeId}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-white/40">
          This episode page is intentionally blank for now — generated content
          will render here.
        </p>
      </div>
    </section>
  )
}
