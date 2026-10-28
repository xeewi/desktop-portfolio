import { describe, expect, it } from 'vitest'
import { dragTo, longestMs, MIN_H, MIN_W, minimizeTarget, resizeRect } from './geometry'

const start = { x: 100, y: 100, w: 600, h: 400 }

describe('resizeRect', () => {
  it('grows from the right / bottom edges without moving', () => {
    expect(resizeRect(start, 'e', 50, 99)).toEqual({ x: 100, y: 100, w: 650, h: 400 })
    expect(resizeRect(start, 's', 99, 30)).toEqual({ x: 100, y: 100, w: 600, h: 430 })
    expect(resizeRect(start, 'se', 50, 30)).toEqual({ x: 100, y: 100, w: 650, h: 430 })
  })

  it('moves the window when dragging the left / top edges, the opposite edge stays put', () => {
    const r = resizeRect(start, 'nw', -40, -20)
    expect(r).toEqual({ x: 60, y: 80, w: 640, h: 420 })
    expect(r.x + r.w).toBe(start.x + start.w)
    expect(r.y + r.h).toBe(start.y + start.h)
  })

  it('never goes below the minimum size, and the far edge still stays put', () => {
    expect(resizeRect(start, 'se', -1000, -1000)).toMatchObject({ w: MIN_W, h: MIN_H, x: 100, y: 100 })
    const r = resizeRect(start, 'w', 1000, 0)
    expect(r.w).toBe(MIN_W)
    expect(r.x + r.w).toBe(start.x + start.w)
  })

  it('never pushes the top edge above the screen', () => {
    expect(resizeRect(start, 'n', 0, -500).y).toBe(0)
  })
})

describe('dragTo', () => {
  const screen = { w: 1280, h: 800 }
  const grab = { dx: 20, dy: 10 }

  it('follows the pointer on both axes', () => {
    expect(dragTo({ x: 520, y: 310 }, grab, 600, screen)).toEqual({ x: 500, y: 300 })
  })

  it('keeps part of the title bar on screen', () => {
    expect(dragTo({ x: -5000, y: -50 }, grab, 600, screen)).toEqual({ x: -600 + 120, y: 0 })
    expect(dragTo({ x: 5000, y: 5000 }, grab, 600, screen)).toEqual({ x: 1280 - 120, y: 800 - 80 })
  })

  // regression: a missing width (stale state after a hot reload) froze the window horizontally
  it('still moves horizontally after a resize', () => {
    const resized = resizeRect(start, 'se', 200, 100)
    expect(dragTo({ x: 320, y: 110 }, grab, resized.w, screen).x).toBe(300)
  })
})

describe('minimizeTarget', () => {
  const win = { x: 100, y: 100, w: 400, h: 300 }
  const screen = { w: 1280, h: 800 }

  it('goes from the window centre to the button centre, shrinking to the button', () => {
    const m = minimizeTarget(win, { x: 280, y: 760, w: 40, h: 30 }, 30, screen)
    expect([m.dx, m.dy]).toEqual([0, 525])
    expect(m.scale).toBe(0.1)
  })

  it('turns the title bar into the button (95 / XP)', () => {
    const m = minimizeTarget(win, { x: 280, y: 760, w: 40, h: 30 }, 30, screen)
    expect([m.x, m.y, m.sx, m.sy]).toEqual([180, 660, 0.1, 1])
  })

  it('funnels towards the button, clamped to the window', () => {
    expect(minimizeTarget(win, { x: 280, y: 760, w: 40, h: 30 }, 30, screen).funnel).toBe(0.5)
    expect(minimizeTarget(win, { x: 1000, y: 760, w: 40, h: 30 }, 30, screen).funnel).toBe(1)
  })

  // a hidden button (display: none) measures 0×0: aim at the bottom of the screen instead
  it('falls back to the bottom of the screen without a visible button', () => {
    for (const to of [undefined, { x: 0, y: 0, w: 0, h: 0 }]) {
      const m = minimizeTarget(win, to, 30, screen)
      expect(m.dx).toBe(0)
      expect(m.dy).toBe(780 - 250)
    }
  })
})

describe('longestMs', () => {
  it('reads seconds and milliseconds, keeps the longest', () => {
    expect(longestMs('0.2s')).toBe(200)
    expect(longestMs('0.2s, 350ms')).toBe(350)
  })
  it('is 0 for no animation', () => {
    expect(longestMs('0s')).toBe(0)
    expect(longestMs('auto')).toBe(0)
  })
})
