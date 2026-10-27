import type { ReactNode } from 'react'
import './Taskbar.css'

/** The bar: start button, running apps, tray. Becomes a top bar + dock on some chromes. */
export function Taskbar({ children }: { children: ReactNode }) {
  return <footer className="ds-taskbar">{children}</footer>
}

/** Container for <Task> buttons (taskbar strip, or a dock). */
export function TaskList({ children }: { children: ReactNode }) {
  return <div className="ds-tasklist">{children}</div>
}
