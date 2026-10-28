import type { Os } from '../design-system'

/** "Surprise me": a random OS other than the current one, with a random theme of it. `rand` returns [0, 1). */
export function surprise(oses: readonly Os[], current: Os, rand = Math.random) {
  const others = oses.filter((o) => o.id !== current.id)
  const os = others[Math.floor(rand() * others.length)]
  return { os, theme: os.themes[Math.floor(rand() * os.themes.length)] }
}
