import { useEffect, useRef, useState } from 'react'
import { Button, Feature, Heading, NavCard, Pane, Text } from '../../design-system'
import type { Content } from '../../content'
import { Architecture } from './Architecture'
import { Tests } from './Tests'
import { HOOD_TARGETS, type HoodId } from './hoodTargets'
import './HoodApp.css'

type Screen = keyof Content['ui']['hoodHome']
type Route = { screen: 'home' } | { screen: 'choices' | 'tests' } | { screen: 'architecture'; path: string }

/** Under the hood: a small app for everything technical. A home screen leads to the technical choices,
 *  the code (a file browser) and the test results. Back always leads to the home screen; inside the file
 *  browser, its path and sidebar move between folders. */
export function HoodApp({ c, onShow }: { c: Content; onShow: (id: HoodId) => void }) {
  const [route, setRoute] = useState<Route>({ screen: 'home' })
  const root = useRef<HTMLDivElement>(null)
  const moved = useRef(false)
  const go = (r: Route) => {
    moved.current = true
    setRoute(r)
  }
  const back = () => go({ screen: 'home' })
  const open = (screen: Screen) => go(screen === 'architecture' ? { screen, path: '' } : { screen })

  // after each move, focus goes to the new screen's title (in the file browser, the file's name):
  // keyboard and screen reader users start at the top of what changed
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    const r = root.current
    const title = r?.querySelector<HTMLElement>('.ds-explorer h4') ?? r?.querySelector<HTMLElement>('h3')
    title?.focus()
  }, [route])

  const title = route.screen === 'home' ? c.ui.apps.hood : c.ui.hoodHome[route.screen].title
  return (
    <div className="hood" ref={root}>
      <header className="hood__bar">
        {route.screen !== 'home' && (
          <Button onClick={back}>
            <span aria-hidden>←</span> {c.ui.back}
          </Button>
        )}
        <Heading level={3} tabIndex={-1}>
          {title}
        </Heading>
      </header>
      {route.screen === 'home' && (
        <Pane>
          <Text variant="muted">{c.ui.hoodIntro}</Text>
          <ul className="hood__home">
            {(Object.keys(c.ui.hoodHome) as Screen[]).map((s) => (
              <li key={s}>
                <NavCard icon={c.ui.hoodHome[s].icon} title={c.ui.hoodHome[s].title} description={c.ui.hoodHome[s].text} onClick={() => open(s)} />
              </li>
            ))}
          </ul>
        </Pane>
      )}
      {route.screen === 'choices' && <Choices c={c} onShow={onShow} onOpen={open} />}
      {route.screen === 'architecture' && <Architecture c={c} path={route.path} onOpen={(path) => go({ screen: 'architecture', path })} />}
      {route.screen === 'tests' && <Tests c={c} />}
    </div>
  )
}

/** Notes whose "Show me" opens a screen of Under the hood, instead of highlighting something on the desktop. */
const INSIDE: Partial<Record<HoodId, Screen>> = { tests: 'tests' }

function Choices({ c, onShow, onOpen }: { c: Content; onShow: (id: HoodId) => void; onOpen: (s: Screen) => void }) {
  return (
    <Pane>
      <Text variant="muted">{c.ui.hoodSub}</Text>
      <div className="hood-list">
        {(Object.keys(c.hood) as HoodId[]).map((id) => {
          const n = c.hood[id]
          const inside = INSIDE[id]
          return (
            <Feature key={id} icon={n.icon} title={n.title}>
              <Text>
                <b>{c.ui.how}.</b> {n.how}
              </Text>
              <Text>
                <b>{c.ui.why}.</b> {n.why}
              </Text>
              {(HOOD_TARGETS[id] || inside) && (
                <Button onClick={() => (inside ? onOpen(inside) : onShow(id))}>
                  {c.ui.showMe}
                  {/* several "Show me" buttons: the hidden part tells them apart ("Show me – <title>") */}
                  <span className="ds-sr-only">– {n.title}</span>
                </Button>
              )}
            </Feature>
          )
        })}
      </div>
    </Pane>
  )
}
