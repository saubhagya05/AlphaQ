import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'The Last Train Home',
    type: 'Audio story',
    updated: 'Edited 2 hours ago',
    accent: 'from-[#5c101e] via-[#26090f] to-[#111111]',
  },
  {
    id: 2,
    title: 'Bharat Ki Kahani',
    type: 'Written story',
    updated: 'Edited yesterday',
    accent: 'from-[#3c1724] via-[#1d1016] to-[#111111]',
  },
]

export function AppProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false)
  const [projects, setProjects] = useState(INITIAL_PROJECTS)

  useEffect(() => {
    if (!focusMode) return
    const onKey = (e) => {
      if (e.key === 'Escape') setFocusMode(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusMode])

  const addProject = () => {
    setProjects((currentProjects) => [
      ...currentProjects,
      {
        id: Date.now(),
        title: `Untitled story ${currentProjects.length + 1}`,
        type: 'New project',
        updated: 'Created just now',
        accent: 'from-[#48101b] via-[#21090e] to-[#111111]',
      },
    ])
  }

  const value = useMemo(
    () => ({
      focusMode,
      setFocusMode,
      projects,
      addProject,
    }),
    [focusMode, projects],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
