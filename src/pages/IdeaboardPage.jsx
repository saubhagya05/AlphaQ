import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Sparkles, User, X } from 'lucide-react'
import PocketLogo from '../components/PocketLogo'
import GenreRadarChart, { THEME_RADAR_DATA } from '../components/GenreRadarChart'
import { ROUTES } from '../constants/routes'

/* ----------------------------- Mock data ----------------------------- */

const PLOT_SUMMARY =
  'In the fog-drowned port city of Vardaan, disgraced detective Meera Kaul is pulled back into service when a string of impossible disappearances mirrors the case that once destroyed her. Each vanished soul leaves behind a single humming artifact and a warning written in her own forgotten handwriting, dated years into a future she has not yet lived.'

const GENRE_TAGS = [
  { label: 'Science-Fiction', color: 'blue' },
  { label: 'Noir', color: 'neutral' },
  { label: 'Thriller', color: 'red' },
]

const THEME_TAGS = [
  { label: 'Isolation', color: 'purple' },
  { label: 'Revenge', color: 'red' },
  { label: 'Betrayal', color: 'orange' },
]

const GENRE_DESC =
  'A neo-noir science-fiction thriller — rain-slicked streets, retro-future tech, and a slow-burn mystery where every answer costs more than the question. The mix leans heavy on Sci-Fi, Noir and Thriller, with mystery threading throughout.'

const THEME_DESC =
  'At its heart the story wrestles with isolation, revenge and betrayal — a protagonist cut off from everyone she trusted, chasing a vengeance that keeps rewriting who the real traitor was. Nostalgia and secrecy colour every episode.'

const CHARACTERS = [
  {
    name: 'Meera Kaul',
    gender: 'Female',
    role: 'Protagonist · Detective',
    traits: ['Guarded', 'Relentless', 'Haunted'],
    backstory:
      "Once Vardaan's most decorated investigator, Meera was disgraced after a case she cannot fully remember. She returns carrying guilt, insomnia, and an uncanny instinct for patterns others miss.",
  },
  {
    name: 'Kabir Ansari',
    gender: 'Male',
    role: 'Informant',
    traits: ['Charming', 'Evasive', 'Loyal'],
    backstory:
      "A soft-spoken fixer who trades in secrets across the city's underbelly. Kabir knows more about Meera's lost case than he admits — and his motives shift with every tide.",
  },
  {
    name: 'Dr. Reyansh Rao',
    gender: 'Male',
    role: 'Reclusive Scientist',
    traits: ['Brilliant', 'Paranoid', 'Obsessive'],
    backstory:
      'The inventor of the humming artifacts. Reyansh vanished from public life years ago; his research may be the key to the disappearances — or their cause.',
  },
  {
    name: 'Asha',
    gender: 'Female',
    role: 'Voice Only',
    traits: ['Warm', 'Absent', 'Guiding'],
    backstory:
      "Heard only through old voicemails and memory fragments, Asha is Meera's emotional north star — the reason she keeps walking into the fog.",
  },
]

const EPISODES = [
  {
    id: 1,
    title: 'The Humming Artifact',
    short: 'Meera finds the first relic at a silent crime scene.',
    long: 'A missing dockworker leaves behind nothing but a faintly humming brass cylinder — and a note in handwriting Meera swears is her own. Against orders, she takes the case.',
  },
  {
    id: 2,
    title: 'Echoes in the Fog',
    short: 'A second disappearance points to a pattern.',
    long: 'The artifacts share a frequency only Meera can hear. As she maps the vanishings across Vardaan, the fog itself seems to be listening back.',
  },
  {
    id: 3,
    title: 'The Future Handwriting',
    short: "Meera reads a warning she hasn't written yet.",
    long: 'A note dated three years ahead predicts the next victim — down to the minute. Kabir surfaces with answers that only deepen the mystery.',
  },
  {
    id: 4,
    title: "Vardaan's Underbelly",
    short: 'The trail leads beneath the city.',
    long: "Following Kabir into the drowned tunnels, Meera uncovers Dr. Rao's abandoned lab and the true purpose of the humming artifacts.",
  },
  {
    id: 5,
    title: 'The Vanishing Point',
    short: 'Meera confronts the author of her own past.',
    long: 'Every thread converges. To stop the disappearances, Meera must choose between the future she was warned of and the past she can finally remember.',
  },
]

