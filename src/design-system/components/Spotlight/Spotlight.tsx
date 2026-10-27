import { useLayoutEffect, useState } from 'react'
import { spotlightLayout, type Rect } from './layout'
import './Spotlight.css'

type Props = { selector: string; label: string; hint: string; onClose: () => void }

const same = (a: Rect | null, b: Rect | null) => a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h)

/** Dims the screen around the element `selector` matches, with a caption. Follows the element while it
 *  moves (window opening, resize). Closes on Escape (focus goes back where it was) or on any click. */
export function Spotlight({ selector, label, hint, onClose }: Props) {
  const [target, setTarget] = useState<Rect | null>(null)

  useLayoutEffect(() => {
    const back = document.activeElement as HTMLElement | null
    document.querySelector(selector)?.scrollIntoView({ block: 'nearest' })
    // ponytail: measures every frame while open, a ResizeObserver can't see moves
    let frame = 0
    const track = () => {
      const r = document.querySelector(selector)?.getBoundingClientRect()
      const next = r && r.width && r.height ? { x: r.x, y: r.y, w: r.width, h: r.height } : null
      setTarget((cur) => (same(cur, next) ? cur : next))
      frame = requestAnimationFrame(track)
    }
    track()
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      onClose()
      back?.focus()
    }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', onClose, true)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', key)
      document.removeEventListener('pointerdown', onClose, true)
    }
  }, [selector, onClose])

  if (!target) return null
  const { ring, caption } = spotlightLayout(target, { w: innerWidth, h: innerHeight })
  return (
    <div className="ds-spotlight">
      <div className="ds-spotlight__ring" style={{ left: ring.x, top: ring.y, width: ring.w, height: ring.h }} aria-hidden />
      <output className="ds-spotlight__caption" style={caption}>
        <b>{label}</b>
        <small>{hint}</small>
      </output>
    </div>
  )
}
