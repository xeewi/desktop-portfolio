import './Stat.css'

/** Key figure: a big value over a short label. */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="ds-stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  )
}
