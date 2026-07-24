import { useNavigate } from 'react-router-dom'
import { VintageMicIcon, WriteStoryIcon } from '../components/StoryIcons'
import { ROUTES } from '../constants/routes'

export default function StudioHomePage() {
  const navigate = useNavigate()

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 bg-black" />

      <div className="relative z-10 flex items-center justify-center gap-16 md:gap-28">
        <ActionTile
          icon={<VintageMicIcon className="h-24 w-16" />}
          label="Speak"
          onClick={() => navigate(ROUTES.SPEAK)}
        />
        <ActionTile
          icon={<WriteStoryIcon className="h-24 w-20" />}
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
      onClick={onClick}
      className="group flex flex-col items-center gap-5 px-4 py-4 transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="flex h-28 w-28 items-center justify-center text-white/85 transition-colors duration-300 group-hover:text-[#E61C38]">
        {icon}
      </span>
      <span className="text-sm font-medium tracking-wide text-white/55 transition-colors group-hover:text-white">
        {label}
      </span>
    </button>
  )
}
