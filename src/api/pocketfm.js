// Calls into the POCKET_FM (Storywave Studio) backend's /studio API.
// Only the endpoints AlphaQ currently consumes are wrapped here — extend this
// file as more of the Ideaboard gets wired to real series data.
import { apiUrl, get, post } from './client'

export const getEmotionalCurve = (seriesId) =>
  get(`/studio/series/${encodeURIComponent(seriesId)}/emotional-curve`)

export const regenerateEmotionalCurve = (seriesId) =>
  post(`/studio/series/${encodeURIComponent(seriesId)}/emotional-curve/regenerate`, {})

export const getJob = (jobId) => get(`/studio/jobs/${encodeURIComponent(jobId)}`)

export const getCharacters = (seriesId) =>
  get(`/studio/series/${encodeURIComponent(seriesId)}/characters`)

// Lazily rendered + cached by the backend — safe to use directly as an <img src>.
export const portraitUrl = (seriesId, key, bust = '') =>
  apiUrl(
    `/studio/series/${encodeURIComponent(seriesId)}/characters/${encodeURIComponent(key)}/portrait` +
      (bust ? `?v=${bust}` : ''),
  )

export const regeneratePortrait = (seriesId, key) =>
  post(
    `/studio/series/${encodeURIComponent(seriesId)}/characters/${encodeURIComponent(key)}/portrait/regenerate`,
    {},
  )
