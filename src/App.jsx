import { useState, useEffect } from 'react'
import { Mic, ArrowLeft } from 'lucide-react'

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

export default function App() {
  const [currentView, setCurrentView] = useState('home') // 'home' | 'mic' | 'write'
  const [focusMode, setFocusMode] = useState(false)

  // Escape exits focus mode
  useEffect(() => {
    if (!focusMode) return
    const onKey = (e) => {
      if (e.key === 'Escape') setFocusMode(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusMode])

  const goTo = (view) => {
    setFocusMode(false)
    setCurrentView(view)
  }

  const navHidden = focusMode

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Focus-mode banner */}
      {focusMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#7f0a1c] via-[#E61C38] to-[#7f0a1c] text-white text-center text-sm font-medium tracking-wide py-2 px-4 shadow-[0_2px_20px_rgba(230,28,56,0.35)]">
          Press Escape to exit focus mode. <span className="mx-2 text-white/50">|</span> Maximized concentration, better results.
        </div>
      )}

      {/* Top navbar */}
      {!navHidden && (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/80 backdrop-blur">
          <div className="flex items-center gap-2 select-none">
            <span className="text-[#E61C38] font-extrabold tracking-tight text-lg">Pocket FM</span>
            <span className="text-white/20">|</span>
            <span className="text-white font-medium tracking-tight text-lg">Creator Studio</span>
          </div>
          <button
            type="button"
            onClick={() => {
              // Placeholder: wire to real dashboard route when available
              if (currentView !== 'home') goTo('home')
              else if (window.history.length > 1) window.history.back()
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#E61C38]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Dashboard
          </button>
        </header>
      )}

      {/* Main content */}
      <main
        className={`relative min-h-screen transition-all duration-300 ${
          navHidden ? 'pt-10' : 'pt-16'
        }`}
      >
        {currentView === 'home' && <HomeView onSelect={goTo} />}
        {currentView === 'mic' && <MicView />}
        {currentView === 'write' && (
          <WriteView focusMode={focusMode} setFocusMode={setFocusMode} />
        )}
      </main>
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

/* ---------------- Page 3: Write ---------------- */
function WriteView({ focusMode, setFocusMode }) {
  const [text, setText] = useState('')

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Express Yourself in Solitude.
          </h2>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
            अपने मन को एकांत में रखें।
          </h2>
        </div>

        {!focusMode && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setFocusMode(true)}
              className="rounded-full border border-[#E61C38]/40 px-5 py-2 text-sm font-medium text-[#E61C38] transition-colors hover:bg-[#E61C38]/10"
            >
              Enter Focus Mode
            </button>
          </div>
        )}

        {/* Input container */}
        <div className="rounded-2xl border border-red-900/40 bg-[#121212] p-4 shadow-[0_0_40px_rgba(230,28,56,0.05)]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="मेरे नए Pocket FM कहानी के लिए विचार हैं..."
            className="h-48 w-full resize-none bg-transparent text-base text-white placeholder:text-gray-600 outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              className="rounded-full p-2 text-gray-500 transition-colors hover:text-[#E61C38]"
              title="Voice input"
            >
              <Mic className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <button className="flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-semibold transition-all hover:bg-gray-200 active:scale-[0.98]">
              <GeminiSparkle className="w-4 h-4" />
              Send to AI
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
