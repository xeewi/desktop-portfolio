import type { ReactNode } from 'react'
import './DesktopIcons.css'

/** Column of icons on the desktop (a home-screen grid on phones). */
export function DesktopIcons({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav className="ds-desktop-icons" aria-label={label}>
      {children}
    </nav>
  )
}
