import { Feature, Heading, Pane, PillList, Text } from '../design-system'
import type { Content } from '../content'
import './SkillsApp.css'

export function SkillsApp({ c }: { c: Content }) {
  const { skills, ui } = c
  return (
    <Pane>
      <Heading level={3}>{ui.skillsTitle}</Heading>
      <Text variant="muted">{ui.skillsSub}</Text>
      <div className="skills-grid">
        {skills.map((g) => (
          <Feature key={g.group} icon={g.icon} title={g.group}>
            <PillList items={g.items} />
          </Feature>
        ))}
      </div>
    </Pane>
  )
}
