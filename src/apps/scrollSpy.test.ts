import { describe, expect, it } from 'vitest'
import { activeSection } from './scrollSpy'

const tops = [0, 500, 1200, 1500]
const at = (scrollTop: number) => activeSection(tops, scrollTop, 600, 2000)

describe('activeSection', () => {
  it('is the first section at the top', () => expect(at(0)).toBe(0))
  it('switches when the next section nears the top', () => {
    expect(at(430)).toBe(0)
    expect(at(450)).toBe(1)
  })
  it('is the last section once scrolled to the bottom, even if it never reached the top', () => expect(at(1400)).toBe(3))
  it('handles a single section', () => expect(activeSection([0], 300, 600, 2000)).toBe(0))
})
