import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowLeft, Pause, Pencil, Play } from 'lucide-react'
import PocketLogo from '../components/PocketLogo'
import { ROUTES } from '../constants/routes'

const card =
  'rounded-xl border border-neutral-800 bg-[#0A0A0A]'

const EPISODE_META = {
  1: {
    title: 'The Humming Artifact',
    summary:
      'Meera discovers a faintly humming brass cylinder at a silent dockside crime scene. Against orders, she opens the case — and finds a note written in what looks like her own hand. The first thread of Vardaan’s vanishing web begins to pull.',
    duration: '12:48',
  },
  2: {
    title: 'Echoes in the Fog',
    summary:
      'A second disappearance mirrors the first. Mapping the artifacts across the city, Meera realizes the fog itself may be listening — and Kabir’s warning arrives one minute too late.',
    duration: '14:02',
  },
  3: {
    title: 'The Future Handwriting',
    summary:
      'A note dated three years ahead names the next victim to the minute. Meera races the clock while Kabir offers answers that only deepen the fracture between past and future.',
    duration: '13:21',
  },
  4: {
    title: "Vardaan's Underbelly",
    summary:
      'Following Kabir into the drowned tunnels, Meera uncovers Dr. Rao’s abandoned lab and the true purpose of the humming artifacts — a machine that rewrites memory itself.',
    duration: '15:10',
  },
  5: {
    title: 'The Vanishing Point',
    summary:
      'Every thread converges. To stop the disappearances, Meera must choose between the future she was warned of and the past she can finally remember.',
    duration: '16:44',
  },
}

const DIALOGUES = {
  1: [
    { id: 1, character: 'Narrator', line: 'Night settles over Vardaan’s docks like wet ash. Somewhere between the crates, something begins to hum.' },
    { id: 2, character: 'Meera Kaul', line: 'No signs of struggle. No footprints. Just this… cylinder. Warm to the touch.' },
    { id: 3, character: 'Officer Ravi', line: 'Captain said leave it. You’re not on this case, Kaul.' },
    { id: 4, character: 'Meera Kaul', line: 'Then log me as a witness. I’m taking it in.' },
    { id: 5, character: 'Narrator', line: 'Inside the brass shell, a folded note waits — the handwriting unmistakable. Her own.' },
    { id: 6, character: 'Meera Kaul', line: '“Don’t trust the fog.” …I never wrote this.' },
    { id: 7, character: 'Kabir Ansari', line: 'You will. Or you already did. Depends which end of the night you’re standing on.' },
    { id: 8, character: 'Meera Kaul', line: 'Who are you?' },
    { id: 9, character: 'Kabir Ansari', line: 'Someone who’s read the next page. You should too — before it reads you.' },
    { id: 10, character: 'Officer Ravi', line: 'Backup’s two minutes out. Whatever that thing is, bag it and step back.' },
    { id: 11, character: 'Meera Kaul', line: 'If I bag it, the hum stops. If the hum stops, we lose the only trail we’ve got.' },
    { id: 12, character: 'Narrator', line: 'A freighter horn cuts the dark. The cylinder answers with a thinner, higher tone.' },
    { id: 13, character: 'Kabir Ansari', line: 'That pitch means another light just went out. Warehouse district. Third street from the pier.' },
    { id: 14, character: 'Meera Kaul', line: 'You knew that before it happened.' },
    { id: 15, character: 'Kabir Ansari', line: 'I knew it after. Timing is a luxury the fog doesn’t sell.' },
    { id: 16, character: 'Asha', line: 'Meera? Your desk phone keeps ringing. They’re saying your name on the scanner.' },
    { id: 17, character: 'Meera Kaul', line: 'Tell them I’m still at the docks. And Ma — leave the porch light on.' },
    { id: 18, character: 'Narrator', line: 'The cylinder’s hum climbs half a tone. Across the bay, a second light goes dark.' },
  ],
  2: [
    { id: 1, character: 'Narrator', line: 'Fog rolls thicker than yesterday. Meera’s map of vanishings looks less like geography — more like a pulse.' },
    { id: 2, character: 'Meera Kaul', line: 'Same frequency. Same silence. They’re not random.' },
    { id: 3, character: 'Asha', line: 'Meera… you haven’t slept. Come home.' },
    { id: 4, character: 'Meera Kaul', line: 'Home is where people disappear, Ma. Not tonight.' },
    { id: 5, character: 'Kabir Ansari', line: 'The fog isn’t weather. It’s a curtain. And something is counting through it.' },
  ],
  3: [
    { id: 1, character: 'Narrator', line: 'The note is dated three years ahead. The ink is still damp.' },
    { id: 2, character: 'Meera Kaul', line: 'This predicts the next victim. Down to the minute.' },
    { id: 3, character: 'Dr. Reyansh Rao', line: 'Time isn’t a line in my lab, Detective. It’s a braid. Pull one strand and the others tighten.' },
    { id: 4, character: 'Kabir Ansari', line: 'You’ve already tried to stop this once. The braid remembers.' },
  ],
  4: [
    { id: 1, character: 'Narrator', line: 'Below Vardaan, the tunnels taste of rust and old rain.' },
    { id: 2, character: 'Meera Kaul', line: 'This lab… these are my case files. From years I haven’t lived yet.' },
    { id: 3, character: 'Dr. Reyansh Rao', line: 'The artifacts don’t steal people. They steal the version of them that remembers why they came.' },
    { id: 4, character: 'Kabir Ansari', line: 'And you, Meera, are the only one the machine can’t fully erase.' },
  ],
  5: [
    { id: 1, character: 'Narrator', line: 'Every thread meets at the vanishing point.' },
    { id: 2, character: 'Meera Kaul', line: 'If I destroy it, do I lose the past… or the future?' },
    { id: 3, character: 'Kabir Ansari', line: 'You choose which version of yourself survives the night.' },
    { id: 4, character: 'Asha', line: 'Whichever you choose, come back. I’ll leave the light on.' },
    { id: 5, character: 'Meera Kaul', line: 'Then keep it burning. I’m not done with Vardaan yet.' },
  ],
}

