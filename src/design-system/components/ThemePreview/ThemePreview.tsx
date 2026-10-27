import type { CSSProperties } from 'react'
import './ThemePreview.css'

/** Miniature desktop. It carries its own data-chrome + theme variables, so it renders another
 *  chrome/theme than the page's, using the very same tokens. */
export function ThemePreview({ chrome, vars }: { chrome: string; vars: Record<string, string> }) {
  return (
    <span className="ds-preview" data-chrome={chrome} style={vars as CSSProperties} aria-hidden>
      <span className="ds-preview__win">
        <span className="ds-preview__title" />
        <span className="ds-preview__body" />
      </span>
      <span className="ds-preview__bar">
        <span className="ds-preview__orb" />
      </span>
    </span>
  )
}