/* ----------------------------- Primitives ----------------------------- */

function Modal({ open, onClose, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const maxW = size === 'lg' ? 'max-w-3xl' : 'max-w-xl'

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-black/85" />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`relative z-10 w-full ${maxW} max-h-[85vh] overflow-y-auto rounded-xl border border-neutral-800 bg-[#0A0A0A] p-6 sm:p-8`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  )
}

function CardHeading({ children }) {
  return (
    <h3 className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
      {children}
    </h3>
  )
}

const TAG_COLORS = {
  blue: 'text-blue-400',
  red: 'text-red-400',
  orange: 'text-orange-400',
  purple: 'text-purple-400',
  neutral: 'text-neutral-300',
}

function Tag({ label, color = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium ${TAG_COLORS[color] ?? TAG_COLORS.neutral}`}
    >
      {label}
    </span>
  )
}

function Avatar({ size = 'md' }) {
  const dim = size === 'lg' ? 'h-20 w-20' : 'h-14 w-14'
  const icon = size === 'lg' ? 'h-9 w-9' : 'h-6 w-6'
  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-500`}
    >
      <User className={icon} strokeWidth={1.5} />
    </div>
  )
}

/* ----------------------------- Page ----------------------------- */

const card =
  'rounded-xl border border-neutral-800 bg-[#0A0A0A] transition-colors hover:border-red-900/80 hover:bg-neutral-900'

