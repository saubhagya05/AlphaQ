import { useEffect, useState } from 'react'

/**
 * Renders a character's portrait `<img>` with a loading skeleton and a
 * graceful fallback when there's no image (mock mode) or the request fails
 * (e.g. backend offline, generation error). The first load can take a few
 * seconds — the backend renders it lazily via Gemini on first request.
 */
export default function CharacterPortrait({ src, alt = '', className = '', fallback = null }) {
  const [status, setStatus] = useState(src ? 'loading' : 'empty')

  useEffect(() => {
    setStatus(src ? 'loading' : 'empty')
  }, [src])

  if (!src || status === 'error') {
    return fallback
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`${className} transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {status === 'loading' && (
        <div className={`${className} animate-pulse bg-neutral-800`} />
      )}
    </>
  )
}
