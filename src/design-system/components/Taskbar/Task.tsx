import { Icon, type IconName } from '../Icon/Icon'
import './Task.css'

type Props = { id?: string; icon: IconName; label: string; open: boolean; active: boolean; onClick: () => void }

/** One app in the taskbar / dock. Closed apps only show in docks. */
export function Task({ id, icon, label, open, active, onClick }: Props) {
  return (
    <button
      id={id}
      className="ds-task"
      data-open={open || undefined}
      data-closed={!open || undefined}
      data-active={active || undefined}
      onClick={onClick}
      // --mx: where the pointer is, for the Windows 7 glow that follows it (--task-hover-bg)
      onPointerMove={(e) => e.currentTarget.style.setProperty('--mx', `${e.clientX - e.currentTarget.getBoundingClientRect().left}px`)}
      title={label}
    >
      <span className="ds-task__icon">
        <Icon name={icon} />
      </span>
      <span className="ds-task__label">{label}</span>
    </button>
  )
}
