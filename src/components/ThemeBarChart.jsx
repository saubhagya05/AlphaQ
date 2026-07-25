import { useMemo, useState } from 'react'
import { AlertTriangle, GripVertical, Sparkles, X } from 'lucide-react'

const INITIAL_THEMES = [
  { id: 'isolation', label: 'Isolation', value: 40 },
  { id: 'revenge', label: 'Revenge', value: 30 },
  { id: 'betrayal', label: 'Betrayal', value: 20 },
  { id: 'nostalgia', label: 'Nostalgia', value: 10 },
]

function themesSignature(list) {
  return list.map((theme) => `${theme.id}:${Math.round(theme.value)}`).join('|')
}

export function MakeChangesButton({
  onClick,
  label = 'Make changes',
  warning = 'Applying these changes can ripple into other parts of your story — genre balance, character arcs, episode tone, and generated audio may shift to stay consistent.',
}) {
  const [confirming, setConfirming] = useState(false)

  const confirm = () => {
    setConfirming(false)
    onClick?.()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[#E61C38] px-4 py-2 text-xs font-bold tracking-wide text-white shadow-[0_0_18px_rgba(230,28,56,0.35)] transition-transform hover:scale-[1.02] hover:bg-red-600 active:scale-95"
      >
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
        {label}
      </button>

      {confirming && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onMouseDown={() => setConfirming(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#E61C38]/40 bg-[#0A0A0A] p-6 shadow-[0_0_40px_rgba(230,28,56,0.2)]"
          >
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E61C38]/15 text-[#E61C38]">
                <AlertTriangle className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h4 className="text-base font-bold text-white">
                  Apply these changes?
                </h4>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {warning}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                className="inline-flex items-center gap-2 rounded-full bg-[#E61C38] px-4 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(230,28,56,0.35)] transition-transform hover:scale-[1.02] hover:bg-red-600 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
                Apply changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function ThemeBarChart() {
  const [committedThemes, setCommittedThemes] = useState(INITIAL_THEMES)
  const [themes, setThemes] = useState(INITIAL_THEMES)

  const dirty = useMemo(
    () => themesSignature(themes) !== themesSignature(committedThemes),
    [themes, committedThemes],
  )

  const handleSliderChange = (index, e) => {
    const newVal = parseFloat(e.target.value)
    const newThemes = [...themes]

    const oldVal = newThemes[index].value
    const diff = newVal - oldVal

    newThemes[index] = { ...newThemes[index], value: newVal }

    const otherIndices = newThemes.map((_, i) => i).filter((i) => i !== index)
    const sumOthers = 100 - oldVal

    otherIndices.forEach((i) => {
      let updatedVal = newThemes[i].value
      if (sumOthers <= 0) {
        updatedVal -= diff / otherIndices.length
      } else {
        updatedVal -= diff * (themes[i].value / sumOthers)
      }
      newThemes[i] = { ...newThemes[i], value: Math.max(0, updatedVal) }
    })

    const newSumOthers = otherIndices.reduce((acc, i) => acc + newThemes[i].value, 0)
    const targetSumOthers = 100 - newVal

    if (newSumOthers > 0) {
      otherIndices.forEach((i) => {
        newThemes[i].value = (newThemes[i].value / newSumOthers) * targetSumOthers
      })
    } else if (targetSumOthers > 0) {
      otherIndices.forEach((i) => {
        newThemes[i].value = targetSumOthers / otherIndices.length
      })
    }

    setThemes(newThemes)
  }

  const applyChanges = () => {
    setCommittedThemes(themes.map((theme) => ({ ...theme })))
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-5 border-l border-neutral-800 py-4 pr-2 pl-4 lg:mt-4">
      {themes.map((theme, idx) => (
        <div key={theme.id} className="group relative flex items-center gap-4">
          <div className="w-24 shrink-0 text-right">
            <span className="text-[15px] font-semibold tracking-wide text-white">
              {theme.label}
            </span>
          </div>

          <div className="relative flex h-[36px] flex-1 items-center">
            <div className="absolute inset-0 overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900/80 shadow-inner">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-end rounded-sm bg-gradient-to-r from-red-600 to-[#E61C38] pr-2 transition-all duration-[50ms] ease-out"
                style={{
                  width: `${theme.value}%`,
                  boxShadow: '0 0 15px rgba(230,28,56,0.5)',
                }}
              >
                <GripVertical className="h-4 w-4 text-white/80 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={theme.value}
              onChange={(e) => handleSliderChange(idx, e)}
              className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <div className="w-12 shrink-0 text-left">
            <span className="font-mono text-[15px] text-white">
              {Math.round(theme.value)}%
            </span>
          </div>
        </div>
      ))}

      {dirty && (
        <div className="mt-2 flex justify-end border-t border-neutral-800 pt-4">
          <MakeChangesButton onClick={applyChanges} />
        </div>
      )}
    </div>
  )
}
