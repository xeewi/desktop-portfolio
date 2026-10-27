import { useState, type UIEvent } from 'react'
import { BulletList, Explorer, Gallery, Heading, Pane, PillList, Text } from '../design-system'
import type { Content } from '../content'
import { activeSection } from './scrollSpy'
import './ExperienceApp.css'

/** Every experience one after the other; the list on the left is a table of contents that follows the scroll. */
export function ExperienceApp({ c }: { c: Content }) {
  const { experiences, ui } = c
  const [active, setActive] = useState(0)
  const id = (i: number) => 'xp-' + i

  const onScroll = (e: UIEvent<HTMLElement>) => {
    const box = e.currentTarget
    const top = box.getBoundingClientRect().top
    const tops = experiences.map((_, i) => document.getElementById(id(i))!.getBoundingClientRect().top - top + box.scrollTop)
    setActive(activeSection(tops, box.scrollTop, box.clientHeight, box.scrollHeight))
  }

  const goTo = (i: number) => {
    const section = document.getElementById(id(i))!
    // scroll the content only: scrollIntoView would also scroll the window and the desktop around it
    const box = section.closest('article')!
    const top = section.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 12
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches
    box.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
    section.querySelector('h3')?.focus({ preventScroll: true })
    setActive(i)
  }

  return (
    <Explorer.Root>
      <Explorer.Toolbar address={ui.address + experiences[active].company} />
      <Explorer.Body>
        <Explorer.Sidebar>
          {experiences.map((e, i) => (
            <Explorer.SidebarItem key={e.company} href={'#' + id(i)} color={e.color} icon={e.logo} label={e.company} sub={e.period} selected={i === active} onSelect={() => goTo(i)} />
          ))}
        </Explorer.Sidebar>
        <Explorer.Content onScroll={onScroll}>
          <Pane>
            {experiences.map((xp, i) => (
              <section key={xp.company} id={id(i)} className="xp-section" aria-labelledby={id(i) + '-title'}>
                <div className="xp-head">
                  {xp.logo && <img className="xp-logo" src={xp.logo} alt="" />}
                  <div id={id(i) + '-title'}>
                    <Heading level={3} tabIndex={-1}>
                      {xp.company}
                    </Heading>
                    <Text variant="subtitle">{xp.role}</Text>
                  </div>
                </div>
                <Text variant="muted">
                  {xp.period} · {xp.place}
                  {xp.link && (
                    <>
                      {' · '}
                      <a href={xp.link.href} target="_blank" rel="noreferrer">
                        {xp.link.label}
                        <span aria-hidden> ↗</span>
                        <span className="ds-sr-only"> {ui.newTab}</span>
                      </a>
                    </>
                  )}
                </Text>
                <PillList items={xp.stack} />
                {xp.shots && <Gallery shots={xp.shots} newTab={ui.newTab} />}
                <BulletList items={xp.points} />
              </section>
            ))}
          </Pane>
        </Explorer.Content>
      </Explorer.Body>
      <Explorer.StatusBar>{ui.status(experiences.length)}</Explorer.StatusBar>
    </Explorer.Root>
  )
}
