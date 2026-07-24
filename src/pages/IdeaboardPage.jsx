import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, Sparkles, Volume2 } from 'lucide-react'
import { ROUTES } from '../constants/routes'
import { useApp } from '../context/AppContext'

const PANES = [
  {
    id: 'theme',
    title: 'Theme & Genre',
    body: (
      <div className="mx-auto max-w-3xl space-y-6 text-sm leading-6 text-white/55">
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">
            Core theme
          </h3>
          <p>
            A melancholic midnight journey across small-town India — longing,
            chance encounters, and the quiet courage of starting over.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">
            Emotional arcs
          </h3>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Nostalgia vs. the fear of returning home</li>
            <li>Unexpected intimacy between strangers</li>
            <li>Secrets that travel farther than the train itself</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">Genre</h3>
          <div className="flex flex-wrap gap-2">
            {['Drama', 'Slice of Life', 'Romance', 'Mystery'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#E61C38]/25 bg-[#E61C38]/10 px-3 py-1 text-xs font-medium text-[#E61C38]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-base font-semibold text-white/90">Tone</h3>
          <p>
            Soft, cinematic, and reflective — with brief moments of suspense
            that never break the quiet intimacy of the journey.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'sound',
    title: 'Sound & Narration',
    body: (
      <div className="mx-auto max-w-3xl space-y-6 text-sm leading-6 text-white/55">
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
      <div className="mx-auto max-w-3xl space-y-6 text-sm leading-6 text-white/55">
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
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask me to refine theme, sound, narration, or characters for this story.',
    },
  ])

  const project = useMemo(
    () => projects.find((item) => String(item.id) === String(projectId)),
    [projects, projectId],
  )

  const activeContent = PANES.find((pane) => pane.id === activePane)

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
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      {
        role: 'assistant',
        text: 'Got it — I can help expand that idea across theme, sound, and plot.',
      },
    ])
    setMessage('')
  }

  return (
    <section className="relative h-[calc(100vh-4rem)] overflow-hidden px-4 pt-3 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col">
        {/* Centered tabs as protrusions from the gray box */}
        <div className="relative z-10 -mb-px flex shrink-0 justify-center gap-1.5 px-4">
          {PANES.map((pane) => {
            const isActive = activePane === pane.id
            return (
              <button
                key={pane.id}
                type="button"
                onClick={() => setActivePane(pane.id)}
                className={`rounded-t-xl px-4 py-2.5 text-xs font-medium transition-colors sm:px-6 sm:text-[13px] ${
                  isActive
                    ? 'relative border border-b-0 border-white/10 bg-[#0d0d0d] text-white after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[#0d0d0d]'
                    : 'border border-transparent bg-transparent text-white/40 hover:bg-white/[0.04] hover:text-white/65'
                }`}
              >
                {pane.title}
                {isActive && (
                  <span className="mt-1.5 block h-0.5 w-full rounded-full bg-[#E61C38]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Main gray box — tabs sit on its top edge */}
        <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
            {activeContent?.body}
          </div>

          {/* Chatbox — slightly larger, translucent */}
          <div className="shrink-0 px-4 pb-5 sm:px-6">
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#E61C38]/65 bg-white/[0.05] shadow-[0_0_24px_rgba(230,28,56,0.1)] backdrop-blur-md">
              <div className="max-h-32 space-y-2 overflow-y-auto px-3.5 pt-3 pb-2">
                {messages.map((entry, index) => (
                  <div
                    key={`${entry.role}-${index}`}
                    className={`flex ${
                      entry.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                        entry.role === 'user'
                          ? 'bg-[#E61C38]/25 text-white/90'
                          : 'bg-white/[0.06] text-white/55'
                      }`}
                    >
                      {entry.role === 'assistant' && (
                        <Sparkles className="mb-0.5 inline h-3 w-3 text-[#E61C38]" />
                      )}{' '}
                      {entry.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E61C38]/20 p-2.5">
                <div className="flex items-center gap-2 rounded-xl border border-[#E61C38]/30 bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessage()
                    }}
                    placeholder="Ask anything about this story…"
                    className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E61C38] text-white transition-opacity hover:opacity-90"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
