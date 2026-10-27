import './TrayClock.css'

/** Time in the tray, formatted for the locale (12 h in en-US, 24 h in fr-FR). Pure: give it the time. */
export function TrayClock({ date, locale }: { date: Date; locale: string }) {
  return <div className="ds-trayclock">{date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}</div>
}
