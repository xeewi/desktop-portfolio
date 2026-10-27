import { Heading, OSES, Pane, Text, ThemeCard, savedTheme, themeVars, type Os } from '../design-system'
import type { Content } from '../content'
import './PersonalizeApp.css'

type Props = { c: Content; os: Os; onPickOs: (os: Os) => void }

/** Pick the OS. Each card previews the theme last used on that OS. */
export function SystemApp({ c, os, onPickOs }: Props) {
  return (
    <Pane>
      <Heading level={3}>{c.ui.osTitle}</Heading>
      <Text variant="muted">{c.ui.osSub}</Text>
      <div className="personalize-grid">
        {OSES.map((o) => (
          <ThemeCard
            key={o.id}
            name={o.name}
            description={String(o.year)}
            chrome={o.chrome}
            vars={themeVars(savedTheme(o))}
            current={o.id === os.id}
            currentLabel={c.ui.current}
            onSelect={() => onPickOs(o)}
          />
        ))}
      </div>
    </Pane>
  )
}
