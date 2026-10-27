import { ThemePreview } from '../ThemePreview/ThemePreview'
import './ThemeCard.css'

type Props = {
  name: string
  description: string
  chrome: string
  vars: Record<string, string>
  current: boolean
  currentLabel: string
  onSelect: () => void
}

/** Selectable theme: miniature preview, name, description. */
export function ThemeCard({ name, description, chrome, vars, current, currentLabel, onSelect }: Props) {
  return (
    <button className="ds-themecard" aria-pressed={current} onClick={onSelect}>
      <ThemePreview chrome={chrome} vars={vars} />
      <b>{name}</b>
      <small>
        {current && <span className="ds-themecard__current">
            <span aria-hidden>✓ </span>
            {currentLabel} ·{' '}
          </span>}
        {description}
      </small>
    </button>
  )
}
