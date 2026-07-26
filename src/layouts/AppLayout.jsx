import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, UserCircle } from 'lucide-react'
import PocketLogo from '../components/PocketLogo'
import { ROUTES } from '../constants/routes'
import { useApp } from '../context/AppContext'

export default function AppLayout() {
  const { focusMode, setFocusMode } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === ROUTES.DASHBOARD
  const isIdeaboard = location.pathname.startsWith(ROUTES.IDEABOARD)

  useEffect(() => {
    if (location.pathname !== ROUTES.WRITE) {
      setFocusMode(false)
    }
  }, [location.pathname, setFocusMode])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Navbar — always visible (no focusMode banner) */}
      {!isIdeaboard && (
        <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-black/80 px-4 backdrop-blur sm:px-6">
          {isDashboard ? (
            <>
              {/* Left: red P box + "Pocket FM" + "|" + "Dashboard" */}
              <div className="flex select-none items-center gap-3">
                {/* Red square icon */}
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E61C38] shadow-[0_0_14px_rgba(230,28,56,0.35)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M5.5 6.8A3.3 3.3 0 0 1 8.8 3.5h6.4a3.3 3.3 0 0 1 3.3 3.3v7.4a3.3 3.3 0 0 1-3.3 3.3H10l-3.8 3v-3.4a3.3 3.3 0 0 1-.7-2V6.8Z"
                      fill="white"
                    />
                    <path d="m10.5 8 4.5 2.7-4.5 2.8V8Z" fill="#E61C38" />
                  </svg>
                </span>
                {/* "Pocket FM" text */}
                <span className="text-base font-bold tracking-tight text-white">
                  Pocket FM
                </span>
                {/* Pipe separator */}
                <span className="h-5 w-px bg-white/20" />
                {/* "Dashboard" label */}
                <h1 className="text-base font-semibold tracking-tight text-white">
                  Dashboard
                </h1>
              </div>

              {/* Right: user + logout */}
              <div className="flex items-center gap-1 sm:gap-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <UserCircle className="h-5 w-5 text-white/50" strokeWidth={1.5} />
                  <span className="hidden sm:inline text-sm font-medium text-white/80">Chaitanya</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.alert('You have been logged out.')}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:text-[#E61C38]"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.7} />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to={ROUTES.DASHBOARD} className="flex select-none items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-[#E61C38]">
                  Pocket FM
                </span>
                <span className="text-white/20">|</span>
                <span className="text-lg font-medium tracking-tight text-white">
                  Creator Studio
                </span>
              </Link>
              <button
                type="button"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#E61C38]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Dashboard
              </button>
            </>
          )}
        </header>
      )}

      <main
        className={`relative min-h-screen transition-all duration-300 ${
          isIdeaboard ? 'pt-0' : 'pt-16'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}
