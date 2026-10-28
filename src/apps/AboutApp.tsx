import { Avatar, Button, Heading, Icon, Pane, Stat, Text } from '../design-system'
import type { Content } from '../content'
import './AboutApp.css'

export function AboutApp({ c, onShowCareer, onShowProjects, onContact }: { c: Content; onShowCareer: () => void; onShowProjects: () => void; onContact: () => void }) {
  const { profile, ui } = c
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
      {profile.intro.map((p) => (
        <Text key={p}>{p}</Text>
      ))}
      <div className="about-stats">
        {profile.stats.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
      <div className="about-actions">
        <Button variant="primary" onClick={onShowCareer}>
          {ui.seeCareer}
        </Button>
        <Button onClick={onShowProjects}>{ui.seeProjects}</Button>
        <Button onClick={onContact}>{ui.contactMe}</Button>
      </div>
    </Pane>
  )
}
