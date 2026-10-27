import { useEffect, useRef, type ReactNode, type UIEvent } from 'react'
import './Explorer.css'

/** File-explorer layout. Compose it:
 *  <Explorer.Root><Explorer.Toolbar/><Explorer.Body><Explorer.Sidebar>…</Explorer.Sidebar><Explorer.Content/></Explorer.Body><Explorer.StatusBar/></Explorer.Root> */
function Root({ children }: { children: ReactNode }) {
  return <div className="ds-explorer">{children}</div>
}

function Toolbar({ address }: { address: string }) {
  return (
    <div className="ds-explorer__toolbar">
      <span aria-hidden>◀ ▶</span>
      <div className="ds-explorer__address">{address}</div>
    </div>
  )
}

function Body({ children }: { children: ReactNode }) {
  return <div className="ds-explorer__body">{children}</div>
}

function Sidebar({ children }: { children: ReactNode }) {
  return <ul className="ds-explorer__sidebar">{children}</ul>
}

/** `icon`: an image (a logo) shown instead of the colour dot.
 *  `href`: the item is a link to a part of the content (a table of contents), not a button that swaps it.
 *  It is then marked as the current location, and kept in view when the list scrolls (phones). */
type ItemProps = { color: string; icon?: string; label: string; sub: string; selected: boolean; onSelect: () => void; href?: string }

function SidebarItem({ color, icon, label, sub, selected, onSelect, href }: ItemProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    // keep the current item in view in the list, without scrolling anything around it (scrollIntoView would)
    const a = ref.current
    const list = a?.closest('ul')
    if (!selected || !a || !list) return
    const l = list.getBoundingClientRect()
    const r = a.getBoundingClientRect()
    list.scrollBy({ left: r.left < l.left ? r.left - l.left - 8 : Math.max(0, r.right - l.right + 8), top: r.top < l.top ? r.top - l.top - 8 : Math.max(0, r.bottom - l.bottom + 8) })
  }, [selected])
  const inner = (
    <>
      {icon ? <img className="ds-explorer__icon" src={icon} alt="" /> : <span className="ds-explorer__dot" style={{ background: color }} />}
      <span>
        {label}
        <small>{sub}</small>
      </span>
    </>
  )
  return (
    <li>
      {href ? (
        <a
          ref={ref}
          className="ds-explorer__item"
          href={href}
          aria-current={selected ? 'location' : undefined}
          onClick={(e) => {
            e.preventDefault()
            onSelect()
          }}
        >
          {inner}
        </a>
      ) : (
        <button className="ds-explorer__item" aria-current={selected || undefined} onClick={onSelect}>
          {inner}
        </button>
      )}
    </li>
  )
}

function Content({ children, onScroll }: { children: ReactNode; onScroll?: (e: UIEvent<HTMLElement>) => void }) {
  return (
    // focusable so it can be scrolled with the keyboard (WCAG 2.1.1)
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <article className="ds-explorer__content" tabIndex={0} onScroll={onScroll}>
      {children}
    </article>
  )
}

function StatusBar({ children }: { children: string }) {
  return <div className="ds-explorer__status">{children}</div>
}

export const Explorer = { Root, Toolbar, Body, Sidebar, SidebarItem, Content, StatusBar }
