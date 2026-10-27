import { Button, Heading, Icon, Pane } from '../design-system'
import { links, type Content } from '../content'
import './ContactApp.css'

export function ContactApp({ c }: { c: Content }) {
  const { ui } = c
  return (
    <Pane>
      <Heading level={3}>{ui.contactTitle}</Heading>
      <p className="contact-text">{ui.contactText}</p>
      <Button variant="primary" block href={`mailto:${links.email}`}>
        <Icon name="mail" /> {links.email}
      </Button>
      <Button block href={links.linkedin}>
        <span aria-hidden>in&nbsp;</span> LinkedIn · gautierg
      </Button>
      <Button block href={links.github}>
        <Icon name="code" /> GitHub · xeewi
      </Button>
      <Button block href="/cv.pdf">
        <Icon name="pdf" /> {ui.downloadCv}
      </Button>
    </Pane>
  )
}
