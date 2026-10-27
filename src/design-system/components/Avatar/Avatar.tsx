import './Avatar.css'

/** Initials in a frame (square, round or bevelled depending on the chrome). */
export function Avatar({ initials, size = 'lg' }: { initials: string; size?: 'sm' | 'lg' }) {
  return <div className={'ds-avatar ds-avatar--' + size}>{initials}</div>
}
