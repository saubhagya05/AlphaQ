export const ROUTES = {
  DASHBOARD: '/',
  STUDIO: '/studio',
  SPEAK: '/studio/speak',
  WRITE: '/studio/write',
  IDEABOARD: '/ideaboard',
  ideaboard: (projectId) => `/ideaboard/${projectId}`,
  episode: (projectId, episodeId) =>
    `/ideaboard/${projectId}/episode/${episodeId}`,
}
