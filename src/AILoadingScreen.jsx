import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Box, FALLING_ITEMS } from './LoadingIcons.jsx'

/**
 * AILoadingScreen
 * A cinematic, continuously looping loader:
 *   Rest    -> custom SVG items fade in, spread sparsely above the carton
 *   Drop    -> one by one, each item flies into the isometric carton hopper
 *   Process -> carton pulses while a red energy field flares behind it
 *   Reveal  -> a glowing script icon levitates out and dissolves into particles
 *   Reset   -> seamless loop
 *
 * Beneath it, a big typewriter cycles through 10 poetic status lines.
 * Palette is strictly black + crimson (#E61C38) + white/gray.
 */

// One full loop, in seconds. Every element is timed against this shared clock.
const CYCLE = 8

// --- Timeline markers (seconds within one CYCLE) ---
const SEQ_START = 0.9 // first item begins entering the carton
const SEQ_STAGGER = 0.5 // gap between successive items entering
const FALL_DURATION = 0.55 // time for an item to fly into the hopper
const ABSORB_DURATION = 0.18 // time for an item to be swallowed

const REVEAL_START = 4.5 // script icon starts rising
const REVEAL_UP = 5.3 // icon fully levitated
const REVEAL_HOVER = 6.3 // icon finishes hovering
const REVEAL_DISSOLVE = 7.2 // icon fully dissolved

const HOPPER_Y = -18 // items land in the carton opening (above stage centre)
const REVEAL_ICON_Y = -155

const t = (sec) => Math.min(Math.max(sec / CYCLE, 0), 1)

// Sparse resting spots (px, relative to stage centre) so items are spread out
// across the top rather than stacked in one place. { x, y, rot }
const REST = [
  { x: -165, y: -180, rot: -8 },
  { x: 168, y: -196, rot: 6 },
  { x: -188, y: -84, rot: -5 },
  { x: 186, y: -96, rot: 7 },
  { x: -66, y: -212, rot: -6 },
  { x: 78, y: -206, rot: 5 },
]

// Per-item choreography: fade in at rest -> hold -> fly into carton -> absorb.
function itemAnim(i) {
  const r = REST[i] ?? { x: 0, y: -200, rot: 0 }
  const fadeStart = 0.15 + i * 0.12
  const fadeEnd = fadeStart + 0.45
  const slot = SEQ_START + i * SEQ_STAGGER
  const land = slot + FALL_DURATION
  const absorbed = land + ABSORB_DURATION
  return {
    animate: {
      x: [r.x, r.x, r.x, r.x, 0, 0, r.x],
      y: [r.y, r.y, r.y, r.y, HOPPER_Y, HOPPER_Y + 8, r.y],
      opacity: [0, 0, 1, 1, 1, 0, 0],
      scale: [0.6, 0.6, 1, 1, 1, 0.22, 0.6],
      rotate: [r.rot, r.rot, 0, 0, 0, 10, r.rot],
    },
    transition: {
      duration: CYCLE,
      repeat: Infinity,
      times: [0, t(fadeStart), t(fadeEnd), t(slot), t(land), t(absorbed), 1],
      ease: ['linear', 'easeOut', 'linear', 'easeIn', 'easeOut', 'linear'],
    },
  }
}

// --- Particle field for the dissolve moment ---
const PARTICLES = Array.from({ length: 12 }, (_, k) => {
  const angle = (k / 12) * Math.PI * 2
  const dist = 55 + (k % 4) * 22
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, delay: (k % 3) * 0.04 }
})

const syncTiming = {
  duration: CYCLE,
  repeat: Infinity,
  times: [0, 0.25, 0.5, 0.72, 1],
  ease: 'easeInOut',
}

/* ---------------- Typewriter ---------------- */
const PHRASES = [
  'Brewing your story in solitude...',
  'Weaving characters from stardust...',
  'Summoning your magical spell...',
  'Painting scenes in crimson light...',
  'Whispering plots into the silence...',
  'Igniting the spark of imagination...',
  'Sculpting worlds from raw emotion...',
  'Composing your cinematic symphony...',
  'Dreaming up the perfect climax...',
  'Threading fate through every line...',
]

