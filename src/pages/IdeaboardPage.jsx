import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  Volume2,
} from 'lucide-react'
import PocketLogo from '../components/PocketLogo'
import ThemeGenrePanel from '../components/ThemeGenrePanel'
import { ROUTES } from '../constants/routes'
import { useApp } from '../context/AppContext'

const PANES = [
  {
    id: 'theme',
    title: 'Theme & Genre',
    body: <ThemeGenrePanel />,
  },
  {
    id: 'sound',
    title: 'Sound & Narration',
    body: (
      <div className="w-full space-y-6 text-left text-sm leading-6 text-white/55">
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">
            Narration style
          </h3>
          <p>
            Warm baritone narration with soft train ambience, distant station
            announcements, and a sparse sitar motif under emotional beats.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs tracking-wide text-white/35 uppercase">
              Narrator
            </p>
            <p className="mt-1 font-medium text-white/80">Arjun Mehta</p>
            <p className="mt-1 text-xs text-white/40">Warm · Intimate · Clear</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs tracking-wide text-white/35 uppercase">Tempo</p>
            <p className="mt-1 font-medium text-white/80">72 bpm · Soft</p>
            <p className="mt-1 text-xs text-white/40">Slow builds, quiet pauses</p>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">
            Soundscape cues
          </h3>
          <ul className="space-y-2">
            {[
              'Train wheels on tracks — constant low bed',
              'Rain against compartment windows at 00:48',
              'Distant chai vendor call when doors open',
              'Sitar motif enters on Meera’s flashback',
            ].map((cue) => (
              <li
                key={cue}
                className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <Volume2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#E61C38]"
                  strokeWidth={1.5}
                />
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'plot',
    title: 'Plot & Characters',
    body: (
      <div className="w-full space-y-6 text-left text-sm leading-6 text-white/55">
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">Synopsis</h3>
          <p>
            Meera boards the last train home after ten years away. A stranger
            shares her compartment — and a secret that reshapes the journey.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">
            Key beats
          </h3>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Meera almost misses the train; boards breathless</li>
            <li>Kabir offers her the window seat without speaking</li>
            <li>A shared silence breaks over tea and old songs</li>
            <li>Kabir’s secret forces Meera to confront her past</li>
            <li>Dawn arrives as both choose a different kind of home</li>
          </ol>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">
            Characters
          </h3>
          <ul className="space-y-2">
            <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-medium text-white/80">Meera Sharma</span>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Protagonist · 32 · Returning home after a decade in Mumbai.
                Guarded, observant, quietly hopeful.
              </p>
            </li>
            <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-medium text-white/80">Kabir Ansari</span>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Mysterious fellow passenger · Soft-spoken, carries an old
                letter, knows more about Meera’s hometown than he should.
              </p>
            </li>
            <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-medium text-white/80">Asha (voice only)</span>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Meera’s mother · Heard in phone voicemails and memory
                fragments — the emotional north star of the story.
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
]

export default function IdeaboardPage() {
  const { projectId } = useParams()
  const { projects } = useApp()
  const navigate = useNavigate()
  const [activePane, setActivePane] = useState('theme')
  const [paneOpen, setPaneOpen] = useState(true)
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)
  const MAX_PROMPT_LINES = 10

  const project = useMemo(
    () => projects.find((item) => String(item.id) === String(projectId)),
    [projects, projectId],
  )

  const activeContent = PANES.find((pane) => pane.id === activePane)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    const styles = window.getComputedStyle(el)
    const lineHeight = Number.parseFloat(styles.lineHeight) || 20
    const paddingY =
      Number.parseFloat(styles.paddingTop) +
      Number.parseFloat(styles.paddingBottom)
    const maxHeight = lineHeight * MAX_PROMPT_LINES + paddingY

    el.style.height = 'auto'
    const nextHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${nextHeight}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [message])

  if (!project) {
    return (
      <section className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-6">
        <p className="text-white/50">Story not found.</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="text-sm text-[#E61C38] hover:underline"
        >
          Back to Dashboard
        </button>
      </section>
    )
  }

  const sendMessage = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    setMessage('')
  }

  return (
    <section className="relative h-screen overflow-hidden px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
      {/* Corner chrome — stays at absolute top */}
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
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#E61C38]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Dashboard
        </button>
      </div>

      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col pt-[15px]">
        {/* IdeaBoard title */}
        <div className="mb-5 shrink-0 text-center sm:mb-6">
          <h1 className="ideaboard-title -rotate-1 text-4xl sm:text-5xl md:text-6xl">
            <span className="ideaboard-title-word ideaboard-title-idea">
              Idea
            </span>
            <span className="ideaboard-title-word ideaboard-title-board ml-2 sm:ml-3">
              Board
            </span>
          </h1>
        </div>

        {/* Body: foldable left pane + open content */}
        <div className="relative flex min-h-0 flex-1">
          {/* Foldable left pane */}
          <aside
            className={`relative flex shrink-0 flex-col transition-all duration-300 ease-out ${
              paneOpen ? 'mr-5 w-52 sm:mr-6 sm:w-56' : 'mr-0 w-0'
            }`}
          >
            <div
              className={`flex h-full flex-col overflow-hidden transition-opacity duration-200 ${
                paneOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="mb-3 flex items-center justify-between pr-1">
                <p className="text-[11px] font-medium tracking-[0.18em] text-white/30 uppercase">
                  Sections
                </p>
                <button
                  type="button"
                  onClick={() => setPaneOpen(false)}
                  title="Collapse"
                  className="group relative rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Collapse"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                  <span className="pointer-events-none absolute top-1/2 left-full z-30 ml-2 -translate-y-1/2 rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-[11px] whitespace-nowrap text-white/80 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    Collapse
                  </span>
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {PANES.map((pane) => {
                  const isActive = activePane === pane.id
                  return (
                    <button
                      key={pane.id}
                      type="button"
                      onClick={() => setActivePane(pane.id)}
                      className={`rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#E61C38]/15 text-white shadow-[inset_3px_0_0_0_#E61C38]'
                          : 'text-white/45 hover:bg-white/[0.04] hover:text-white/75'
                      }`}
                    >
                      {pane.title}
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Re-open tab when pane is closed */}
          {!paneOpen && (
            <button
              type="button"
              onClick={() => setPaneOpen(true)}
              title="Expand"
              className="group absolute top-0 left-0 z-20 flex items-center gap-1 rounded-r-xl border border-l-0 border-white/10 bg-white/[0.04] px-1.5 py-3 text-white/50 transition-colors hover:bg-[#E61C38]/15 hover:text-white"
              aria-label="Expand"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              <span className="pointer-events-none absolute top-1/2 left-full z-30 ml-2 -translate-y-1/2 rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-[11px] whitespace-nowrap text-white/80 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Expand
              </span>
            </button>
          )}

          {/* Content + chat — no gray box */}
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto pb-10 pl-[30px] pr-2 sm:pr-4">
              {activeContent?.body}
            </div>

            {/* Chatbox — half overlapping bottom edge */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 translate-y-1/2">
              <div className="pointer-events-auto mx-auto flex w-full max-w-2xl items-end gap-2 rounded-2xl border border-[#E61C38]/65 bg-[#121212]/95 px-3 py-2 shadow-[0_0_24px_rgba(230,28,56,0.15)] backdrop-blur-md sm:px-4 sm:py-2.5">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me to refine theme, sound, narration, or characters for this story…"
                  className="min-h-[1.25rem] min-w-0 flex-1 resize-none bg-transparent text-xs leading-5 text-white outline-none placeholder:text-white/40 sm:min-h-[1.25rem] sm:text-sm sm:leading-5"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E61C38] text-white transition-opacity hover:opacity-90"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
