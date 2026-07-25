import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronDown, Pause, Pencil, Play, Sparkles, User, X } from 'lucide-react'
import PocketLogo from '../components/PocketLogo'
import GenreRadarChart from '../components/GenreRadarChart'
import ThemeBarChart, { MakeChangesButton } from '../components/ThemeBarChart'
import EmotionalCurveChart from '../components/EmotionalCurveChart'
import IdeaRefiningLoader from '../components/IdeaRefiningLoader'
import { ROUTES } from '../constants/routes'

/* ----------------------------- Mock data ----------------------------- */

const PLOT_SUMMARY =
  'In the fog-drowned port city of Vardaan, disgraced detective Meera Kaul is pulled back into service when a string of impossible disappearances mirrors the case that once destroyed her. Each vanished soul leaves behind a single humming artifact and a warning written in her own forgotten handwriting, dated years into a future she has not yet lived.'

const STORY_LINE =
  'Meera is drawn back into the case that ruined her when vanishings leave behind humming artifacts and notes in her own hand. As the fog thickens and time begins to bend, she must face the author of her future — before Vardaan erases her for good.'

const STORY_BEATS = [
  'A dockworker vanishes, leaving a humming brass cylinder and a note in Meera’s handwriting — pulling her back onto a forbidden case as the disappearances multiply and Kabir surfaces with shifting motives.',
  'A note dated three years ahead predicts the next victim, forcing Meera beneath the city to Dr. Rao’s drowned lab, where the artifacts’ true purpose — rewriting memory — is revealed.',
  'Every thread converges at the vanishing point. Meera must choose between the future she was warned of and the past she can finally remember.',
]

const SETTING_DESC =
  'A fog-bound port city where neon rusts into the mist and time has started to leak.'

const SWOT = [
  {
    key: 'strengths',
    label: 'Strengths',
    letter: 'S',
    color: 'text-green-400',
    ring: 'border-green-500/40',
    bg: 'bg-green-500/10',
    accent: 'bg-green-400',
    badge: 'bg-green-400/15',
    points: [
      'High-concept time-warning hook that rewards binge listening.',
      'Morally grey cast anchored by a haunted, active protagonist.',
    ],
  },
  {
    key: 'weaknesses',
    label: 'Weaknesses',
    letter: 'W',
    color: 'text-red-400',
    ring: 'border-red-500/40',
    bg: 'bg-red-500/10',
    accent: 'bg-red-400',
    badge: 'bg-red-400/15',
    points: [
      'Middle episodes lean heavily on exposition.',
      'Supporting characters need clearer individual arcs.',
    ],
  },
  {
    key: 'opportunities',
    label: 'Opportunities',
    letter: 'O',
    color: 'text-blue-400',
    ring: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    accent: 'bg-blue-400',
    badge: 'bg-blue-400/15',
    points: [
      'Sound-first mystery ideal for immersive audio design.',
      'Cliffhanger structure drives strong episode-to-episode retention.',
    ],
  },
  {
    key: 'threats',
    label: 'Threats',
    letter: 'T',
    color: 'text-amber-400',
    ring: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    accent: 'bg-amber-400',
    badge: 'bg-amber-400/15',
    points: [
      'Payoff must justify the layered mystery or lose trust.',
      'Tone consistency is fragile across a long season.',
    ],
  },
]

const GENRE_TAGS = [
  { label: 'Science-Fiction', color: 'blue' },
  { label: 'Noir', color: 'neutral' },
  { label: 'Thriller', color: 'red' },
  { label: 'Mystery', color: 'purple' },
]