const STORY_STRUCTURE_DATA = [
  { beat: 'Setup', intensity: 20 },
  { beat: 'Inciting', intensity: 38 },
  { beat: 'Rising', intensity: 55 },
  { beat: 'Midpoint', intensity: 68 },
  { beat: 'Crisis', intensity: 82 },
  { beat: 'Climax', intensity: 95 },
  { beat: 'Falling', intensity: 60 },
  { beat: 'Resolution', intensity: 35 },
]

const AI_JUDGE_NOTES = [
  'Strong cold open — the humming artifact hooks attention within the first minute.',
  'Character voices are distinct; Kabir’s lines carry mystery without exposition dumps.',
  'Isolation-to-resolve arc is clear, and Asha’s call adds grounded human stakes.',
  'The self-written note is a memorable cliffhanger that sets up Episode 2 well.',
  'Sci-fi rules are hinted at nicely, but one more concrete clue would help first-time listeners.',
  'Pacing dips slightly in the middle section — consider trimming the second dock scene.',
]

const WAVEFORM_BARS = [
  12, 22, 34, 28, 45, 60, 38, 52, 70, 48, 30, 42, 66, 74, 58, 40, 26, 36, 55,
  68, 80, 62, 44, 32, 50, 72, 64, 46, 28, 20, 38, 56, 63, 47, 33, 25, 41, 59,
  71, 53, 37, 24, 35, 49, 61, 43, 29, 18, 27, 39, 51, 65, 77, 57, 42, 31, 23,
  36, 54, 69, 76, 58, 40, 27, 19, 33, 48, 62, 73, 55, 39, 26, 21, 34, 46, 60,
  70, 52, 38, 25, 17, 30, 44, 58, 67, 49, 35, 22, 29, 43, 57, 66, 50, 37, 24,
  16, 28, 40, 53, 45,
]

