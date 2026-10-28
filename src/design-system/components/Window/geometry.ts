// Window maths, kept pure so it can be unit-tested (geometry.test.ts).

export type Rect = { x: number; y: number; w: number; h: number }
/** resize handles: the edge(s) each one moves */
export const EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const
export type Edge = (typeof EDGES)[number]

export const MIN_W = 300
export const MIN_H = 180
/** how much of the title bar must stay on screen (px) */
const KEEP = 120

/** New rect when `edge` of `start` is dragged by (dx, dy). Moving the left/top edge also moves
 *  the window, so the opposite edge stays put. Never smaller than MIN_W × MIN_H, never above the screen. */
export function resizeRect(start: Rect, edge: Edge, dx: number, dy: number): Rect {
  const w = Math.max(MIN_W, edge.includes('e') ? start.w + dx : edge.includes('w') ? start.w - dx : start.w)
  const h = Math.max(MIN_H, edge.includes('s') ? start.h + dy : edge.includes('n') ? start.h - dy : start.h)
  const x = edge.includes('w') ? start.x + start.w - w : start.x
  const y = edge.includes('n') ? Math.max(0, start.y + start.h - h) : start.y
  return { x, y, w, h }
}

/** Window position while dragging its title bar: `grab` is where the pointer holds the window,
 *  `width` its rendered width. Keeps a grabbable part of the title bar on screen. */
export function dragTo(pointer: { x: number; y: number }, grab: { dx: number; dy: number }, width: number, screen: { w: number; h: number }) {
  return {
    x: Math.min(Math.max(pointer.x - grab.dx, -width + KEEP), screen.w - KEEP),
    y: Math.min(Math.max(pointer.y - grab.dy, 0), screen.h - 80),
  }
}

/** Where a minimised window flies to: its taskbar button / dock icon `to` (or the bottom of the screen
 *  when it has none). Read by the minimise keyframes in Window.css:
 *  - `dx`, `dy`, `scale`: from the window's centre to the button's centre, shrinking to its size;
 *  - `x`, `y`, `sx`, `sy`: from the window's top-left corner, the title bar (`barH` high) becoming the button
 *    (Windows 95 / XP only animate the title bar);
 *  - `funnel`: where the button sits along the window's width, 0 to 1 (macOS genie). */
export function minimizeTarget(win: Rect, to: Rect | undefined, barH: number, screen: { w: number; h: number }) {
  const t = to && to.w > 0 ? to : { x: win.x + win.w / 2 - 20, y: screen.h - 40, w: 40, h: 40 }
  const cx = t.x + t.w / 2
  return {
    dx: cx - (win.x + win.w / 2),
    dy: t.y + t.h / 2 - (win.y + win.h / 2),
    scale: Math.min(t.w / win.w, t.h / win.h),
    x: t.x - win.x,
    y: t.y - win.y,
    sx: t.w / win.w,
    sy: t.h / Math.max(1, barH),
    funnel: Math.min(1, Math.max(0, (cx - win.x) / win.w)),
  }
}

/** Longest duration in a computed CSS list ("0.2s, 150ms"), in ms. "auto" or garbage counts as 0. */
export const longestMs = (css: string) =>
  Math.max(0, ...css.split(',').map((v) => parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000) || 0))