function Typewriter() {
  const [text, setText] = useState('')
  const idxRef = useRef(Math.floor(Math.random() * PHRASES.length))

  useEffect(() => {
    let mounted = true
    let timer
    let phrase = PHRASES[idxRef.current]
    let chars = 0
    let phase = 'typing' // 'typing' | 'holding' | 'deleting'

    const TYPE = 42 // ms per typed char
    const DELETE = 20 // ms per deleted char
    const HOLD = 1000 // ms to hold the full sentence
    const GAP = 280 // ms blank pause before the next sentence

    const tick = () => {
      if (!mounted) return
      if (phase === 'typing') {
        chars++
        setText(phrase.slice(0, chars))
        if (chars >= phrase.length) {
          phase = 'holding'
          timer = setTimeout(tick, HOLD)
        } else {
          timer = setTimeout(tick, TYPE)
        }
      } else if (phase === 'holding') {
        phase = 'deleting'
        timer = setTimeout(tick, DELETE)
      } else {
        chars--
        setText(phrase.slice(0, Math.max(chars, 0)))
        if (chars <= 0) {
          // pick a fresh random phrase (never repeat the last one)
          let next = idxRef.current
          while (next === idxRef.current) {
            next = Math.floor(Math.random() * PHRASES.length)
          }
          idxRef.current = next
          phrase = PHRASES[next]
          phase = 'typing'
          timer = setTimeout(tick, GAP)
        } else {
          timer = setTimeout(tick, DELETE)
        }
      }
    }

    timer = setTimeout(tick, 400)
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex min-h-[4rem] items-center justify-center whitespace-nowrap px-6 text-center">
      <span className="text-3xl font-light leading-tight tracking-tight text-white md:text-5xl">
        {text}
        <motion.span
          className="ml-0.5 font-thin text-[#E61C38]"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        >
          |
        </motion.span>
      </span>
    </div>
  )
}

export default function AILoadingScreen() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black">
      {/* Ambient vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 40%, rgba(230,28,56,0.10), rgba(0,0,0,0) 70%)',
        }}
      />

      {/* ---------- Animation stage (shifted slightly up) ---------- */}
      <div className="relative flex h-[500px] w-full max-w-md -translate-y-12 items-center justify-center">
        {/* Flaring red energy behind the hopper */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(230,28,56,0.55) 0%, rgba(230,28,56,0.12) 40%, rgba(0,0,0,0) 70%)',
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: [0.15, 0.4, 0.15, 0.7, 0.15],
            scale: [0.85, 1.05, 0.9, 1.25, 0.85],
          }}
          transition={syncTiming}
        />

        {/* The central carton hopper (custom isometric SVG) */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.03, 1, 1.05, 1],
            filter: [
              'drop-shadow(0 0 0px rgba(230,28,56,0))',
              'drop-shadow(0 0 10px rgba(230,28,56,0.35))',
              'drop-shadow(0 0 6px rgba(230,28,56,0.15))',
              'drop-shadow(0 0 18px rgba(230,28,56,0.7))',
              'drop-shadow(0 0 0px rgba(230,28,56,0))',
            ],
          }}
          transition={syncTiming}
        >
          <Box className="h-48 w-48" />
        </motion.div>

        {/* Sparse, sequential ingredient items */}
        {FALLING_ITEMS.map(({ key, Icon }, i) => {
          const { animate, transition } = itemAnim(i)
          return (
            <div
              key={key}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                className="drop-shadow-[0_0_10px_rgba(230,28,56,0.35)]"
                animate={animate}
                transition={transition}
              >
                <Icon className="h-14 w-14" />
              </motion.div>
            </div>
          )
        })}

        {/* Reveal: levitating script icon */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            y: [0, 0, REVEAL_ICON_Y, REVEAL_ICON_Y, REVEAL_ICON_Y - 30, 0],
            opacity: [0, 0, 1, 1, 0, 0],
            scale: [0.4, 0.4, 1, 1, 1.35, 0.4],
            filter: [
              'blur(4px)',
              'blur(4px)',
              'blur(0px)',
              'blur(0px)',
              'blur(6px)',
              'blur(4px)',
            ],
          }}
          transition={{
            duration: CYCLE,
            repeat: Infinity,
            times: [
              0,
              t(REVEAL_START),
              t(REVEAL_UP),
              t(REVEAL_HOVER),
              t(REVEAL_DISSOLVE),
              1,
            ],
            ease: 'easeInOut',
          }}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute h-16 w-16 rounded-full bg-[#E61C38]/40 blur-xl" />
            <FileText
              className="relative h-12 w-12 text-white drop-shadow-[0_0_10px_rgba(230,28,56,0.9)]"
              strokeWidth={1.25}
            />
          </div>
        </motion.div>

        {/* Dissolve particles */}
        {PARTICLES.map((p, k) => (
          <motion.div
            key={k}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#E61C38]"
            style={{ marginTop: REVEAL_ICON_Y }}
            animate={{
              x: [0, 0, p.x * 0.5, p.x, p.x],
              y: [0, 0, p.y * 0.5, p.y, p.y],
              opacity: [0, 0, 1, 0, 0],
              scale: [0, 0, 1, 0.3, 0],
            }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              times: [
                0,
                t(REVEAL_HOVER + p.delay),
                t(REVEAL_HOVER + 0.35 + p.delay),
                t(REVEAL_DISSOLVE + 0.15 + p.delay),
                1,
              ],
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Typewriter status — sits just below the carton */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{ transform: 'translate(-50%, 125px)' }}
        >
          <Typewriter />
        </div>
      </div>
    </div>
  )
}
