import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, PenLine, Home, Sparkles, Menu, Maximize2, Languages, ArrowLeft, Send } from 'lucide-react'
import AILoadingScreen from './AILoadingScreen.jsx'

// Colorful multi-point Gemini-style sparkle icon
function GeminiSparkle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="45%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#E61C38" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c.4 3.7 1.6 6.4 3.6 8.4C17.6 12.4 20.3 13.6 24 14c-3.7.4-6.4 1.6-8.4 3.6C13.6 19.6 12.4 22.3 12 26c-.4-3.7-1.6-6.4-3.6-8.4C6.4 15.6 3.7 14.4 0 14c3.7-.4 6.4-1.6 8.4-3.6C10.4 8.4 11.6 5.7 12 2z"
        fill="url(#gemini-grad)"
        transform="scale(0.85) translate(2.1 -0.9)"
      />
    </svg>
  )
}

// Fullscreen API helpers (no-ops if unsupported / rejected)
const requestFullscreen = () => {
  const el = document.documentElement
  const fn = el.requestFullscreen || el.webkitRequestFullscreen
  if (fn) Promise.resolve(fn.call(el)).catch(() => {})
}
const exitFullscreen = () => {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) return
  const fn = document.exitFullscreen || document.webkitExitFullscreen
  if (fn) Promise.resolve(fn.call(document)).catch(() => {})
}