export default function IdeaboardPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const [activeCharacter, setActiveCharacter] = useState(null)
  const [openEpisode, setOpenEpisode] = useState(1)

  const handleGenerate = (episode) => {
    navigate(ROUTES.episode(projectId, episode.id))
  }

  return (
    <section className="relative min-h-screen bg-black px-4 pb-20 sm:px-6 lg:px-8">
      {/* Top chrome */}
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
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Dashboard
        </button>
      </div>

      <div className="mx-auto max-w-[1400px] pt-20 sm:pt-24">
        {/* Page title */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Idea Board
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            The Last Train Home — Project #{projectId}
          </p>
        </div>

        {/* Two-column bento */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">

          {/* ---- LEFT COLUMN ---- */}
          <div className="flex flex-col gap-4">

            {/* 1. Plot & Setting */}
            <div className={`${card} p-6`}>
              <CardHeading>Plot &amp; Setting</CardHeading>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-400">
                {PLOT_SUMMARY}
              </p>
              <button
                type="button"
                onClick={() => setModal('plot')}
                className="mt-3 text-xs font-medium text-[#E61C38] transition-colors hover:text-red-400"
              >
                Click to read more...
              </button>
            </div>

            {/* 2. Genre & Theme (50/50) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setModal('genre')}
                className={`${card} flex flex-col p-6 text-left`}
              >
                <CardHeading>Genre</CardHeading>
                <div className="mt-4 flex flex-wrap gap-2">
                  {GENRE_TAGS.map((tag) => (
                    <Tag key={tag.label} label={tag.label} color={tag.color} />
                  ))}
                </div>
                <span className="mt-4 text-xs text-neutral-600">
                  Tap to view breakdown →
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModal('theme')}
                className={`${card} flex flex-col p-6 text-left`}
              >
                <CardHeading>Theme</CardHeading>
                <div className="mt-4 flex flex-wrap gap-2">
                  {THEME_TAGS.map((tag) => (
                    <Tag key={tag.label} label={tag.label} color={tag.color} />
                  ))}
                </div>
                <span className="mt-4 text-xs text-neutral-600">
                  Tap to view breakdown →
                </span>
              </button>
            </div>

            {/* 3. Characters */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <CardHeading>Characters</CardHeading>
                <span className="text-xs text-neutral-600">
                  {CHARACTERS.length} cast members
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {CHARACTERS.map((ch, i) => (
                  <button
                    key={ch.name}
                    type="button"
                    onClick={() => setActiveCharacter(i)}
                    className={`${card} flex flex-col items-center gap-3 p-5 text-center`}
                  >
                    <Avatar />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {ch.name}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {ch.gender}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---- RIGHT COLUMN (sticky sidebar) ---- */}
          <aside>
            <div
              className={`rounded-xl border border-neutral-800 bg-[#0A0A0A] lg:sticky lg:top-6`}
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
                <CardHeading>Episode Guide</CardHeading>
                <span className="text-xs text-neutral-600">
                  {EPISODES.length} episodes
                </span>
              </div>

              {/* Accordion rows */}
              <div>
                {EPISODES.map((episode) => {
                  const isOpen = openEpisode === episode.id
                  return (
                    <div
                      key={episode.id}
                      className="border-t border-neutral-800 first:border-t-0"
                    >
                      {/* Row header */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenEpisode(isOpen ? null : episode.id)
                        }
                        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-neutral-900"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            Episode {episode.id}
                          </p>
                          <p
                            className={`mt-0.5 text-xs text-neutral-500 ${isOpen ? '' : 'truncate'}`}
                          >
                            {episode.short}
                          </p>
                        </div>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 text-neutral-600 transition-transform duration-250 ${isOpen ? 'rotate-180 text-[#E61C38]' : ''}`}
                          strokeWidth={2}
                        />
                      </button>

                      {/* Expandable content */}
                      <div
                        className={`grid transition-all duration-250 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5">
                            <p className="text-xs leading-5 text-neutral-500">
                              {episode.long}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleGenerate(episode)}
                              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E61C38] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700 active:scale-95"
                            >
                              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                              Generate / Preview Episode
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ---- Modals ---- */}

      <Modal open={modal === 'plot'} onClose={() => setModal(null)}>
        <CardHeading>Plot &amp; Setting</CardHeading>
        <p className="mt-4 text-sm leading-7 text-neutral-300">{PLOT_SUMMARY}</p>
      </Modal>

      <Modal open={modal === 'genre'} onClose={() => setModal(null)} size="lg">
        <CardHeading>Genre</CardHeading>
        <div className="mt-4 flex flex-wrap gap-2">
          {GENRE_TAGS.map((tag) => (
            <Tag key={tag.label} label={tag.label} color={tag.color} />
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-neutral-400">{GENRE_DESC}</p>
        <div className="mt-4">
          <GenreRadarChart glowId="modal-genre-glow" />
        </div>
      </Modal>

      <Modal open={modal === 'theme'} onClose={() => setModal(null)} size="lg">
        <CardHeading>Theme</CardHeading>
        <div className="mt-4 flex flex-wrap gap-2">
          {THEME_TAGS.map((tag) => (
            <Tag key={tag.label} label={tag.label} color={tag.color} />
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-neutral-400">{THEME_DESC}</p>
        <div className="mt-4">
          <GenreRadarChart data={THEME_RADAR_DATA} glowId="modal-theme-glow" />
        </div>
      </Modal>

      <Modal
        open={activeCharacter !== null}
        onClose={() => setActiveCharacter(null)}
      >
        {activeCharacter !== null && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar size="lg" />
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {CHARACTERS[activeCharacter].name}
                </h3>
                <p className="mt-0.5 text-sm text-[#E61C38]">
                  {CHARACTERS[activeCharacter].role}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {CHARACTERS[activeCharacter].gender}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {CHARACTERS[activeCharacter].traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300"
                >
                  {trait}
                </span>
              ))}
            </div>

            <div className="mt-5 border-t border-neutral-800 pt-5">
              <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Backstory
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {CHARACTERS[activeCharacter].backstory}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
