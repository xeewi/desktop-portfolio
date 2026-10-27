import { useLayoutEffect, useState } from 'react'
import { applyTheme, savedOs, savedTheme, type Os, type Theme } from '../design-system'

/** Current OS + theme, applied to the page before paint (no flash of the default theme). */
export function useThemeSelection() {
  const [os, setOs] = useState(savedOs)
  const [theme, setTheme] = useState(() => savedTheme(savedOs()))
  useLayoutEffect(() => applyTheme(os, theme), [os, theme])

  /** Switches OS, restoring the theme last used on it. Returns false if it was already active. */
  const pickOs = (next: Os) => {
    if (next.id === os.id) return false
    setOs(next)
    setTheme(savedTheme(next))
    return true
  }
  return { os, theme, pickOs, pickTheme: (t: Theme) => setTheme(t) }
}
