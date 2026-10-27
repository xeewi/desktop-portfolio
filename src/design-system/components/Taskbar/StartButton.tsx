import './StartButton.css'

/** Start button / orb / "Activities" / menu-bar logo, depending on the chrome. */
export function StartButton({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      className="ds-start"
      aria-label={label}
      aria-expanded={open}
      aria-controls={open ? 'ds-startmenu' : undefined}
      // the desktop closes the menu on pointerdown: don't let that race the toggle
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onToggle}
    >
      <span className="ds-start__logo" />
      <span className="ds-start__label">{label}</span>
    </button>
  )
}
