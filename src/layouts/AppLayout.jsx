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
              <div className="flex select-none items-center gap-3">
                <PocketLogo />
                <span className="hidden h-5 w-px bg-white/10 sm:block" />
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-5">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <UserCircle className="h-6 w-6 text-white/55" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Chaitanya</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.alert('You have been logged out.')}
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/50 transition-colors hover:bg-[#E61C38]/10 hover:text-[#E61C38]"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.7} />
                  <span className="hidden sm:inline">Logout</span>
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
