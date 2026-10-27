import type { ReactNode } from 'react'
import './Gadgets.css'

/** Desktop sidebar holding gadgets (clock, note). Decorative: hidden from screen readers. */
export function Gadgets({ children }: { children: ReactNode }) {
  return (
    <aside className="ds-gadgets" aria-hidden>
      {children}
    </aside>
  )
}
