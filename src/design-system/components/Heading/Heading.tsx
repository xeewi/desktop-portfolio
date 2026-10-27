import type { ReactNode } from 'react'
import './Heading.css'

/** Section title (h3) or item title (h4). The page has a hidden h1 and each window title is an h2.
 *  `tabIndex={-1}`: lets the app move focus to it, after going to another screen. */
export function Heading({ level, tabIndex, children }: { level: 3 | 4; tabIndex?: -1; children: ReactNode }) {
  const Tag = level === 3 ? 'h3' : 'h4'
  return (
    <Tag className={'ds-heading ds-heading--' + level} tabIndex={tabIndex}>
      {children}
    </Tag>
  )
}
