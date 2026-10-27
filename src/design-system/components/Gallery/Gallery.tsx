import './Gallery.css'

export type Shot = { src: string; alt: string }

/** Row of screenshots that scrolls sideways. Each one links to the full-size image, in a new tab.
 *  `newTab` is read after each image's description, for screen readers. */
export function Gallery({ shots, newTab }: { shots: Shot[]; newTab: string }) {
  return (
    <ul className="ds-gallery">
      {shots.map((s) => (
        <li key={s.src}>
          <a href={s.src} target="_blank" rel="noreferrer" aria-label={`${s.alt} ${newTab}`}>
            <img src={s.src} alt="" loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  )
}
