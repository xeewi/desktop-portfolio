import './Pill.css'

/** Small tag (a technology, a skill). */
export function Pill({ children }: { children: string }) {
  return <span className="ds-pill">{children}</span>
}
