import './Wallpaper.css'

type Signature = { name: string; title: string; place: string; stats: { value: string; label: string }[] }

/** Wallpaper from the palette (--wall), animated light ribbons where the chrome wants them,
 *  and an optional signature (who's site this is) printed into it, in the theme's ink and font. */
export function Wallpaper({ signature }: { signature?: Signature }) {
  return (
    <div className="ds-wallpaper" aria-hidden>
      <span className="ds-wallpaper__ribbon" />
      <span className="ds-wallpaper__ribbon" />
      <span className="ds-wallpaper__ribbon" />
      {signature && (
        <div className="ds-wallpaper__signature" data-testid="wallpaper-signature">
          <div className="ds-wallpaper__name">{signature.name}</div>
          <div className="ds-wallpaper__title">{signature.title}</div>
          <div className="ds-wallpaper__place">{signature.place}</div>
          <ul className="ds-wallpaper__stats">
            {signature.stats.map((s) => (
              <li key={s.label}>
                <b>{s.value}</b> {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
