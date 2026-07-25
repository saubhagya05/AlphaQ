import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Data ──────────────────────────────────────────────── */

const RAW_TEXT =
  "— she walked into the dark corridor not knowing what awaited · the artifact hummed in her pocket matching her heartbeat · the fog thickened with every step · Kabir's voice was already too late · every door opened into a room she had already dreamed · the handwriting on the wall was her own · she had been here before · she just couldn't remember when —"

const PHRASES = [
  'Recooking the recipe...',
  'Re-aligning themes...',
  'Injecting plot twists...',
  'Synthesizing voice...',
  'Rewiring character arcs...',
  'Distilling atmosphere...',
  'Calibrating tension...',
  'Reconstructing the fog...',
]

// Deterministic bar data — no Math.random in render
const BARS = Array.from({ length: 40 }, (_, i) => ({
  h: 10 + ((i * 17 + 5) % 68),
  dur: 0.52 + ((i * 13 + 3) % 8) * 0.075,
  delay: ((i * 7 + 2) % 10) * 0.055,
  scaleMin: 0.12 + ((i * 11 + 4) % 6) * 0.08,
}))

/* ─── Sub-components ─────────────────────────────────────── */

function TextStrip() {
  return (
    <span className="shrink-0 select-none whitespace-nowrap pr-20 font-mono text-sm text-neutral-600">
      {RAW_TEXT}
    </span>
  )
}

function WaveformStrip() {
  return (
    <div className="flex shrink-0 items-center gap-[3px] px-8">
      {BARS.map((bar, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            height: bar.h,
            backgroundColor: i % 7 === 0 ? '#ffffff' : '#E61C38',
          }}
          animate={{ scaleY: [1, bar.scaleMin, bar.scaleMin + 0.32, bar.scaleMin, 1] }}
          transition={{
            duration: bar.dur,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: bar.delay,
          }}
        />
      ))}
    </div>
  )
}

// Gradient fade masks — content appears/disappears at pipeline edges
const leftMask = {
  maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
}

const rightMask = {
  maskImage: 'linear-gradient(to right, black 78%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to right, black 78%, transparent 100%)',
}

/* ─── Main component ─────────────────────────────────────── */

export default function IdeaRefiningLoader() {
  const [phraseIdx, setPhraseIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setPhraseIdx((p) => (p + 1) % PHRASES.length),
      2200,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* ── Header ── */}
      <div className="mb-20 flex items-center gap-2.5">
        <motion.span
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#E61C38]"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
          AI is refining your story
        </span>
      </div>

      {/* ── Pipeline ── */}
      <div className="relative w-full -rotate-3">

        {/* Thin rail running through the full width */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-neutral-800" />

        <div className="flex">

          {/* Left: raw text train — scrolls rightward into processing box */}
          <div className="min-w-0 flex-1 overflow-hidden" style={leftMask}>
            <div className="flex h-full items-center">
              <motion.div
                className="flex"
                animate={{ x: ['-50%', '0%'] }}
                transition={{
                  duration: 28,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <TextStrip />
                <TextStrip />
              </motion.div>
            </div>
          </div>

          {/* Center: processing box */}
          <div
            className="relative z-10 w-52 shrink-0 bg-[#0A0A0A]"
            style={{
              border: '1px solid #262626',
              // Faint red inset glow signals the box is active
              boxShadow: 'inset 0 0 0 1px rgba(230,28,56,0.12)',
            }}
          >
            <div className="px-5 py-6">
              {/* Status indicator row */}
              <div className="mb-4 flex items-center gap-2">
                <motion.span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#E61C38]"
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="text-[10px] font-bold tracking-[0.22em] text-neutral-600 uppercase">
                  Processing
                </span>
              </div>

              {/* Cycling phrase */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="text-sm font-bold leading-snug text-white"
                >
                  {PHRASES[phraseIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: waveform train — scrolls rightward out of processing box */}
          <div className="min-w-0 flex-1 overflow-hidden" style={rightMask}>
            <div className="flex h-full items-center">
              <motion.div
                className="flex items-center"
                animate={{ x: ['-50%', '0%'] }}
                transition={{
                  duration: 12,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <WaveformStrip />
                <WaveformStrip />
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-20 text-center">
        <motion.p
          className="text-[11px] tracking-wider text-neutral-700"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          This usually takes a few seconds
        </motion.p>
      </div>

    </div>
  )
}
