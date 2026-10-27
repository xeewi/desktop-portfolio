import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import { dragTo, EDGES, resizeRect, type Edge, type Rect } from './geometry'
import './Window.css'

export type WindowLabels = { minimize: string; maximize: string; close: string }

type Props = {
  id?: string
  title: string
  icon: IconName
  x: number
  y: number
  z: number
  width: number
  /** unset: fits the content */
  height?: number
  active: boolean
  minimized: boolean
  maximized: boolean
  /** false on touch layouts: the window is full-screen there. Also turns resizing off. */
  draggable: boolean
  labels: WindowLabels
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (x: number, y: number, width: number, height: number) => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onClose: () => void
  children: ReactNode
}

/** Desktop window: title bar (drag, double-click to maximise), controls, edges to resize, scrollable body. */
export function Window(p: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const frame = useRef<HTMLElement>(null)
  const sizing = useRef<{ edge: Edge; px: number; py: number; start: Rect } | null>(null)
  const body = useRef<HTMLDivElement>(null)
  const rendered = () => frame.current!.getBoundingClientRect()

  // Keyboard and screen-reader users land in the window they open or switch to.
  // Not on page load (no user activation yet), and not when focus is already inside.
  const shown = p.active && !p.minimized
  useEffect(() => {
    if (shown && navigator.userActivation?.hasBeenActive && !frame.current!.contains(document.activeElement))
      body.current!.focus({ preventScroll: true })
  }, [shown])

  const startResize = (e: PointerEvent, edge: Edge) => {
    const r = rendered()
    sizing.current = { edge, px: e.clientX, py: e.clientY, start: { x: p.x, y: p.y, w: r.width, h: r.height } }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const resize = (e: PointerEvent) => {
    const s = sizing.current
    if (!s) return
    const r = resizeRect(s.start, s.edge, e.clientX - s.px, e.clientY - s.py)
    p.onResize(r.x, r.y, r.w, r.h)
  }

  const down = (e: PointerEvent) => {
    if (p.maximized || !p.draggable || (e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - p.x, dy: e.clientY - p.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: PointerEvent) => {
    if (!drag.current) return
    // the rendered width, not the prop: max-width can make the window narrower
    const pos = dragTo({ x: e.clientX, y: e.clientY }, drag.current, rendered().width, { w: innerWidth, h: innerHeight })
    p.onMove(pos.x, pos.y)
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- pointer/focus only raise the window
    <section
      ref={frame}
      id={p.id}
      className="ds-window"
      data-active={p.active || undefined}
      data-minimized={p.minimized || undefined}
      data-maximized={p.maximized || undefined}
      style={{ left: p.x, top: p.y, zIndex: 10 + p.z, width: p.width, height: p.height }}
      onPointerDown={p.onFocus}
      // tabbing into a window behind another brings it to the front, so focus is never hidden
      onFocus={() => !p.active && p.onFocus()}
      aria-label={p.title}
    >
      <header
        className="ds-window__titlebar"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => (drag.current = null)}
        onDoubleClick={p.onToggleMaximize}
      >
        <span className="ds-window__icon">
          <Icon name={p.icon} />
        </span>
        <h2 className="ds-window__title">{p.title}</h2>
        <div className="ds-window__controls">
          <button className="ds-window__ctrl ds-window__ctrl--min" onClick={p.onMinimize} aria-label={p.labels.minimize}>
            <svg viewBox="0 0 10 10"><rect x="1" y="6" width="8" height="2" /></svg>
          </button>
          <button className="ds-window__ctrl ds-window__ctrl--max" onClick={p.onToggleMaximize} aria-label={p.labels.maximize} aria-pressed={p.maximized}>
            <svg viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7" fill="none" strokeWidth="1.6" /></svg>
          </button>
          <button className="ds-window__ctrl ds-window__ctrl--close" onClick={p.onClose} aria-label={p.labels.close}>
            <svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" strokeWidth="1.8" /></svg>
          </button>
        </div>
      </header>
      {/* focusable so it can be scrolled with the keyboard (WCAG 2.1.1) */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div ref={body} className="ds-window__body" tabIndex={0}>
        {p.children}
      </div>
      {p.draggable &&
        !p.maximized &&
        EDGES.map((edge) => (
          <span
            key={edge}
            className="ds-window__edge"
            data-edge={edge}
            onPointerDown={(e) => startResize(e, edge)}
            onPointerMove={resize}
            onPointerUp={() => (sizing.current = null)}
            aria-hidden
          />
        ))}
    </section>
  )
}
