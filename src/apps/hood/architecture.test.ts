import { describe, expect, it } from 'vitest'
import { content } from '../../content'
import { PATHS as files } from './sources'

// the notes must point at files the browser can open (sources.ts)

describe('Under the hood, Architecture notes', () => {
  for (const [lang, c] of Object.entries(content))
    it(`names only folders and files that exist (${lang}): a move or rename shows up here`, () => {
      const missing = c.architecture.flatMap((d) => [d.path, ...d.files.map((f) => f.path)]).filter((p) => !files.some((f) => f === p || f.startsWith(p.endsWith('/') ? p : p + '/')))
      expect(missing).toEqual([])
    })

  it('lists the same folders and files in both languages', () => {
    const paths = (lang: 'en' | 'fr') => content[lang].architecture.map((d) => [d.path, d.files.map((f) => f.path)])
    expect(paths('fr')).toEqual(paths('en'))
  })
})
