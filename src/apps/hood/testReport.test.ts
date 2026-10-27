import { describe, expect, it } from 'vitest'
import { count, fromVitest, suite, toStatus } from './testReport'

describe('suite', () => {
  it('groups tests by file, files sorted, tests kept in run order', () => {
    const s = suite(
      [
        { file: 'b.spec.ts', name: 'b1', status: 'passed', ms: 1 },
        { file: 'a.spec.ts', name: 'a2', status: 'failed', ms: 2 },
        { file: 'a.spec.ts', name: 'a1', status: 'passed', ms: 3 },
      ],
      '2026-10-27T10:00:00.000Z',
    )
    expect(s.files.map((f) => f.file)).toEqual(['a.spec.ts', 'b.spec.ts'])
    expect(s.files[0].tests.map((t) => t.name)).toEqual(['a2', 'a1'])
  })
})

describe('fromVitest', () => {
  it('reads Vitest JSON: relative paths, rounded durations, ISO date', () => {
    const s = fromVitest(
      {
        startTime: Date.UTC(2026, 9, 27, 10),
        testResults: [
          {
            name: '/repo/src/x.test.ts',
            assertionResults: [
              { fullName: 'x adds', status: 'passed', duration: 1.6 },
              { fullName: 'x todo', status: 'todo', duration: null },
            ],
          },
        ],
      },
      '/repo',
    )
    expect(s).toEqual({
      date: '2026-10-27T10:00:00.000Z',
      files: [
        {
          file: 'src/x.test.ts',
          tests: [
            { name: 'x adds', status: 'passed', ms: 2 },
            { name: 'x todo', status: 'skipped', ms: 0 },
          ],
        },
      ],
    })
  })
})

describe('toStatus', () => {
  it('maps Vitest and Playwright statuses; a flaky test passed on retry', () => {
    expect(['passed', 'expected', 'flaky', 'failed', 'unexpected', 'skipped', 'pending'].map(toStatus)).toEqual([
      'passed', 'passed', 'passed', 'failed', 'failed', 'skipped', 'skipped',
    ])
  })
})

describe('count', () => {
  it('adds up statuses and time', () => {
    const s = suite(
      [
        { file: 'a', name: '1', status: 'passed', ms: 5 },
        { file: 'b', name: '2', status: 'failed', ms: 7 },
        { file: 'b', name: '3', status: 'skipped', ms: 0 },
      ],
      '',
    )
    expect(count(s)).toEqual({ passed: 1, failed: 1, skipped: 1, ms: 12 })
  })
})
