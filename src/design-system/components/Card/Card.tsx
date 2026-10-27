import type { ReactNode } from 'react'
import './Card.css'

/** Framed surface for a block of content. */
export function Card({ children }: { children: ReactNode }) {
  return <div className="ds-card">{children}</div>
}
