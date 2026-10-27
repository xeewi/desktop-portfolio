import type { Content } from '../../content'
import type { AppId } from '../registry'

export type HoodId = keyof Content['hood']

/** What "Show me" highlights for each note: a CSS selector, and what to open first so it's on screen
 *  (an app, or the start menu). null: nothing on screen to point at. Windows have the id `win-<app id>`. */
export const HOOD_TARGETS: Record<HoodId, { selector: string; open?: AppId | 'start' } | null> = {
  windows: { selector: '#win-about', open: 'about' },
  controls: { selector: '#win-about .ds-window__controls', open: 'about' },
  themes: { selector: '#win-themes .ds-window__body', open: 'themes' },
  contrast: { selector: '#win-about .ds-window__body', open: 'about' },
  icons: { selector: '.ds-tasklist' },
  start: { selector: '.ds-startmenu', open: 'start' },
  lang: { selector: '.ds-traybtn' },
  tests: null, // inside Under the hood: its "Show me" opens the Tests screen (HoodApp.tsx)
  deps: null,
}
