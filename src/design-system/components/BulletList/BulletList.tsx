import './BulletList.css'

/** Bulleted list with accent-coloured markers. */
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="ds-bullets">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}
