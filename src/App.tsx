import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  AnalogClock,
  AppName,
  BootScreen,
  Desktop,
  DesktopIcon,
  DesktopIcons,
  Gadgets,
  StartButton,
  StartMenu,
  Spotlight,
  StickyNote,
  Task,
  Taskbar,
  TaskList,
  TOUCH,
  TrayButton,
  TrayClock,
  Wallpaper,
  Window,
  Workspace,
  OSES,
  type Os,
} from './design-system'
import { content, links } from './content'
import { APPS, type AppId } from './apps/registry'
import { AboutApp } from './apps/AboutApp'
import { surprise } from './apps/surprise'
import { ExperienceApp } from './apps/ExperienceApp'
import { SkillsApp } from './apps/SkillsApp'
import { ProjectsApp } from './apps/ProjectsApp'
import { ContactApp } from './apps/ContactApp'
import { WebApp } from './apps/WebApp'
import { PersonalizeApp } from './apps/PersonalizeApp'
import { SystemApp } from './apps/SystemApp'
import { HoodApp } from './apps/hood/HoodApp'
import { HOOD_TARGETS, type HoodId } from './apps/hood/hoodTargets'
import { useLang } from './hooks/useLang'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useNow } from './hooks/useNow'
import { useThemeSelection } from './hooks/useThemeSelection'
import { useWindowManager } from './hooks/useWindowManager'

const motionOk = () => !matchMedia('(prefers-reduced-motion: reduce)').matches

