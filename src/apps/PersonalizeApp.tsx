import { Button, Heading, Pane, Text, ThemeCard, themeVars, type Os, type Theme } from '../design-system'
import type { Content, Lang } from '../content'
import './PersonalizeApp.css'

type Props = { c: Content; lang: Lang; os: Os; theme: Theme; onPickTheme: (t: Theme) => void; onChangeOs: () => void }

/** The current OS's themes. Picking the OS itself lives in SystemApp. */
export function PersonalizeApp({ c, lang, os, theme, onPickTheme, onChangeOs }: Props) {
  return (
    <Pane>
      <div className="personalize-head">
        <div>
          <Heading level={3}>
            {c.ui.themesTitle} · {os.name}
          </Heading>
          <Text variant="muted">{os.sub[lang]}</Text>
        </div>
        <Button onClick={onChangeOs}>{c.ui.changeOs}</Button>
      </div>
      <div className="personalize-grid">
        {os.themes.map((t) => (
          <ThemeCard
            key={t.id}
            name={t.name}
            description={t.desc[lang]}
            chrome={os.chrome}
            vars={themeVars(t)}
            current={t.id === theme.id}
            currentLabel={c.ui.current}
            onSelect={() => onPickTheme(t)}
          />
        ))}
      </div>
    </Pane>
  )
}
