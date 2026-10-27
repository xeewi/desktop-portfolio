// The repo's text files, for the file browser in Under the hood, Architecture. Each file is its own small
// chunk, downloaded only when a visitor opens it. Images, the PDF and package-lock.json are left out.
export const SOURCES = import.meta.glob(['/{src,e2e,docs,scripts}/**/*.{ts,tsx,css,md,mjs}', '/*.{ts,json,md,html}', '!/package-lock.json'], {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

/** Every browsable path, relative to the repo ('src/App.tsx'). */
export const PATHS = Object.keys(SOURCES).map((p) => p.slice(1))

export const load = (path: string) => SOURCES['/' + path]?.() ?? Promise.resolve('')
