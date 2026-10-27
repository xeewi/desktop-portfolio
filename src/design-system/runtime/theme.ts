import { OSES, type Os, type Theme } from '../themes'
import { DESKTOP } from './media'
import { read, write } from './storage'
import { readable } from '../tokens/contrast'

export const savedOs = (): Os => OSES.find((o) => o.id === read('os')) ?? OSES.find((o) => o.id === 'vista')!
export const savedTheme = (os: Os): Theme => os.themes.find((th) => th.id === read('theme:' + os.id)) ?? os.themes[0]

/** Palette (text colours made readable, see tokens/contrast.ts) + all-size token overrides,
 *  as CSS variables (used on <html> and on previews). */
export const themeVars = (th: Theme): Record<string, string> => ({ ...readable(th.vars), ...th.tokens })

const DESKTOP_STYLE_ID = 'ds-theme-desktop-tokens'

/** Puts the OS chrome and theme on <html>, and remembers the choice. */
export function applyTheme(os: Os, th: Theme) {
  const root = document.documentElement
  root.removeAttribute('style') // drop the previous theme's variables
  for (const [k, v] of Object.entries(themeVars(th))) root.style.setProperty(k, v)
  root.dataset.chrome = os.chrome

  // desktop-only overrides can't go inline (no media queries there): one small stylesheet
  let style = document.getElementById(DESKTOP_STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = DESKTOP_STYLE_ID
    document.head.append(style)
  }
  const decls = Object.entries(th.desktopTokens ?? {}).map(([k, v]) => `${k}: ${v};`).join(' ')
  // html[data-chrome] beats the chrome files ([data-chrome]) without !important
  style.textContent = decls ? `@media ${DESKTOP} { html[data-chrome] { ${decls} } }` : ''

  write('os', os.id)
  write('theme:' + os.id, th.id)
}
