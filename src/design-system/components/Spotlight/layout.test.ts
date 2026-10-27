import { describe, expect, it } from 'vitest'
import { spotlightLayout } from './layout'

const screen = { w: 1280, h: 800 }

describe('spotlightLayout', () => {
  it('pads the ring around the target and puts the caption below', () => {
    const { ring, caption } = spotlightLayout({ x: 100, y: 100, w: 200, h: 50 }, screen)
    expect(ring).toEqual({ x: 94, y: 94, w: 212, h: 62 })
    expect(caption).toEqual({ left: 94, top: 162 })
  })

  it('puts the caption above a target at the bottom of the screen (the taskbar)', () => {
    const { ring, caption } = spotlightLayout({ x: 1200, y: 760, w: 60, h: 40 }, screen)
    expect(ring.y + ring.h).toBeLessThanOrEqual(screen.h)
    expect(caption).toEqual({ left: 1280 - 300 - 8, bottom: 800 - 754 + 6 })
  })

  it('puts the caption inside a target that fills the screen', () => {
    const { ring, caption } = spotlightLayout({ x: 0, y: 0, w: 1280, h: 800 }, screen)
    expect(ring).toEqual({ x: 2, y: 2, w: 1276, h: 796 })
    expect(caption).toEqual({ left: 8, top: 8 })
  })

  it('keeps the caption on screen next to a target on the right edge', () => {
    expect(spotlightLayout({ x: 1250, y: 100, w: 20, h: 20 }, screen).caption.left).toBe(1280 - 300 - 8)
  })
})
