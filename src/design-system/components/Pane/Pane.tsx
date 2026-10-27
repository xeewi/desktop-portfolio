import type { ReactNode } from 'react'
import './Pane.css'

/** Padded content area inside a window. */
export function Pane({ children }: { children: ReactNode }) {
  return <div className="ds-pane">{children}</div>
}
