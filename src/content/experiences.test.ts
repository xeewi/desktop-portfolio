import { describe, expect, it } from 'vitest'
import { en } from './en'
import { fr } from './fr'

// files served from public/xp/, as the site sees them ('/xp/…')
const served = new Set(Object.keys(import.meta.glob('/public/xp/*', { query: '?url' })).map((f) => f.replace('/public', '')))

const media = (c: typeof en) => c.experiences.map((x) => ({ href: x.link?.href, logo: x.logo, shots: x.shots?.map((s) => s.src) }))

describe('experiences', () => {
  it('link to the same sites and images in both languages', () => {
    expect(media(fr)).toEqual(media(en))
  })

  it('point to images that exist in public/', () => {
    const files = media(en).flatMap((m) => [m.logo, ...(m.shots ?? [])]).filter(Boolean)
    for (const f of files) expect(served.has(f!), f).toBe(true)
  })

  it('describe every screenshot', () => {
    for (const c of [en, fr]) for (const s of c.experiences.flatMap((x) => x.shots ?? [])) expect(s.alt.length).toBeGreaterThan(10)
  })
})
