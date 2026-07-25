import { useNavigate } from 'react-router-dom'
import { VintageMicIcon, WriteStoryIcon } from '../components/StoryIcons'
import { ROUTES } from '../constants/routes'

export default function StudioHomePage() {
  const navigate = useNavigate()

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-black px-6">

      {/* Natural prompt line */}
      <p
        className="mb-16 text-sm text-white/30 tracking-wide"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        I want to start a new story by...
      </p>

      {/* Two icon tiles */}
      <div className="flex items-end justify-center gap-20 md:gap-32">
        <ActionTile
          icon={<VintageMicIcon className="h-20 w-14" />}
          label="Speak"
          onClick={() => navigate(ROUTES.SPEAK)}
        />
        <ActionTile
          icon={<WriteStoryIcon className="h-20 w-16" />}
          label="Write"
          onClick={() => navigate(ROUTES.WRITE)}
        />
      </div>
    </section>
  )
}

function ActionTile({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-6 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Icon — white at rest, hover stays white (matches screenshot) */}
      <span className="flex items-end justify-center text-white/80 transition-colors duration-300 group-hover:text-white">
        {icon}
      </span>
      {/* Label */}
      <span className="text-sm font-normal tracking-wide text-white/60 transition-colors duration-300 group-hover:text-white/90">
        {label}
      </span>
    </button>
  )
}
