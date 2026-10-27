import { describe, expect, it } from 'vitest'
import { OSES } from '../themes'
import { AA, contrast, parseHex, readable, UI } from './contrast'

const rgb = (s: string) => parseHex(s)!

describe('contrast', () => {
  it('matches the WCAG reference values', () => {
    expect(contrast(rgb('#000'), rgb('#fff'))).toBeCloseTo(21)
    expect(contrast(rgb('#fff'), rgb('#fff'))).toBeCloseTo(1)
    expect(contrast(rgb('#007aff'), rgb('#fff'))).toBeCloseTo(4.02, 1)
  })

  it('parses 3, 4, 6 and 8 digit hex, rejects the rest', () => {
    expect(parseHex('#f00')).toEqual([255, 0, 0])
    expect(parseHex('#ff000080')).toEqual([255, 0, 0])
    expect(parseHex('rgba(0,0,0,.5)')).toBeNull()
  })
})

describe('readable', () => {
  it('leaves colours that already pass alone', () => {
    const p = { '--paper': '#ffffff', '--ink': '#000000', '--muted': '#444444', '--heading': '#000080', '--accent': '#000080' }
    const { '--edge': _edge, ...rest } = readable(p)
    expect(rest).toEqual({ ...p, '--on-accent': '#fff', '--desk-ink': '#fff' })
  })

  it('darkens on light paper and lightens on dark paper, keeping the hue', () => {
    const light = readable({ '--paper': '#ffffff', '--accent': '#007aff' })
    expect(contrast(rgb(light['--accent']), rgb('#ffffff'))).toBeGreaterThanOrEqual(AA)
    const dark = readable({ '--paper': '#1f1f1f', '--accent': '#0078d7' })
    expect(contrast(rgb(dark['--accent']), rgb('#1f1f1f'))).toBeGreaterThanOrEqual(AA)
    expect(dark['--on-accent']).toBe('#000')
  })

  it('turns desktop labels black on a flat wallpaper too light for white', () => {
    expect(readable({ '--wall': '#ff0000' })['--desk-ink']).toBe('#000')
    expect(readable({ '--wall': '#008080' })['--desk-ink']).toBe('#fff')
    expect(readable({ '--wall': 'linear-gradient(#fff, #000)' })['--desk-ink']).toBe('#fff')
  })

  // every theme, current and future: text colours and text on the accent pass AA
  for (const os of OSES)
    for (const th of os.themes)
      it(`${os.name} / ${th.name} passes AA`, () => {
        const v = readable(th.vars)
        const paper = rgb(v['--paper'])
        for (const k of ['--ink', '--muted', '--heading', '--accent'] as const) expect(contrast(rgb(v[k]), paper), k).toBeGreaterThanOrEqual(AA)
        expect(contrast(rgb(v['--on-accent']), rgb(v['--accent']))).toBeGreaterThanOrEqual(AA)
        // regression: secondary buttons had no visible outline on dark and flat themes (macOS Dark Mode)
        expect(contrast(rgb(v['--edge']), paper), '--edge').toBeGreaterThanOrEqual(UI)
      })
})
