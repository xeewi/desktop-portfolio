import { describe, expect, it } from 'vitest'
import { basePalette } from '../tokens/palette'
import { savedOs, savedTheme } from '../runtime/theme'
import { OSES } from '.'

describe('OSES', () => {
  it('has unique ids', () => {
    const ids = OSES.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  for (const os of OSES) {
    describe(os.name, () => {
      it('has themes with unique ids', () => {
        expect(os.themes.length).toBeGreaterThan(0)
        const ids = os.themes.map((t) => t.id)
        expect(new Set(ids).size).toBe(ids.length)
      })

      it('defines every palette variable in every theme, in both languages', () => {
        for (const th of os.themes) {
          expect(Object.keys(th.vars).sort()).toEqual(Object.keys(basePalette).sort())
          expect(th.desc.en && th.desc.fr).toBeTruthy()
        }
        expect(os.sub.en && os.sub.fr).toBeTruthy()
      })
    })
  }
})

describe('saved choice (no storage available here)', () => {
  it('falls back to Vista and to the first theme of an OS', () => {
    expect(savedOs().id).toBe('vista')
    for (const os of OSES) expect(savedTheme(os)).toBe(os.themes[0])
  })
})
