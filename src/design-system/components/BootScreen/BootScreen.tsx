import { useEffect } from 'react'
import './BootScreen.css'

/** Splash screen shown while "booting". Fades out by itself; a click or any key dismisses it.
 *  Hidden from screen readers: it's decoration over a page that is already usable. */
export function BootScreen({ title, subtitle, onDismiss }: { title: string; subtitle: string; onDismiss: () => void }) {
  useEffect(() => {
    document.addEventListener('keydown', onDismiss)
    return () => document.removeEventListener('keydown', onDismiss)
  }, [onDismiss])
  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- keys are handled on document
    <div className="ds-boot" onClick={onDismiss} aria-hidden>
      <div className="ds-boot__logo">G</div>
      <div className="ds-boot__spinner" />
      <p className="ds-boot__title">{title}</p>
      <small className="ds-boot__sub">{subtitle}</small>
    </div>
  )
}
