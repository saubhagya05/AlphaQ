import { useCallback, useEffect, useState } from 'react'
import { getCharacters } from '../api/pocketfm'
import { characterKey } from '../lib/slug'

function toDisplayCharacter(character) {
  const traits = (character.personality || '')
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))

  return {
    key: characterKey(character),
    name: character.name || 'Unnamed',
    gender: character.gender || 'Unspecified',
    role: character.is_narrator ? 'Narrator' : character.role || 'Character',
    traits: traits.length ? traits : ['Unspecified'],
    persona: character.physical_persona || character.description || '',
    backstory: character.backstory || character.details || '',
    portraitStale: Boolean(character.portrait_stale),
  }
}

/**
 * Loads the real cast for a POCKET_FM series so their portraits (and, later,
 * their full bios) can be shown instead of AlphaQ's local mock cast. Inert
 * when `seriesId` is falsy — callers should fall back to their own mock data.
 */
export function useCharacters(seriesId) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!seriesId) return
    setLoading(true)
    setError('')
    try {
      const data = await getCharacters(seriesId)
      setCharacters((data?.characters || []).map(toDisplayCharacter))
    } catch (err) {
      setError(err.message || 'Could not load the cast.')
    } finally {
      setLoading(false)
    }
  }, [seriesId])

  useEffect(() => {
    setCharacters([])
    load()
  }, [load])

  return { characters, isLive: Boolean(seriesId), loading, error, reload: load }
}
