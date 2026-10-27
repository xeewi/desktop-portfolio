import './AnalogClock.css'

/** Analog clock gadget. Pure: give it the time. */
export function AnalogClock({ date }: { date: Date }) {
  const s = date.getSeconds() * 6
  const m = date.getMinutes() * 6 + s / 60
  const h = (date.getHours() % 12) * 30 + m / 12
  const hand = (deg: number, len: number, w: number, c: string) => (
    <line x1="50" y1="50" x2="50" y2={50 - len} stroke={c} strokeWidth={w} strokeLinecap="round" transform={`rotate(${deg} 50 50)`} />
  )
  return (
    <div className="ds-clock">
      <svg viewBox="0 0 100 100">
        <defs>
          <radialGradient id="ds-clock-face" cx="50%" cy="35%" r="70%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#c9d6e3" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#ds-clock-face)" stroke="#2b3a4a" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="50" y1="9" x2="50" y2="14" stroke="#456" strokeWidth="2" transform={`rotate(${i * 30} 50 50)`} />
        ))}
        {hand(h, 22, 4, '#223')}
        {hand(m, 32, 3, '#223')}
        {hand(s, 36, 1.2, '#d33')}
        <circle cx="50" cy="50" r="3" fill="#223" />
        <ellipse cx="50" cy="30" rx="34" ry="18" fill="#fff" opacity=".35" />
      </svg>
    </div>
  )
}
