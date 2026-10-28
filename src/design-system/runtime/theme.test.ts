import { describe, expect, it } from 'vitest'
import { defaultOsId } from './theme'

describe('defaultOsId', () => {
  it('shows each visitor the other side', () => {
    expect(defaultOsId('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36')).toBe('mac')
    expect(defaultOsId('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15')).toBe('xp')
    expect(defaultOsId('Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0')).toBe('xp')
  })

  it('gives phones and unknown browsers Windows XP', () => {
    expect(defaultOsId('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148')).toBe('xp')
    expect(defaultOsId('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36')).toBe('xp')
    expect(defaultOsId('Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1) Mobile Safari/537.36')).toBe('xp')
    expect(defaultOsId('')).toBe('xp')
  })
})
