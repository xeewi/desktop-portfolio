import { Icon, type IconName } from '../Icon/Icon'
import './Tile.css'

/** App icon, sized for menus (sm) or the desktop (lg). */
export function Tile({ icon, size = 'sm' }: { icon: IconName; size?: 'sm' | 'lg' }) {
  return (
    <span className={'ds-tile' + (size === 'lg' ? ' ds-tile--lg' : '')}>
      <Icon name={icon} />
    </span>
  )
}