/** Composition root: wires state to the design-system components. No styling here. */
export default function App() {
  const touch = useMediaQuery(TOUCH)
  const now = useNow()
  const { lang, toggleLang } = useLang()
  const c = content[lang]
  const { os, theme, pickOs, pickTheme } = useThemeSelection()
  // on phones we start on the desktop: the icon grid is the home screen
  // macOS keeps its desktop icons on the right
  // Ubuntu's dock pushes the icons 64px right (gnome.css --icons-left)
  const wm = useWindowManager(APPS, matchMedia(TOUCH).matches ? [] : ['about'], os.chrome === 'mac', os.chrome === 'gnome' ? 64 : 0)
  const [startOpen, setStartOpen] = useState(false)
  const [booting, setBooting] = useState(motionOk)
  const closeStart = useCallback(() => setStartOpen(false), [])
  const [spot, setSpot] = useState<HoodId | null>(null)
  const closeSpot = useCallback(() => setSpot(null), [])

  useEffect(() => {
    if (!booting) return
    const t = setTimeout(() => setBooting(false), 2200)
    return () => clearTimeout(t)
  }, [booting])

  const open = (id: AppId) => {
    wm.focus(id)
    setStartOpen(false)
  }
  /** "Show me" in Under the hood: put the target on screen, then highlight it */
  const show = (id: HoodId) => {
    const open = HOOD_TARGETS[id]?.open
    if (open === 'start') setStartOpen(true)
    else if (open) wm.focus(open)
    setSpot(id)
  }
  // switching OS replays the boot screen
  const switchOs = (next: Os) => pickOs(next) && setBooting(motionOk())
  const surpriseMe = () => {
    const s = surprise(OSES, os)
    switchOs(s.os)
    pickTheme(s.theme)
  }

  const body: Record<AppId, ReactNode> = {
    about: <AboutApp c={c} lang={lang} onOpen={open} onToggleLang={toggleLang} onSurprise={surpriseMe} />,
    xp: <ExperienceApp c={c} />,
    skills: <SkillsApp c={c} />,
    projects: <ProjectsApp c={c} onOpen={open} />,
    contact: <ContactApp c={c} />,
    costcalc: <WebApp c={c} url={links.costcalc} title={c.ui.apps.costcalc} />,
    mixcoach: <WebApp c={c} url={links.mixcoach} title={c.ui.apps.mixcoach} />,
    directchange: <WebApp c={c} url={links.directchange} title={c.ui.apps.directchange} />,
    themes: <PersonalizeApp c={c} lang={lang} os={os} theme={theme} onPickTheme={pickTheme} onChangeOs={() => open('system')} />,
    system: <SystemApp c={c} os={os} onPickOs={switchOs} />,
    hood: <HoodApp c={c} onShow={show} />,
  }
  const labels = { minimize: c.ui.minimize, maximize: c.ui.maximize, close: c.ui.close }
  const startLabel = os.chrome === 'gnome' ? c.ui.activities : c.ui.start

  return (
    <Desktop onPointerDown={() => setStartOpen(false)}>
      <Wallpaper signature={{ name: c.profile.name, title: c.profile.title, place: c.profile.location, stats: c.profile.stats }} />

      <DesktopIcons label={c.ui.desktop}>
        {APPS.map((a) => (
          <DesktopIcon key={a.id} icon={a.icon} label={c.ui.apps[a.id]} onOpen={() => open(a.id)} />
        ))}
        <DesktopIcon icon="pdf" label="CV.pdf" href="/cv.pdf" />
      </DesktopIcons>

      <Gadgets>
        <AnalogClock date={now} />
        <StickyNote title={c.profile.name} text={c.profile.title} small={c.profile.location} />
      </Gadgets>

      <Workspace title={`${c.profile.name} · ${c.profile.title}`}>
      {APPS.map((a) => {
        const w = wm.wins[a.id]
        if (!w.open) return null
        return (
          <Window
            key={a.id}
            id={`win-${a.id}`}
            title={c.ui.apps[a.id]}
            icon={a.icon}
            x={w.x}
            y={w.y}
            z={w.z}
            width={w.w}
            height={w.h}
            active={wm.focused === a.id}
            minimized={w.min}
            maximized={w.max}
            closing={w.closing}
            onClosed={() => wm.closed(a.id)}
            minimizeTo={() => document.getElementById(`task-${a.id}`)?.getBoundingClientRect()}
            draggable={!touch}
            labels={labels}
            onFocus={() => wm.focus(a.id)}
            onMove={(x, y) => wm.move(a.id, x, y)}
            onResize={(x, y, width, height) => wm.resize(a.id, x, y, width, height)}
            onMinimize={() => wm.minimize(a.id)}
            onToggleMaximize={() => wm.toggleMaximize(a.id)}
            onClose={() => wm.close(a.id)}
          >
            {body[a.id]}
          </Window>
        )
      })}
      </Workspace>

      {startOpen && (
        <StartMenu.Root label={startLabel} onClose={closeStart}>
          <StartMenu.Banner>{c.profile.name}</StartMenu.Banner>
          <StartMenu.Apps>
            {APPS.map((a) => (
              <StartMenu.App key={a.id} icon={a.icon} label={c.ui.apps[a.id]} onOpen={() => open(a.id)} />
            ))}
          </StartMenu.Apps>
          <StartMenu.Links>
            <StartMenu.Profile initials="GG" name={c.profile.name} />
            <StartMenu.Link href={links.linkedin}>LinkedIn</StartMenu.Link>
            <StartMenu.Link href={links.github}>GitHub</StartMenu.Link>
            <StartMenu.Link href={`mailto:${links.email}`}>{c.ui.email}</StartMenu.Link>
            <StartMenu.Link href="/cv.pdf">{c.ui.cvShort}</StartMenu.Link>
          </StartMenu.Links>
        </StartMenu.Root>
      )}

      <Taskbar>
        <StartButton label={startLabel} open={startOpen} onToggle={() => setStartOpen((s) => !s)} />
        <AppName>{wm.focused ? c.ui.apps[wm.focused] : c.ui.desktop}</AppName>
        <TaskList>
          {/* the sites only show in the dock while open: 11 buttons don't fit a phone's dock at 24px */}
          {APPS.filter((a) => !('web' in a) || wm.wins[a.id].open).map((a) => (
            <Task
              key={a.id}
              id={`task-${a.id}`}
              icon={a.icon}
              label={c.ui.apps[a.id]}
              open={wm.wins[a.id].open && !wm.wins[a.id].closing}
              active={wm.focused === a.id}
              onClick={() => wm.toggle(a.id)}
            />
          ))}
        </TaskList>
        <TrayButton label={c.ui.switchLang} labelLang={lang === 'en' ? 'fr' : 'en'} onClick={toggleLang}>
          {lang.toUpperCase()}
        </TrayButton>
        <TrayClock date={now} locale={c.ui.locale} />
      </Taskbar>

      {spot && HOOD_TARGETS[spot] && (
        <Spotlight selector={HOOD_TARGETS[spot].selector} label={c.hood[spot].title} hint={c.ui.spotlightHint} onClose={closeSpot} />
      )}

      {booting && <BootScreen title={c.ui.welcome} subtitle={os.name} onDismiss={() => setBooting(false)} />}
    </Desktop>
  )
}
