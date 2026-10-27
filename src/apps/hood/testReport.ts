// The test results shown in Under the hood, Tests. Written by e2e/reporter.ts at the end of a full
// Playwright run (public/tests.json, and dist/tests.json so the current build has it too).

export type Status = 'passed' | 'failed' | 'skipped'
export type TestCase = { file: string; name: string; status: Status; ms: number }
export type Suite = { date: string; files: { file: string; tests: Omit<TestCase, 'file'>[] }[] }
export type Report = { unit: Suite | null; e2e: Suite }

/** Tests grouped by file, files in alphabetical order, tests in run order. */
export function suite(tests: TestCase[], date: string): Suite {
  const byFile = new Map<string, Suite['files'][number]['tests']>()
  for (const { file, ...t } of tests) byFile.set(file, [...(byFile.get(file) ?? []), t])
  return { date, files: [...byFile].sort(([a], [b]) => a.localeCompare(b)).map(([file, tests]) => ({ file, tests })) }
}

type VitestJson = {
  startTime: number
  testResults: { name: string; assertionResults: { fullName: string; status: string; duration?: number | null }[] }[]
}

/** Vitest's JSON reporter output → a Suite. `root`: stripped from file paths. */
export function fromVitest(json: VitestJson, root: string): Suite {
  const tests = json.testResults.flatMap((f) =>
    f.assertionResults.map((a) => ({
      file: f.name.startsWith(root) ? f.name.slice(root.length).replace(/^\//, '') : f.name,
      name: a.fullName,
      status: toStatus(a.status),
      ms: Math.round(a.duration ?? 0),
    })),
  )
  return suite(tests, new Date(json.startTime).toISOString())
}

/** Vitest says passed/failed/skipped/pending/todo; Playwright's outcome() expected/unexpected/flaky/skipped. */
export function toStatus(s: string): Status {
  if (s === 'passed' || s === 'expected' || s === 'flaky') return 'passed' // flaky: passed on retry
  if (s === 'failed' || s === 'unexpected') return 'failed'
  return 'skipped'
}

export function count(s: Suite) {
  const n = { passed: 0, failed: 0, skipped: 0, ms: 0 }
  for (const f of s.files)
    for (const t of f.tests) {
      n[t.status]++
      n.ms += t.ms
    }
  return n
}
