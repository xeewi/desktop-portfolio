import { BulletList, Button, Card, Feature, Heading, Pane, PillList, Text } from '../design-system'
import type { Content } from '../content'
import type { AppId } from './registry'
import './ProjectsApp.css'

export function ProjectsApp({ c, onOpen }: { c: Content; onOpen: (id: AppId) => void }) {
  const { projects, talks, ui } = c
  return (
    <Pane>
      <Heading level={3}>{ui.projectsTitle}</Heading>
      <Text variant="muted">{ui.projectsSub}</Text>
      <div className="projects-cards">
        {projects.map((p) => (
          <Card key={p.name}>
            <Feature icon={p.icon} title={p.name}>
              <p>{p.desc}</p>
              <PillList items={p.stack} />
              {'opens' in p && p.opens && (
                <div className="projects-open">
                  <Button onClick={() => onOpen(p.opens)}>{ui.openProject(p.name)}</Button>
                </div>
              )}
            </Feature>
          </Card>
        ))}
      </div>
      <div className="projects-talks">
        <Heading level={3}>{ui.talksTitle}</Heading>
        <BulletList items={talks} />
      </div>
    </Pane>
  )
}
