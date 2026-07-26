import { useCallback, useEffect, useRef, useState } from 'react'
import { getEmotionalCurve, getJob, regenerateEmotionalCurve } from '../api/pocketfm'

const POLL_MS = 1200

/**
 * Loads the top-3 emotional curve for a real POCKET_FM series and exposes a
 * `regenerate()` action that kicks off the backend job and polls it to
 * completion. When `seriesId` is falsy (no real series linked yet — every
 * demo project in AlphaQ today), this is inert: `curve` stays null and the
 * caller should fall back to its own placeholder chart data.
 */
export function useEmotionalCurve(seriesId) {
  const [curve, setCurve] = useState(null)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const load = useCallback(async () => {
    if (!seriesId) return
    setLoading(true)
    setError('')
    try {
      const data = await getEmotionalCurve(seriesId)
      setCurve(data && data.points && data.points.length ? data : null)
    } catch (err) {
      setError(err.message || 'Could not load the emotional curve.')
    } finally {
      setLoading(false)
    }
  }, [seriesId])

  useEffect(() => {
    setCurve(null)
    setError('')
    load()
  }, [load])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const regenerate = useCallback(async () => {
    if (!seriesId || regenerating) return
    setError('')
    setRegenerating(true)
    try {
      const job = await regenerateEmotionalCurve(seriesId)
      const poll = async () => {
        try {
          const status = await getJob(job.id)
          if (status.state === 'done') {
            setRegenerating(false)
            await load()
            return
          }
          if (status.state === 'error') {
            setRegenerating(false)
            setError(status.error || 'Emotional curve generation failed.')
            return
          }
          timerRef.current = setTimeout(poll, POLL_MS)
        } catch (err) {
          setRegenerating(false)
          setError(err.message || 'Lost track of the emotional curve job.')
        }
      }
      poll()
    } catch (err) {
      setRegenerating(false)
      setError(err.message || 'Could not start emotional curve generation.')
    }
  }, [seriesId, regenerating, load])

  return {
    curve,
    isLive: Boolean(seriesId),
    loading,
    regenerating,
    error,
    stale: Boolean(curve?.stale),
    regenerate,
  }
}
