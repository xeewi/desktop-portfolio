import { Icon, type IconName } from '../Icon/Icon'
import './NavCard.css'

/** A big button leading somewhere: icon, title, one line about what's there. Its name starts with the title. */
export function NavCard({ icon, title, description, onClick }: { icon: IconName; title: string; description: string; onClick: () => void }) {
  return (
    <button className="ds-navcard" onClick={onClick}>
      <span className="ds-navcard__icon">
        <Icon name={icon} />
      </span>
      <span>
        <b className="ds-navcard__title">{title}</b>
        <span className="ds-navcard__text">{description}</span>
      </span>
      <span className="ds-navcard__go" aria-hidden>
        ›
      </span>
    </button>
  )
}
