import { Button } from '../design-system'
import type { Content } from '../content'
import './WebApp.css'

/** Another site of mine, shown in the window, with a way out to a full tab. */
export function WebApp({ c, url, title }: { c: Content; url: string; title: string }) {
  return (
    <div className="webapp">
      <div className="webapp-bar">
        <Button href={url}>
          {c.ui.openInTab}
          <span className="ds-sr-only"> · {title}</span>
        </Button>
      </div>
      <iframe className="webapp-frame" src={url} title={title} loading="lazy" />
    </div>
  )
}
