import { describe, expect, it } from 'vitest'
import { OSES } from '../design-system'
import { surprise } from './surprise'

describe('surprise', () => {
  it('never picks the current OS', () => {
    for (const current of OSES)
      for (const r of [0, 0.3, 0.6, 0.999]) expect(surprise(OSES, current, () => r).os.id).not.toBe(current.id)
  })

  it('picks a theme of the chosen OS, over the whole range', () => {
    const first = surprise(OSES, OSES[0], () => 0)
    expect(first.os).toBe(OSES[1])
    expect(first.theme).toBe(OSES[1].themes[0])
    const last = surprise(OSES, OSES[0], () => 0.999)
    expect(last.os).toBe(OSES.at(-1))
    expect(last.theme).toBe(OSES.at(-1)!.themes.at(-1))
  })
})
