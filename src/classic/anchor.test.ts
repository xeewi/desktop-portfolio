import { expect, it } from 'vitest'
import { content } from '../content'
import { anchor } from './anchor'

it('turns a company into a stable id', () => {
  expect(anchor('Chronogolf (Lightspeed)')).toBe('xp-chronogolf-lightspeed')
})

it('every client a service names is a mission on the page, in both languages', () => {
  for (const c of Object.values(content)) {
    const ids = c.experiences.map((e) => anchor(e.company))
    for (const s of c.classic.services) for (const w of s.where) expect(ids).toContain(anchor(w))
  }
})
