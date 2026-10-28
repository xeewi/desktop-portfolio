import { Avatar, Button, Feature, Heading, Icon, Pane, Stat, Text } from '../design-system'
import type { Content, Lang } from '../content'
import type { AppId } from './registry'
import './AboutApp.css'

type Try = keyof Content['ui']['tries']
/** Tips that come with a button opening the app they're about. */
const OPENS: Partial<Record<Try, AppId>> = { themes: 'themes', system: 'system', hood: 'hood' }

type Props = { c: Content; lang: Lang; onOpen: (id: AppId) => void; onToggleLang: () => void; onSurprise: () => void }

/** The window open on arrival: why this site exists, what to try on it, and who I am. */
export function AboutApp({ c, lang, onOpen, onToggleLang, onSurprise }: Props) {
  const { profile, ui } = c
  const action = (k: Try) => {
    const app = OPENS[k]
    if (app) return <Button onClick={() => onOpen(app)}>{ui.openApp(ui.apps[app])}</Button>
    if (k === 'surprise') return <Button variant="primary" onClick={onSurprise}>{ui.surpriseMe}</Button>
    if (k === 'lang') return <Button onClick={onToggleLang}><span lang={lang === 'en' ? 'fr' : 'en'}>{ui.switchLang}</span></Button>
  }
  return (
    <Pane>
      <div className="about-hero">
        <Avatar initials="GG" />
        <div>
          <Heading level={3}>{profile.name}</Heading>
          <Text variant="subtitle">{profile.title}</Text>
          <Text variant="muted"><Icon name="location" /> {profile.location}</Text>
        </div>
      </div>
      {ui.site.map((p) => (
        <Text key={p}>{p}</Text>
      ))}

      <section className="about-section">
      <Heading level={3}>{ui.tryTitle}</Heading>
      <ul className="about-tries">
        {(Object.keys(ui.tries) as Try[]).map((k) => (
          <li key={k}>
            <Feature icon={ui.tries[k].icon} title={ui.tries[k].title}>
              <Text>{ui.tries[k].text}</Text>
              {action(k)}
            </Feature>
          </li>
        ))}
      </ul>
      </section>

      <section className="about-section">
      <Heading level={3}>{ui.meTitle}</Heading>
      {profile.intro.map((p) => (
        <Text key={p}>{p}</Text>
      ))}
      <div className="about-stats">
        {profile.stats.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
      <div className="about-actions">
        <Button variant="primary" onClick={() => onOpen('xp')}>{ui.seeCareer}</Button>
        <Button onClick={() => onOpen('projects')}>{ui.seeProjects}</Button>
        <Button onClick={() => onOpen('contact')}>{ui.contactMe}</Button>
      </div>
      </section>
    </Pane>
  )
}
