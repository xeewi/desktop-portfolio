import './StickyNote.css'

/** Yellow sticky note: a bold title, a line, a small line. */
export function StickyNote({ title, text, small }: { title: string; text: string; small: string }) {
  return (
    <div className="ds-note">
      <b>{title}</b>
      <br />
      {text}
      <br />
      <small>{small}</small>
    </div>
  )
}
