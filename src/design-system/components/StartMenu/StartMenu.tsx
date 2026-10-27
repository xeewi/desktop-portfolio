import { useEffect, useRef, type ReactNode } from 'react'
import { Avatar } from '../Avatar/Avatar'
import type { IconName } from '../Icon/Icon'
import { Tile } from '../Tile/Tile'
import './StartMenu.css'

/** Start menu. Compose it from its parts:
 *  <StartMenu.Root><StartMenu.Banner/><StartMenu.Apps>…</StartMenu.Apps><StartMenu.Links>…</StartMenu.Links></StartMenu.Root> */
function Root({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  // keyboard: focus goes into the menu, Escape closes it, and focus goes back where it was
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null
    ref.current!.querySelector<HTMLElement>('button, a')?.focus()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('keydown', esc)
      if (document.activeElement === document.body) back?.focus()
    }
  }, [onClose])
  // clicks inside must not reach the desktop, which closes the menu
  return (
    <nav ref={ref} id="ds-startmenu" className="ds-startmenu" aria-label={label} onPointerDown={(e) => e.stopPropagation()}>
      {children}
    </nav>
  )
}

/** Name banner (vertical on 95, on top on XP, hidden elsewhere). */
function Banner({ children }: { children: string }) {
  return <div className="ds-startmenu__banner">{children}</div>
}

function Apps({ children }: { children: ReactNode }) {
  return <div className="ds-startmenu__apps">{children}</div>
}

function App({ icon, label, onOpen }: { icon: IconName; label: string; onOpen: () => void }) {
  return (
    <button className="ds-startmenu__app" onClick={onOpen}>
      <Tile icon={icon} />
      {label}
    </button>
  )
}

function Links({ children }: { children: ReactNode }) {
  return <div className="ds-startmenu__links">{children}</div>
}

function Profile({ initials, name }: { initials: string; name: string }) {
  return (
    <>
      <span className="ds-startmenu__avatar">
        <Avatar initials={initials} size="sm" />
      </span>
      <b className="ds-startmenu__name">{name}</b>
    </>
  )
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  const external = !href.startsWith('mailto:')
  return (
    <a className="ds-startmenu__link" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {children}
    </a>
  )
}

export const StartMenu = { Root, Banner, Apps, App, Links, Profile, Link }
