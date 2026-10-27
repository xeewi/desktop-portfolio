import type { ReactNode } from 'react'
import './Desktop.css'

/** Where windows live: the page's main landmark, with its (visually hidden) h1. Layout-neutral. */
export function Workspace({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="ds-workspace">
      <h1 className="ds-sr-only">{title}</h1>
      {children}
    </main>
  )
}

/** Full-screen surface everything sits on. */
export function Desktop({ children, onPointerDown }: { children: ReactNode; onPointerDown?: () => void }) {
  return (
    <div className="ds-desktop" onPointerDown={onPointerDown}>
      {children}
    </div>
  )
}
