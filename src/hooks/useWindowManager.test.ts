import { describe, expect, it } from 'vitest'
import { initialWindows, topWindow, type WindowState } from './useWindowManager'

const w = (z: number, p: Partial<WindowState> = {}): WindowState => ({ open: true, min: false, max: false, x: 0, y: 0, w: 100, z, ...p })

describe('topWindow', () => {
  it('is the highest open window', () => {
    expect(topWindow({ a: w(1), b: w(3), c: w(2) })).toBe('b')
  })

  // regression: closing or minimising the top window left no window focused
  it('skips closed and minimised windows', () => {
    expect(topWindow({ a: w(1), b: w(3, { open: false }), c: w(4, { min: true }) })).toBe('a')
  })

  it('is undefined when nothing is on screen', () => {
    expect(topWindow({ a: w(1, { open: false }) })).toBeUndefined()
  })
})

describe('initialWindows', () => {
  const apps = [{ id: 'a', width: 600 }, { id: 'b', width: 400 }, { id: 'c', width: 300 }] as const

  it('puts the windows open at start side by side, the first one on top', () => {
    const w = initialWindows(apps, ['a', 'b'], 1280)
    expect([w.a.open, w.b.open, w.c.open]).toEqual([true, true, false])
    expect(w.b.x).toBe(w.a.x + 600 + 16)
    expect(w.b.y).toBe(w.a.y)
    expect(topWindow(w)).toBe('a')
  })

  it('keeps them on a narrow screen', () => {
    const w = initialWindows(apps, ['a', 'b'], 900)
    expect(w.b.x + w.b.w).toBeLessThanOrEqual(900 - 8)
  })

  // regression: on macOS the tour window covered the desktop icons, which sit on the right there
  it('leaves the desktop icons free, on the right on macOS', () => {
    const w = initialWindows(apps, ['a', 'b'], 1280, true)
    expect(w.a.x).toBe(8)
    expect(w.b.x).toBeGreaterThanOrEqual(w.a.x + 600)
    expect(w.b.x + w.b.w).toBeLessThanOrEqual(1280 - 220)
  })

  // regression: on Ubuntu the dock pushes the icons right, and the first window covered their second column
  it('leaves room for a dock on the left', () => {
    expect(initialWindows(apps, ['a'], 1600, false, 64).a.x).toBe(initialWindows(apps, ['a'], 1600).a.x + 64)
  })

  it('opens nothing when asked for nothing (phones)', () => {
    expect(topWindow(initialWindows(apps, [], 400))).toBeUndefined()
  })
})

describe('closing windows', () => {
  // a window playing its closing animation has already lost focus
  it('are skipped by topWindow', () => {
    expect(topWindow({ a: w(1), b: w(3, { closing: true }) })).toBe('a')
  })
})
