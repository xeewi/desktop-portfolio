// Where the spotlight ring and its caption go, kept pure so it can be unit-tested (layout.test.ts).

export type Rect = { x: number; y: number; w: number; h: number }

/** gap between the target and the ring, and between the ring and the caption (px) */
const PAD = 6
/** room the caption needs above or below the ring (px) */
const CAPTION_H = 72
const CAPTION_W = 300
const EDGE = 8

/** Ring around `target` (padded, kept on screen) and caption position: below the ring if it fits,
 *  else above (as a distance from the bottom), else inside the ring's top. */
export function spotlightLayout(target: Rect, screen: { w: number; h: number }) {
  const x = Math.max(2, target.x - PAD)
  const y = Math.max(2, target.y - PAD)
  const ring = {
    x,
    y,
    w: Math.min(screen.w - 2, target.x + target.w + PAD) - x,
    h: Math.min(screen.h - 2, target.y + target.h + PAD) - y,
  }
  const bottom = ring.y + ring.h
  const left = Math.max(EDGE, Math.min(ring.x, screen.w - CAPTION_W - EDGE))
  const caption =
    bottom + PAD + CAPTION_H <= screen.h
      ? { left, top: bottom + PAD }
      : ring.y - PAD - CAPTION_H >= 0
        ? { left, bottom: screen.h - ring.y + PAD }
        : { left: Math.max(EDGE, ring.x + PAD), top: ring.y + PAD }
  return { ring, caption }
}
