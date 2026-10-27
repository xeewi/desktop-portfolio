import { useEffect, useState } from 'react'
import { Explorer, Heading, Icon, Pane, Text } from '../../design-system'
import type { Content } from '../../content'
import { baseName, crumbs, isDir, list } from './files'
import { load, PATHS } from './sources'
import './Architecture.css'

/** Under the hood, Architecture: browse the repo, folder by folder, and read any file.
 *  The key folders and files carry a note (what's in it, why), from content (`architecture`). */
export function Architecture({ c, path, onOpen }: { c: Content; path: string; onOpen: (path: string) => void }) {
  const note = c.architecture.find((n) => n.path === path)
  const roles = new Map<string, string>([...c.architecture.map((n) => [n.path, n.sub] as const), ...c.architecture.flatMap((n) => n.files.map((f) => [f.path, f.role] as const))])
  const name = (p: string) => (p === '' ? c.ui.archRoot : baseName(p) + (isDir(p) ? '/' : ''))

  const entries = isDir(path) ? list(PATHS, path) : []
  const [file, setFile] = useState<{ path: string; text: string }>()
  useEffect(() => {
    if (isDir(path)) return
    let live = true
    load(path).then((text) => live && setFile({ path, text }))
    return () => {
      live = false
    }
  }, [path])
  const lines = !isDir(path) && file?.path === path ? file.text.replace(/\n$/, '').split('\n') : null

  return (
    <Explorer.Root>
      <Explorer.Toolbar address={crumbs(path).map((p) => (p === '' ? 'personalBranding' : baseName(p))).join(' ▸ ')} />
      <Explorer.Body>
        <Explorer.Sidebar>
          <Explorer.SidebarItem color="#6b6b6b" label={c.ui.archRoot} sub={c.ui.archRootSub} selected={path === ''} onSelect={() => onOpen('')} />
          {c.architecture.map((d) => (
            <Explorer.SidebarItem key={d.path} color={d.color} label={d.path} sub={d.sub} selected={path === d.path} onSelect={() => onOpen(d.path)} />
          ))}
        </Explorer.Sidebar>
        <Explorer.Content>
          <Pane>
            <nav className="arch-crumbs" aria-label={c.ui.archPath}>
              <ol>
                {crumbs(path).map((p, i, all) => (
                  <li key={p}>
                    {i === all.length - 1 ? (
                      <span aria-current="page">{name(p)}</span>
                    ) : (
                      <button onClick={() => onOpen(p)}>{name(p)}</button>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <Heading level={4} tabIndex={-1}>
              {name(path)}
            </Heading>
            {note && (
              <div className="arch-note">
                <Text variant="subtitle">{note.sub}</Text>
                <Text>
                  <b>{c.ui.archWhat}.</b> {note.what}
                </Text>
                <Text>
                  <b>{c.ui.archWhy}.</b> {note.why}
                </Text>
              </div>
            )}
            {isDir(path) ? (
              <ul className="arch-list">
                {entries.map((e) => (
                  <li key={e.path}>
                    <button className="arch-entry" onClick={() => onOpen(e.path)}>
                      <Icon name={e.dir ? 'folder' : 'file'} />
                      <code lang="en">{name(e.path)}</code>
                    </button>
                    {roles.has(e.path) && <span className="arch-role">{roles.get(e.path)}</span>}
                  </li>
                ))}
              </ul>
            ) : lines ? (
              // focusable so long lines can be scrolled with the keyboard (WCAG 2.1.1)
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              <pre className="arch-code" tabIndex={0} lang="en" aria-label={name(path)}>
                <code>
                  {lines.map((l, i) => (
                    <span key={i}>{l + '\n'}</span>
                  ))}
                </code>
              </pre>
            ) : (
              <Text variant="muted">{c.ui.archLoading}</Text>
            )}
          </Pane>
        </Explorer.Content>
      </Explorer.Body>
      <Explorer.StatusBar>{isDir(path) ? c.ui.archItems(entries.length) : lines ? c.ui.archLines(lines.length) : c.ui.archLoading}</Explorer.StatusBar>
    </Explorer.Root>
  )
}
