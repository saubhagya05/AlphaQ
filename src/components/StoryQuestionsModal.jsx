import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Loader2, Sparkles, X } from 'lucide-react'

/* ─── Mock data (replace with LLM-generated questions later) ─── */

const QUESTIONS = [
  "Who is the central character — and what is the one thing they want more than anything else?",
  "What single event kicks your story into motion? The moment everything changes.",
  "What emotion should your audience carry long after the story ends?",
]

const AUTO_ANSWERS = [
  "A disgraced detective named Meera — she wants to reclaim the truth of a case she can no longer remember, even if that truth destroys what little she has left.",
  "The discovery of an artifact bearing a warning in her own handwriting, dated three years into a future she hasn't lived yet.",
  "Bittersweet clarity — the feeling that some questions are worth asking even if the answers cost everything.",
]

/* ─── Component ─────────────────────────────────────────────── */

export default function StoryQuestionsModal({ onComplete, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const total = QUESTIONS.length
  const isLast = currentIdx === total - 1

  const advance = (answerObj) => {
    const next = [...answers, answerObj]
    setAnswers(next)
    setInputValue('')
    setIsGenerating(false)
    if (isLast) {
      onComplete(next)
    } else {
      setCurrentIdx((i) => i + 1)
    }
  }

  const handleNext = () => advance({ text: inputValue.trim(), skipped: false })
  const handleSkip = () => advance({ text: '', skipped: true })

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulates LLM generating an answer; replace with real call later
    setTimeout(() => {
      setInputValue(AUTO_ANSWERS[currentIdx])
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-[#0A0A0A]"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {/* Top progress bar */}
        <div className="h-0.5 w-full bg-neutral-900">
          <motion.div
            className="h-full bg-[#E61C38]"
            animate={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <div className="p-8">
          {/* Counter row */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold tracking-[0.25em] text-neutral-600 uppercase">
              Question {currentIdx + 1} / {total}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* Question text — slides on change */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentIdx}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mb-6 text-xl font-bold leading-snug text-white"
            >
              {QUESTIONS[currentIdx]}
            </motion.h2>
          </AnimatePresence>

          {/* ── Answer area ── */}
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-neutral-700"
              disabled={isGenerating}
            />

            {/* Generating overlay */}
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-950/90">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin text-[#E61C38]" strokeWidth={2} />
                  Generating answer...
                </div>
              </div>
            )}
          </div>

          {/* ── Action row ── */}
          <div className="mt-5 flex items-center justify-between">

            {/* Generate for me */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E61C38]" strokeWidth={2} />
              Generate for me
            </button>

            {/* Skip + Next/Submit */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-400"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!inputValue.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#E61C38] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isLast ? 'Submit to AI' : 'Next'}
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