export default function EpisodePage() {
  const { projectId, episodeId } = useParams()
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)
  const [editing, setEditing] = useState(false)

  const meta = useMemo(
    () => EPISODE_META[episodeId] || EPISODE_META[1],
    [episodeId],
  )
  const lines = useMemo(
    () => DIALOGUES[episodeId] || DIALOGUES[1],
    [episodeId],
  )

  return (
    <section className="relative h-screen overflow-y-auto bg-black px-4 pb-16 sm:px-6 lg:px-8">
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
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Idea Board
        </button>
      </div>

      <div className="mx-auto max-w-[1400px] pt-20 sm:pt-24">
        <div className="mb-6">
          <p className="text-xs font-medium tracking-[0.2em] text-[#E61C38] uppercase">
            Episode {episodeId} · Preview
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {meta.title}
          </h1>
        </div>

        {/* Top — Audio preview */}
        <div className={`${card} mb-4 p-5 sm:p-6`}>
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Audio Preview
            </p>
            <p className="mt-1 truncate text-sm text-neutral-300">
              {meta.title} · Generated narration mix
            </p>
          </div>

          <div className="mt-5 flex items-center gap-4">
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

            <div className="flex h-12 min-w-0 flex-1 items-center justify-between">
              {WAVEFORM_BARS.map((height, index) => {
                const played = index / WAVEFORM_BARS.length < 0.28
                return (
                  <span
                    key={index}
                    className={`w-[2px] shrink-0 rounded-full ${
                      played ? 'bg-[#E61C38]' : 'bg-neutral-700'
                    }`}
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom split — dialogues matches right pane height */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.7fr_0.8fr]">
          {/* Left — Dialogues (lg: height locked to right pane) */}
          <div className={`${card} flex min-h-[420px] flex-col overflow-hidden lg:h-0 lg:min-h-full`}>
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-5 py-4">
              <div>
                <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Dialogues
                </p>
                <p className="mt-0.5 text-sm text-neutral-400">
                  {lines.length} lines · all characters
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  editing
                    ? 'bg-[#E61C38]/15 text-[#E61C38]'
                    : 'border border-neutral-700 text-neutral-300 hover:border-[#E61C38]/50 hover:text-white'
                }`}
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                {editing ? 'Editing' : 'Edit'}
              </button>
            </div>

            <div className="dialogues-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-neutral-800/80 bg-black/40 px-4 py-3"
                >
                  <p className="text-sm font-semibold tracking-wide text-[#C4B5FD]">
                    {entry.character}
                  </p>
                  {editing ? (
                    <textarea
                      defaultValue={entry.line}
                      className="mt-2 w-full resize-y rounded-md border border-neutral-800 bg-transparent p-2 text-sm leading-6 text-neutral-300 outline-none focus:border-[#E61C38]/50"
                      rows={2}
                    />
                  ) : (
                    <p className="mt-1.5 text-sm leading-6 text-neutral-300">
                      {entry.line}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Summary / Story structure / AI Judge */}
          <div className="flex h-fit flex-col gap-4">
            {/* Summary */}
            <div className={`${card} p-5`}>
              <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                Episode Summary
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {meta.summary}
              </p>
            </div>

            {/* Story structure graph */}
            <div className={`${card} p-5`}>
              <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                Story Structure
              </p>
              <div className="mt-3 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={STORY_STRUCTURE_DATA}>
                    <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="beat"
                      tick={{ fill: '#737373', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Line
                      type="monotone"
                      dataKey="intensity"
                      stroke="#E61C38"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#E61C38', strokeWidth: 0 }}
                      activeDot={false}
                      isAnimationActive
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Evaluator Judge */}
            <div className={`${card} p-5`}>
              <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                AI Evaluator Judge
              </p>
              <ul className="mt-4 space-y-2.5">
                {AI_JUDGE_NOTES.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2.5 text-sm leading-6 text-neutral-400"
                  >
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#E61C38]" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
