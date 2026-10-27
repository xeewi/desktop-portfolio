import type { ReactNode } from 'react'
import './TrayButton.css'

type Props = { label: string; /** when the label is in another language */ labelLang?: string; onClick: () => void; children: ReactNode }

/** Small button in the system tray (e.g. the language switch). Its name starts with what it shows
 *  (voice control users say what they see, WCAG 2.5.3), then the label for screen readers. */
export function TrayButton({ label, labelLang, onClick, children }: Props) {
  return (
    <button className="ds-traybtn" onClick={onClick} title={label}>
      {children}
      <span className="ds-sr-only" lang={labelLang}>
        {' '}
        {label}
      </span>
    </button>
  )
}
