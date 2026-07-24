import { useState, useEffect } from 'react'
import { Mic, PenLine, Home, Sparkles, Menu } from 'lucide-react'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Escape exits focus mode
  useEffect(() => {
    if (!focusMode) return
    const onKey = (e) => {
      if (e.key === 'Escape') setFocusMode(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusMode])

  // Leaving the write view should always cancel focus mode
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 select-none">
              <span className="text-[#E61C38] font-extrabold tracking-tight text-lg">Pocket FM</span>
              <span className="text-white/20">|</span>
              <span className="text-white font-medium tracking-tight text-lg">Creator Studio</span>
            </div>
          </div>
          <button
            onClick={() => goTo('home')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Home
          </button>
        </header>
      )}

      {/* Sidebar */}
      {!navHidden && (
        <aside
          className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] border-r border-white/5 bg-black/90 backdrop-blur transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <nav className="flex flex-col gap-2 p-3 pt-6">
            <NavItem
              icon={<Home className="w-5 h-5" strokeWidth={1.5} />}
              label="Home"
              active={currentView === 'home'}
              expanded={sidebarOpen}
              onClick={() => goTo('home')}
            />
            <NavItem
              icon={<Mic className="w-5 h-5" strokeWidth={1.5} />}
              label="Speak"
              active={currentView === 'mic'}
              expanded={sidebarOpen}
              onClick={() => goTo('mic')}
            />
            <NavItem
              icon={<PenLine className="w-5 h-5" strokeWidth={1.5} />}
              label="Write"
              active={currentView === 'write'}
              expanded={sidebarOpen}
              onClick={() => goTo('write')}
            />
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main
        className={`relative min-h-screen transition-all duration-300 ${
          navHidden ? 'pt-10' : 'pt-16'
        } ${navHidden ? '' : sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}
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

function NavItem({ icon, label, active, expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
        active
          ? 'bg-[#E61C38]/10 text-[#E61C38]'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      } ${expanded ? 'justify-start' : 'justify-center'}`}
      title={label}
    >
      {icon}
      {expanded && <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}

/* ---------------- Page 1: Landing ---------------- */
function HomeView({ onSelect }) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
      {/* dark low-opacity red radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(230,28,56,0.08), rgba(0,0,0,0) 70%)',
        }}
      />
      <h1 className="relative z-10 max-w-2xl text-center text-3xl md:text-4xl font-light leading-snug text-white/90">
        How would you like to extend your{' '}
        <span className="text-[#E61C38] font-normal">Bharat</span> content?
      </h1>

      <div className="relative z-10 mt-16 flex items-start justify-center gap-10 md:gap-20">
        <ActionTile
          icon={<Mic className="w-9 h-9" strokeWidth={1.25} />}
          label="Speak your Story"
          onClick={() => onSelect('mic')}
        />
        <ActionTile
          icon={<PenLine className="w-9 h-9" strokeWidth={1.25} />}
          label="Write your Story"
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
      className="group flex flex-col items-center gap-4 rounded-2xl px-8 py-8 transition-colors hover:bg-white/[0.02]"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 text-gray-300 transition-all duration-300 group-hover:border-[#E61C38]/60 group-hover:text-[#E61C38]">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-400 transition-colors group-hover:text-white">
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
