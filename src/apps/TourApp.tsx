import { Button, Feature, Heading, Pane, Text } from '../design-system'
import type { Content } from '../content'
import type { AppId } from './registry'
import './TourApp.css'

type Item = keyof Content['ui']['tour']
/** Tips that come with a button opening the app they're about. */
const OPENS: Partial<Record<Item, AppId>> = { themes: 'themes', system: 'system', hood: 'hood' }

/** Guided tour: what a visitor can do on the site, opened next to About me on start. */
export function TourApp({ c, onOpen }: { c: Content; onOpen: (id: AppId) => void }) {
  return (
    <Pane>
      <Heading level={3}>{c.ui.tourTitle}</Heading>
      <Text variant="muted">{c.ui.tourIntro}</Text>
      <ul className="tour">
        {(Object.keys(c.ui.tour) as Item[]).map((k) => {
          const t = c.ui.tour[k]
          const app = OPENS[k]
          return (
            <li key={k}>
              <Feature icon={t.icon} title={t.title}>
                <Text>{t.text}</Text>
                {app && <Button onClick={() => onOpen(app)}>{c.ui.openApp(c.ui.apps[app])}</Button>}
              </Feature>
            </li>
          )
        })}
      </ul>
    </Pane>
  )
}
