/**
 * Resolves a project-relative asset path against Vite's configured base path, so
 * links keep working when the site is deployed under a GitHub Pages subpath
 * (e.g. "/repo-name/") instead of the domain root.
 */
export function asset(relativePath: string): string {
  const base = import.meta.env.BASE_URL
  const clean = relativePath.replace(/^\/+/, '')
  return `${base}${clean}`
}