const THEME_TAGS = [
  { label: 'Isolation', color: 'purple' },
  { label: 'Revenge', color: 'red' },
  { label: 'Betrayal', color: 'orange' },
  { label: 'Nostalgia', color: 'blue' },
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
    persona:
      'Female, late 30s. Lean and watchful, with tired eyes, a weathered trench coat, and a detective’s stillness that reads every room before entering it.',
    backstory:
      "Once Vardaan's most decorated investigator, Meera was disgraced after a case she cannot fully remember. She returns carrying guilt, insomnia, and an uncanny instinct for patterns others miss.",
  },
  {
    name: 'Kabir Ansari',
    gender: 'Male',
    role: 'Informant',
    traits: ['Charming', 'Evasive', 'Loyal'],
    persona:
      'Male, early 30s. Wiry and quick-footed, always half-smiling, dressed in layered dockside greys that let him vanish into any crowd.',
    backstory:
      "A soft-spoken fixer who trades in secrets across the city's underbelly. Kabir knows more about Meera's lost case than he admits — and his motives shift with every tide.",
  },
  {
    name: 'Dr. Reyansh Rao',
    gender: 'Male',
    role: 'Reclusive Scientist',
    traits: ['Brilliant', 'Paranoid', 'Obsessive'],
    persona:
      'Male, late 50s. Gaunt and stooped from years in the lab, with silver-streaked hair, trembling ink-stained hands, and glasses he never cleans.',
    backstory:
      'The inventor of the humming artifacts. Reyansh vanished from public life years ago; his research may be the key to the disappearances — or their cause.',
  },
  {
    name: 'Asha',
    gender: 'Female',
    role: 'Voice Only',
    traits: ['Warm', 'Absent', 'Guiding'],
    persona:
      'Female, 60s. Never seen — only a warm, unhurried voice with a faint coastal accent, carried through crackling voicemails and half-remembered lullabies.',
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

function Modal({ open, onClose, children, size = 'md', tall = false, leaveChatBar = false }) {
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

  const maxW =
    size === '70vw'
      ? 'w-[70vw] max-w-[70vw]'
      : size === '4xl'
        ? 'max-w-4xl'
        : size === '6xl'
          ? 'max-w-6xl'
          : size === '5xl'
            ? 'max-w-5xl'
            : size === '3xl'
              ? 'max-w-3xl'
              : size === '2xl'
                ? 'max-w-2xl'
                : size === 'lg'
                  ? 'max-w-lg'
                  : 'max-w-xl'

  return (
    <div
      className={`fixed inset-0 z-[80] flex justify-center p-4 ${
        leaveChatBar
          ? 'items-start pt-10 pb-28 sm:pt-14 sm:pb-32'
          : 'items-center'
      }`}
      onMouseDown={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/85 ${
          leaveChatBar ? 'bottom-24 sm:bottom-28' : ''
        }`}
      />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`relative z-10 w-full ${maxW} overflow-y-auto rounded-xl border border-neutral-800 bg-[#0A0A0A] p-6 sm:p-8 ${
          tall
            ? leaveChatBar
              ? 'min-h-[60vh] max-h-[calc(100vh-11rem)]'
              : 'min-h-[75vh] max-h-[92vh]'
            : 'max-h-[85vh]'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
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
    <h3 className="text-2xl font-bold tracking-widest text-white uppercase">
      {children}
    </h3>
  )
}

function EditIconButton({ label, editing, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-2 transition-colors ${
        editing
          ? 'border-[#E61C38]/60 bg-[#E61C38]/10 text-[#E61C38]'
          : 'border-neutral-800 text-neutral-400 hover:border-[#E61C38]/60 hover:text-white'
      }`}
      aria-label={label}
      title={label}
    >
      {editing ? (
        <Check className="h-3.5 w-3.5" strokeWidth={2} />
      ) : (
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
      )}
    </button>
  )
}

/** Pixelated red drop-cap on each word’s first letter — same style as Genre/Theme. */
function PixelHeading({ words }) {
  return (
    <h3
      className="shrink-0 font-sans text-xl font-bold tracking-tight text-white sm:text-2xl"
      style={{ textShadow: '0 0 8px rgba(230, 28, 56, 0.35)' }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className={i > 0 ? 'ml-2' : undefined}>
          <span className="ideaboard-title-board font-normal text-[1.15em] text-[#E61C38] normal-case">
            {word.charAt(0)}
          </span>
          <span>{word.slice(1)}</span>
        </span>
      ))}
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

// Dense recorder-style waveform, same as the episode audio preview
const VOICE_WAVEFORM_BARS = Array.from({ length: 160 }, (_, i) => {
  const wave = Math.sin(i * 0.35) * 22 + Math.sin(i * 0.11) * 18
  const jitter = ((i * 7919) % 29) - 14
  return Math.min(90, Math.max(10, 45 + wave + jitter))
})

function VoicePreview() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        type="button"
        onClick={() => setPlaying((v) => !v)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E61C38] text-white shadow-[0_0_24px_rgba(230,28,56,0.35)] transition-transform hover:scale-105"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <Pause className="h-5 w-5" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
        )}
      </button>

      <div className="flex h-12 min-w-0 flex-1 items-center justify-between overflow-hidden">
        {VOICE_WAVEFORM_BARS.map((height, index) => {
          const played = index / VOICE_WAVEFORM_BARS.length < 0.28
          return (
            <span
              key={index}
              className={`w-[2px] shrink-0 rounded-full ${
                played ? 'bg-[#E61C38]' : 'bg-neutral-700'
              }`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
    </div>
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
  const [plotVisualise, setPlotVisualise] = useState(false)
  const [storyLine, setStoryLine] = useState(STORY_LINE)
  const [storyBeats, setStoryBeats] = useState(STORY_BEATS)
  const [settingText, setSettingText] = useState(SETTING_DESC)
  const [committedStoryLine, setCommittedStoryLine] = useState(STORY_LINE)
  const [committedStoryBeats, setCommittedStoryBeats] = useState(STORY_BEATS)
  const [committedSettingText, setCommittedSettingText] = useState(SETTING_DESC)
  const [editingStory, setEditingStory] = useState(false)
  const [editingSetting, setEditingSetting] = useState(false)
  const [activeCharacter, setActiveCharacter] = useState(null)
  const [openEpisode, setOpenEpisode] = useState(1)
  const [refinePrompt, setRefinePrompt] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const storyDirty =
    storyLine !== committedStoryLine ||
    storyBeats.some((beat, i) => beat !== committedStoryBeats[i])
  const settingDirty = settingText !== committedSettingText

  const applyStoryChanges = () => {
    setCommittedStoryLine(storyLine)
    setCommittedStoryBeats([...storyBeats])
    setEditingStory(false)
  }

  const applySettingChanges = () => {
    setCommittedSettingText(settingText)
    setEditingSetting(false)
  }

  const handleRefine = () => {
    if (!refinePrompt.trim()) return
    setIsRefining(true)
    setRefinePrompt('')
    setTimeout(() => setIsRefining(false), 5000)
  }

  const handleGenerate = (episode) => {
    navigate(ROUTES.episode(projectId, episode.id))
  }

  return (
    <section className="relative min-h-screen bg-black px-4 pb-32 sm:px-6 lg:px-8 ideaboard-page">
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

      <div className="mx-auto max-w-[1400px] pt-16">
        {/* Page title */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <h1 className="flex items-center justify-center gap-3 text-4xl sm:text-5xl md:text-6xl">
            <span className="ideaboard-title-idea text-[1.15em] tracking-[-0.05em] text-white uppercase">Idea</span>
            <span className="ideaboard-title-board text-[1.15em] tracking-[-0.05em] text-[#E61C38] uppercase">BOARD</span>
          </h1>
          <p className="mt-2 font-mono text-sm font-bold text-white">
            The Last Train Home — Project #{projectId}
          </p>
        </div>

        {/* Two-column bento */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">

          {/* ---- LEFT COLUMN ---- */}
          <div className="flex flex-col gap-4">

            {/* 1. Plot & Setting */}
            <button
              type="button"
              onClick={() => setModal('plot')}
              className={`${card} flex w-full flex-col p-6 text-left`}
            >
              <CardHeading>Plot and Structure</CardHeading>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-400">
                {PLOT_SUMMARY}
              </p>
              <span
                className="mt-3 text-xs font-medium text-[#E61C38] transition-colors"
              >
                Click to read more...
              </span>
            </button>

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
                    className="group relative h-48 w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all hover:border-[#E61C38]/60 hover:shadow-[0_0_15px_rgba(230,28,56,0.2)]"
                  >
                    {/* Placeholder image layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-black opacity-40 group-hover:opacity-50 transition-opacity"></div>
                    
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                    
                    {/* Text content */}
                    <div className="absolute bottom-0 left-0 flex flex-col p-4 text-left">
                      <p className="text-lg font-bold leading-tight text-white shadow-sm">
                        {ch.name}
                      </p>
                      <p className="mt-1 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
                        {ch.role.split('·')[0].trim()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---- RIGHT COLUMN (sticky sidebar) ---- */}
          <aside className="episode-guide">
            <div
              className={`rounded-xl border border-neutral-800 bg-[#0A0A0A] lg:sticky lg:top-6`}
            >
              {/* Sidebar header (Tabs) */}
              <div className="relative flex items-center gap-6 px-6 pt-6 pb-4">
                {/* Border line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-800"></div>
                <button className="relative text-[22px] tracking-tight text-white font-medium">
                  Episodes <span className="text-[10px] text-neutral-400 align-top tracking-normal">346</span>
                  {/* Purple glow underline */}
                  <div className="absolute -bottom-[17px] left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-purple-600 to-pink-500 blur-[2px]"></div>
                  <div className="absolute -bottom-[17px] left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                </button>
              </div>

              <div className="px-6 pb-6 pt-4 flex flex-col gap-7">
                {EPISODES.map((episode) => {
                  const isOpen = openEpisode === episode.id
                  return (
                    <div
                      key={episode.id}
                      className="group"
                    >
                      {/* Row header */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenEpisode(isOpen ? null : episode.id)
                        }
                        className="flex w-full flex-col text-left cursor-pointer"
                      >
                        <h4 className="text-[17px] text-white font-normal transition-colors group-hover:text-[#c084fc]">
                          E{episode.id}. {episode.title}
                        </h4>
                        <p className="mt-1.5 text-[13px] text-neutral-500 font-medium tracking-wide">
                          11:{15 + episode.id}M
                        </p>
                      </button>

                      {/* Expandable content */}
                      <div
                        className={`grid transition-all duration-250 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className="overflow-hidden">
                          <div className="rounded-lg bg-neutral-900/50 p-4 border border-neutral-800">
                            <p className="text-sm font-semibold text-neutral-200 mb-2">
                              {episode.short}
                            </p>
                            <p className="text-xs leading-5 text-neutral-400 mb-4">
                              {episode.long}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleGenerate(episode)}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E61C38] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700 active:scale-95"
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

      <Modal open={modal === 'plot'} onClose={() => setModal(null)} size="70vw">
        <div className="flex items-center gap-4 pr-10">
          <PixelHeading words={['Story', 'Line']} />
          <button
            type="button"
            onClick={() => setPlotVisualise((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
              plotVisualise
                ? 'border-[#E61C38] bg-[#E61C38]/15 text-[#E61C38]'
                : 'border-neutral-700 text-neutral-300 hover:border-[#E61C38]/60 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Visualise
          </button>
          <EditIconButton
            label={editingStory ? 'Save story line' : 'Edit story line'}
            editing={editingStory}
            onClick={() => setEditingStory((value) => !value)}
          />
        </div>

        <div className="mt-5">
          <div className="max-w-3xl">
            {editingStory ? (
              <textarea
                value={storyLine}
                onChange={(event) => setStoryLine(event.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-neutral-700 bg-black/40 px-4 py-3 text-sm leading-7 text-neutral-200 outline-none transition-colors focus:border-[#E61C38]/70"
                aria-label="Story line introduction"
              />
            ) : (
              <p className="text-sm leading-7 text-neutral-300">{storyLine}</p>
            )}
            <ul className="mt-5 space-y-3.5">
              {storyBeats.map((beat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E61C38]" />
                  {editingStory ? (
                    <textarea
                      value={beat}
                      onChange={(event) =>
                        setStoryBeats((beats) =>
                          beats.map((item, index) =>
                            index === i ? event.target.value : item,
                          ),
                        )
                      }
                      rows={2}
                      className="w-full resize-y rounded-lg border border-neutral-700 bg-black/40 px-3 py-2 text-sm leading-6 text-neutral-300 outline-none transition-colors focus:border-[#E61C38]/70"
                      aria-label={`Story beat ${i + 1}`}
                    />
                  ) : (
                    <p className="text-sm leading-6 text-neutral-400">{beat}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {storyDirty && (
            <div className="mt-4 flex justify-end">
              <MakeChangesButton onClick={applyStoryChanges} />
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-8">
          <div className="flex items-center gap-4">
            <PixelHeading words={['Setting']} />
            <EditIconButton
              label={editingSetting ? 'Save setting' : 'Edit setting'}
              editing={editingSetting}
              onClick={() => setEditingSetting((value) => !value)}
            />
          </div>
          {editingSetting ? (
            <textarea
              value={settingText}
              onChange={(event) => setSettingText(event.target.value)}
              rows={2}
              className="mt-4 w-full max-w-3xl resize-y rounded-lg border border-neutral-700 bg-black/40 px-4 py-3 text-sm leading-7 text-neutral-200 outline-none transition-colors focus:border-[#E61C38]/70"
              aria-label="Setting description"
            />
          ) : (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300">
              {settingText}
            </p>
          )}
          {settingDirty && (
            <div className="mt-4 flex justify-end">
              <MakeChangesButton onClick={applySettingChanges} />
            </div>
          )}
        </div>

        {/* SWOT matrix — always visible below Setting */}
        <div className="mt-10 border-t border-neutral-800 pt-8">
          <h4 className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
            SWOT Analysis · Literature
          </h4>
          <div className="relative mt-5 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-0">
            {/* Crosshair lines for classic SWOT look on desktop */}
            <div className="pointer-events-none absolute inset-0 hidden sm:block">
              <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-neutral-700" />
              <div className="absolute right-0 left-0 top-1/2 h-px -translate-y-1/2 bg-neutral-700" />
            </div>

            {SWOT.map((quad) => (
              <div
                key={quad.key}
                className={`relative ${quad.bg} border ${quad.ring} p-4 sm:border-0 sm:p-5`}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold ${quad.badge} ${quad.color}`}
                  >
                    {quad.letter}
                  </span>
                  <p className={`text-sm font-bold tracking-wide ${quad.color}`}>
                    {quad.label}
                  </p>
                </div>
                <ul className="space-y-2">
                  {quad.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs leading-5 text-neutral-400"
                    >
                      <span
                        className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${quad.accent}`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={modal === 'genre'} onClose={() => setModal(null)} size="70vw">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full flex-col pt-20 pl-6 lg:w-1/3 lg:pt-32 lg:pl-12 xl:w-2/5">
            <div className="flex flex-col items-start gap-6">
              <h3 
                className="shrink-0 font-sans text-7xl font-bold tracking-tight text-white" 
                style={{ textShadow: '0 0 10px rgba(230, 28, 56, 0.4)' }}
              >
                <span className="ideaboard-title-board font-normal text-[1.15em] text-[#E61C38] normal-case">G</span>
                <span>enre</span>
              </h3>
              <div className="grid w-fit grid-cols-2 gap-3">
                {GENRE_TAGS.map((tag) => (
                  <Tag key={tag.label} label={tag.label} color={tag.color} />
                ))}
              </div>
            </div>
            <p className="mt-8 text-sm leading-6 text-neutral-400">{GENRE_DESC}</p>
          </div>
          <div className="w-full lg:w-2/3 xl:w-3/5 -mt-16">
            <GenreRadarChart glowId="modal-genre-glow" />
          </div>
        </div>
      </Modal>

      <Modal open={modal === 'theme'} onClose={() => setModal(null)} size="70vw">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full flex-col pt-8 pl-6 lg:w-1/3 lg:pt-16 lg:pl-12 xl:w-2/5">
            <div className="flex flex-col items-start gap-6">
              <h3 
                className="shrink-0 font-sans text-7xl font-bold tracking-tight text-white" 
                style={{ textShadow: '0 0 10px rgba(230, 28, 56, 0.4)' }}
              >
                <span className="ideaboard-title-board font-normal text-[1.15em] text-[#E61C38] normal-case">T</span>
                <span>heme</span>
              </h3>
              <div className="grid w-fit grid-cols-2 gap-3">
                {THEME_TAGS.map((tag) => (
                  <Tag key={tag.label} label={tag.label} color={tag.color} />
                ))}
              </div>
            </div>
            <p className="mt-8 text-sm leading-6 text-neutral-400">{THEME_DESC}</p>
          </div>
          <div className="w-full lg:w-2/3 xl:w-3/5 pt-4">
            <ThemeBarChart />
            <div className="mt-8 border-l border-neutral-800 pl-4">
              <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-500 uppercase">
                Emotional Curve · Full Plot
              </p>
              <div className="mt-3">
                <EmotionalCurveChart idPrefix="theme-plot-curve" />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeCharacter !== null}
        onClose={() => setActiveCharacter(null)}
        size="lg"
        tall
        leaveChatBar
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
                Physical Persona
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {CHARACTERS[activeCharacter].persona}
              </p>
            </div>

            <div className="mt-5 border-t border-neutral-800 pt-5">
              <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Backstory
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {CHARACTERS[activeCharacter].backstory}
              </p>
            </div>

            <div className="mt-5 border-t border-neutral-800 pt-5">
              <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Voice Preview
              </p>
              <VoicePreview key={activeCharacter} />
            </div>
          </div>
        )}
      </Modal>

      {/* Refining loader — full-screen, shown while AI processes */}
      {isRefining && <IdeaRefiningLoader />}

      {/* AI Chat Bar Sticky at Bottom — above character modal so it stays usable */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-gradient-to-t from-black via-black to-transparent pt-12 pb-6 px-4 pointer-events-none">
        <div className="mx-auto max-w-[800px] relative flex items-center shadow-[0_0_30px_rgba(230,28,56,0.12)] rounded-full pointer-events-auto">
           <input
             type="text"
             value={refinePrompt}
             onChange={(e) => setRefinePrompt(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
             placeholder="Refine, edit, or ask AI..."
             className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-full pl-6 pr-16 py-4 text-[15px] text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/60 transition-colors shadow-inner"
           />
           <button
             onClick={handleRefine}
             disabled={!refinePrompt.trim()}
             className="absolute right-2 p-3 bg-[#E61C38] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-full text-white transition-transform hover:scale-105 active:scale-95 shadow-lg"
           >
             <Sparkles className="w-5 h-5" strokeWidth={2.5} />
           </button>
        </div>
      </div>
    </section>
  )
}
