import type { ReactNode } from 'react'
import './DesktopIcons.css'

/** Column of icons on the desktop (a home-screen grid on phones).
 *  `inert` while a menu covers them: a click beside the menu only closes it, as on Windows. */
export function DesktopIcons({ label, inert, children }: { label: string; inert?: boolean; children: ReactNode }) {
  return (
    <nav className="ds-desktop-icons" aria-label={label} inert={inert}>
      {children}
    </nav>
  )
}