export default function App() {
  // ---- Central state ----
  const [currentView, setCurrentView] = useState('home') // 'home' | 'mic' | 'write'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [storyOutput, setStoryOutput] = useState(null)
  const [inputText, setInputText] = useState('')
  const [showBanner, setShowBanner] = useState(false) // kept for potential future use

  // Keep isFullscreen in sync with the actual browser state.
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(
        Boolean(document.fullscreenElement || document.webkitFullscreenElement)
      )
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  // ---- Write flow handlers ----
  const handleSend = () => {
    setStoryOutput(null)
    setIsLoading(true)
    // Mock latency = 2 full carton loops (CYCLE 8s x 2). Later: end when the
    // real API response arrives instead of this fixed timeout.
    setTimeout(() => {
      setIsLoading(false)
      setStoryOutput(MOCK_STORY(inputText))
    }, 16000)
  }

  const handleReset = () => {
    setIsLoading(false)
    setStoryOutput(null)
    setInputText('')
  }

  const goTo = (view) => {
    if (view === 'write') {
      requestFullscreen()
    } else {
      exitFullscreen()
      handleReset()
    }
    setCurrentView(view)
  }

  // Navbar always visible — even in fullscreen write mode
  const navHidden = false


  return (

    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Top navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/80 backdrop-blur">
          <div className="flex items-center gap-2 select-none">
            <span className="text-[#E61C38] font-extrabold tracking-tight text-lg">Pocket FM</span>
            <span className="text-white/20">|</span>
            <span className="text-white font-medium tracking-tight text-lg">Creator Studio</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'home') goTo('home')
              else if (window.history.length > 1) window.history.back()
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#E61C38]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Dashboard
          </button>
      </header>

      {/* Main content */}
      <main className="relative min-h-screen pt-16">
        {currentView === 'home' && <HomeView onSelect={goTo} />}
        {currentView === 'mic' && <MicView />}
        {currentView === 'write' && (
          <WriteView
            isFullscreen={isFullscreen}
            isLoading={isLoading}
            storyOutput={storyOutput}
            inputText={inputText}
            setInputText={setInputText}
            onSend={handleSend}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

// Mock AI script generator — replace with a real API response.
const MOCK_STORY = (idea) => {
  const seed = idea.trim() || 'a lone traveller returning to their village in Bharat'
  return `TITLE: Echoes of Solitude

LOGLINE
A story about ${seed} — where silence becomes the loudest voice.

[SCENE 1 — DUSK / OPEN COURTYARD]
The wind carries dust across an empty courtyard. A single lamp flickers.
NARRATOR (V.O.): "Some stories are not spoken. They are felt in the quiet."

[SCENE 2 — INT. MEMORY]
Fragments of the past surface — a promise made, a road not taken.
The protagonist confronts the weight of everything left unsaid.

[CLIMAX]
In solitude, clarity arrives. The choice is made — not out of fear, but resolve.

— Generated by Pocket FM Creator Studio · adjust tone, characters & climax as needed.`
}

const PLACEHOLDERS = {
  en: 'Express Yourself in Solitude...',
  hi: 'अपने मन को एकांत में रखें...',
}

function WriteView({ isFullscreen, isLoading, storyOutput, inputText, setInputText, onSend, onReset }) {
  const [lang, setLang] = useState('en')

  return (
    <div
      className="relative flex h-screen w-full flex-col bg-[#0a0a0a]"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(100,0,15,0.18), #0a0a0a 70%)' }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* ---- Loading ---- */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-full w-full items-center justify-center"
          >
            <AILoadingScreen />
          </motion.div>
        ) : storyOutput ? (
          /* ---- Output ---- */
          <motion.div
            key="output"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-1 flex-col overflow-auto p-10 md:p-20"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E61C38]">
                <GeminiSparkle className="w-4 h-4" />
                Your Generated Script
              </div>
              <button
                onClick={onReset}
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-[#E61C38]/60 hover:text-[#E61C38]"
              >
                Start Over
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-base leading-8 text-gray-200 flex-1">
              {storyOutput}
            </pre>
          </motion.div>
        ) : (
          /* ---- Input (iA Writer-style) ---- */
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-1 flex-col"
          >
            {/* Giant focused textarea */}
            <div
              className="relative mx-auto my-8 flex flex-1 w-full max-w-5xl flex-col rounded-2xl"
              style={{
                border: '1.5px solid rgba(180,20,40,0.25)',
                boxShadow: '0 0 60px rgba(180,20,40,0.12), inset 0 0 40px rgba(0,0,0,0.4)',
                background: '#0e0e0e',
              }}
            >
              <textarea
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={PLACEHOLDERS[lang]}
                className="flex-1 w-full resize-none bg-transparent px-10 pt-10 pb-4 text-white text-xl md:text-2xl leading-9 tracking-wide outline-none placeholder:text-white/40"
                style={{ minHeight: 'calc(100vh - 240px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 }}
              />

              {/* Bottom bar inside the box */}
              <div className="flex items-center justify-between px-8 py-4 border-t border-white/5">
                <button
                  onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
                  className="flex items-center gap-1.5 text-white/25 hover:text-white/70 transition-colors text-sm"
                >
                  <Languages size={15} strokeWidth={1.5} />
                  <span className="font-medium">{lang === 'en' ? 'EN' : 'हिं'}</span>
                </button>

                <button
                  onClick={onSend}
                  disabled={!inputText.trim()}
                  className="flex items-center gap-2.5 rounded-full bg-[#E61C38] hover:bg-[#ff2244] px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-[0_0_24px_rgba(230,28,56,0.35)] disabled:opacity-25 disabled:shadow-none active:scale-95"
                >
                  <GeminiSparkle className="w-3.5 h-3.5" />
                  Send to AI
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Custom home icons (match reference) ---------------- */
function VintageMicIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Microphone capsule */}
      <rect x="60" y="20" width="80" height="140" rx="40" />

      {/* Top grille */}
      <line x1="82" y1="32" x2="82" y2="48" />
      <line x1="100" y1="28" x2="100" y2="48" />
      <line x1="118" y1="32" x2="118" y2="48" />

      {/* Left grille */}
      <line x1="60" y1="70" x2="82" y2="70" />
      <line x1="60" y1="90" x2="82" y2="90" />
      <line x1="60" y1="110" x2="82" y2="110" />

      {/* Right grille */}
      <line x1="118" y1="70" x2="140" y2="70" />
      <line x1="118" y1="90" x2="140" y2="90" />
      <line x1="118" y1="110" x2="140" y2="110" />

      {/* Stand */}
      <path d="M45 86v42a55 55 0 0 0 110 0V86" />

      {/* Stem */}
      <line x1="100" y1="183" x2="100" y2="210" />
      <line x1="92" y1="183" x2="92" y2="210" />

      {/* Base */}
      <rect x="72" y="214" width="56" height="12" rx="6" />
    </svg>
  );
}

function WriteStoryIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Paper */}
      <path d="
        M42 20
        H122
        Q132 20 132 30
        V145
        L108 170
        H42
        Q30 170 30 158
        V32
        Q30 20 42 20
      " />

      {/* Folded corner */}
      <path d="M108 170V146H132" />

      {/* Text lines */}
      <line x1="52" y1="50" x2="105" y2="50" />
      <line x1="52" y1="68" x2="98" y2="68" />
      <line x1="52" y1="86" x2="92" y2="86" />
      <line x1="52" y1="104" x2="84" y2="104" />
      <path d="M54 128c4-5 8 5 12 0 4-5 8 5 12 0" />

      {/* Pencil Body */}
      <g transform="rotate(-42 128 82)">
        <rect
          x="118"
          y="38"
          width="24"
          height="94"
          rx="8"
        />

        {/* Eraser */}
        <line x1="118" y1="58" x2="142" y2="58" />

        {/* Metal band */}
        <line x1="118" y1="68" x2="142" y2="68" />

        {/* Wood */}
        <path d="
          M118 132
          L130 150
          L142 132
        " />

        {/* Lead */}
        <line x1="130" y1="150" x2="130" y2="142" />
      </g>
    </svg>
  );
}

/* ---------------- Page 1: Landing ---------------- */
function HomeView({ onSelect }) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6">
      {/* Deep black center */}
      <div className="pointer-events-none absolute inset-0 bg-black" />

      <div className="relative z-10 flex items-center justify-center gap-16 md:gap-28">
        <ActionTile
          icon={<VintageMicIcon className="h-24 w-16" />}
          label="Speak"
          onClick={() => onSelect('mic')}
        />
        <ActionTile
          icon={<WriteStoryIcon className="h-24 w-20" />}
          label="Write"
          onClick={() => onSelect('write')}
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

/* ---------------- Page 2: Mic ---------------- */
function MicView() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(230,28,56,0.06), rgba(0,0,0,0) 70%)',
        }}
      />
      <p className="relative z-10 max-w-xl text-center text-lg md:text-xl font-light text-gray-300">
        For optimal AI assistance, keep your spoken story brief and concise.
      </p>
      <Mic
        className="relative z-10 mt-10 w-6 h-6 text-gray-600"
        strokeWidth={1.25}
      />
    </section>
  )
}

