import './AppName.css'

/** Name of the focused app (macOS menu bar only). */
export function AppName({ children }: { children: string }) {
  return <b className="ds-appname">{children}</b>
}
