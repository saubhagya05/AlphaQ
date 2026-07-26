// Mirrors the backend's app/store.py `slug()` exactly, so a character name
// here resolves to the same file-stem key the POCKET_FM backend uses for
// that character's JSON record and portrait image.
export function slugify(name) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unnamed'
}

export function characterKey(character) {
  return character?.is_narrator ? 'narrator' : slugify(character?.name)
}
