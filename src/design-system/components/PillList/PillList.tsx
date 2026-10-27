import { Pill } from '../Pill/Pill'
import './PillList.css'

/** Wrapping row of pills. */
export function PillList({ items }: { items: string[] }) {
  return (
    <div className="ds-pill-list">
      {items.map((s) => (
        <Pill key={s}>{s}</Pill>
      ))}
    </div>
  )
}
