// The file browser in Under the hood, Architecture. Paths are relative to the repo: '' is the root,
// folders end with '/', files don't ('src/hooks/', 'src/App.tsx').

export type Entry = { name: string; path: string; dir: boolean }

export const isDir = (path: string) => path === '' || path.endsWith('/')

/** What's directly inside `dir`, folders first, then by name. */
export function list(paths: string[], dir: string): Entry[] {
  const found = new Map<string, Entry>()
  for (const p of paths) {
    if (!p.startsWith(dir) || p === dir) continue
    const rest = p.slice(dir.length)
    const cut = rest.indexOf('/')
    const e = cut < 0 ? { name: rest, path: p, dir: false } : { name: rest.slice(0, cut), path: dir + rest.slice(0, cut + 1), dir: true }
    found.set(e.path, e)
  }
  return [...found.values()].sort((a, b) => Number(b.dir) - Number(a.dir) || (a.name < b.name ? -1 : 1))
}

/** Every step from the root: 'src/apps/x.ts' → ['', 'src/', 'src/apps/', 'src/apps/x.ts']. */
export function crumbs(path: string): string[] {
  const parts = path.split('/').filter(Boolean)
  return ['', ...parts.map((_, i) => parts.slice(0, i + 1).join('/') + (i < parts.length - 1 || isDir(path) ? '/' : ''))]
}

/** Last part of a path: 'src/apps/' → 'apps', 'src/App.tsx' → 'App.tsx'. */
export const baseName = (path: string) => path.split('/').filter(Boolean).pop() ?? ''
