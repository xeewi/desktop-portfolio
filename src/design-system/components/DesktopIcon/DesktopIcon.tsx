import type { IconName } from '../Icon/Icon'
import { Tile } from '../Tile/Tile'
import './DesktopIcon.css'

type Props = { icon: IconName; label: string } & ({ onOpen: () => void; href?: never } | { href: string; onOpen?: never })

/** One desktop icon: opens an app, or a link when given `href`. */
export function DesktopIcon({ icon, label, ...action }: Props) {
  const inner = (
    <>
      <Tile icon={icon} size="lg" />
      <span className="ds-desk-icon__label">{label}</span>
    </>
  )
  return action.href ? (
    <a className="ds-desk-icon" href={action.href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <button className="ds-desk-icon" onClick={action.onOpen}>
      {inner}
    </button>
  )
}
