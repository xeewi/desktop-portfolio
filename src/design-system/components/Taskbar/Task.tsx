import { Icon, type IconName } from '../Icon/Icon'
import './Task.css'

type Props = { icon: IconName; label: string; open: boolean; active: boolean; onClick: () => void }

/** One app in the taskbar / dock. Closed apps only show in docks. */
export function Task({ icon, label, open, active, onClick }: Props) {
  return (
    <button
      className="ds-task"
      data-open={open || undefined}
      data-closed={!open || undefined}
      data-active={active || undefined}
      onClick={onClick}
      title={label}
    >
      <span className="ds-task__icon">
        <Icon name={icon} />
      </span>
      <span className="ds-task__label">{label}</span>
    </button>
  )
}
