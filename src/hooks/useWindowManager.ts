import { useState } from 'react'

/** `h` is unset until the user resizes: the window then fits its content.
 *  `closing`: still on screen while its closing animation plays. */
export type WindowState = { open: boolean; closing?: boolean; min: boolean; max: boolean; x: number; y: number; w: number; h?: number; z: number }
type AppMeta<Id extends string> = { id: Id; width: number }

/** The window on top among those on screen (open, not closing, not minimised): the one that has focus. */
export function topWindow<Id extends string>(wins: Record<Id, WindowState>): Id | undefined {
  let top: Id | undefined
  for (const id of Object.keys(wins) as Id[]) {
    const w = wins[id]
    if (w.open && !w.closing && !w.min && (top === undefined || w.z > wins[top].z)) top = id
  }
  return top
}

/** Room left for the desktop icons' column at start. */
const ICONS = 220

/** Windows at start. Those in `open` sit side by side, in desktop order, clear of the desktop icons (on the right
 *  on macOS, on the left elsewhere), the first one on top. The others are staggered, ready for when they open. */
export function initialWindows<Id extends string>(apps: readonly AppMeta<Id>[], open: readonly Id[], viewportWidth: number, iconsOnRight = false) {
  const right = viewportWidth - (iconsOnRight ? ICONS : 8)
  let next = iconsOnRight ? 8 : ICONS
  return Object.fromEntries(
    apps.map((a, i) => {
      const k = open.indexOf(a.id)
      if (k < 0) return [a.id, { open: false, min: false, max: false, x: 220 + i * 36, y: 40 + i * 30, w: a.width, z: 1 }]
      const x = Math.max(8, Math.min(next, right - a.width))
      next = x + a.width + 16
      return [a.id, { open: true, min: false, max: false, x, y: 40, w: a.width, z: 1 + open.length - k }]
    }),
  ) as Record<Id, WindowState>
}

/** Open/minimised/maximised state, position and stacking of every app window. */
export function useWindowManager<Id extends string>(apps: readonly AppMeta<Id>[], initiallyOpen: readonly NoInfer<Id>[], iconsOnRight = false) {
  const [wins, setWins] = useState(() => initialWindows(apps, initiallyOpen, innerWidth, iconsOnRight))
  const ids = apps.map((a) => a.id)
  const top = Math.max(...ids.map((id) => wins[id].z))
  const focused = topWindow(wins)

  const patch = (id: Id, p: Partial<WindowState>) => setWins((w) => ({ ...w, [id]: { ...w[id], ...p } }))

  /** Brings a window to the front, opening/restoring it. A newly opened window is kept on screen. */
  const focus = (id: Id) =>
    setWins((w) => {
      const cur = w[id]
      const x = cur.open ? cur.x : Math.max(8, Math.min(cur.x, innerWidth - cur.w - 8))
      const y = cur.open ? cur.y : Math.max(0, Math.min(cur.y, innerHeight - 200))
      return { ...w, [id]: { ...cur, x, y, open: true, closing: false, min: false, z: top + 1 } }
    })

  return {
    wins,
    focused,
    focus,
    move: (id: Id, x: number, y: number) => patch(id, { x, y }),
    resize: (id: Id, x: number, y: number, w: number, h: number) => patch(id, { x, y, w, h }),
    minimize: (id: Id) => patch(id, { min: true }),
    toggleMaximize: (id: Id) => patch(id, { max: !wins[id].max }),
    /** starts the closing animation; the window calls `closed` when it's over */
    close: (id: Id) => patch(id, { closing: true }),
    closed: (id: Id) => patch(id, { open: false, closing: false, max: false }),
    /** taskbar click: minimise the focused window, otherwise bring it up */
    toggle: (id: Id) => (focused === id ? patch(id, { min: true }) : focus(id)),
  }
}
