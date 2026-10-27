import type { FullConfig, FullResult, Reporter, Suite } from '@playwright/test/reporter'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fromVitest, suite, toStatus, type Report } from '../src/apps/hood/testReport.ts'

/** Writes tests.json for Under the hood, Tests: this run's e2e results + the last `npm test` (reports/unit.json).
 *  Into public/ (next builds) and dist/ (the build these tests just ran against). */
export default class TestReport implements Reporter {
  private root = ''
  private suite?: Suite

  onBegin(config: FullConfig, s: Suite) {
    this.root = dirname(config.configFile!) // the repo (rootDir is the test dir)
    this.suite = s
  }

  onEnd(result: FullResult) {
    const tests = this.suite!.allTests()
    const ran = new Set(tests.map((t) => basename(t.location.file)))
    const specs = readdirSync(join(this.root, 'e2e')).filter((f) => f.endsWith('.spec.ts'))
    // ponytail: only a full run publishes, so one file or --list doesn't overwrite the report with a slice.
    // A --grep that keeps a test in every file slips through: add an env flag if that becomes a habit.
    if (result.status === 'interrupted' || !specs.every((f) => ran.has(f)) || tests.some((t) => !t.results.length)) return

    const e2e = suite(
      tests.map((t) => ({
        file: 'e2e/' + basename(t.location.file),
        name: t.titlePath().slice(3).join(' › '), // ['', project, file, ...describe, title]
        status: toStatus(t.outcome()),
        ms: Math.round(t.results.reduce((n, r) => n + r.duration, 0)),
      })),
      result.startTime.toISOString(),
    )
    const unitFile = join(this.root, 'reports/unit.json')
    const unit = existsSync(unitFile) ? fromVitest(JSON.parse(readFileSync(unitFile, 'utf8')), this.root) : null
    const json = JSON.stringify({ unit, e2e } satisfies Report)
    for (const dir of ['public', 'dist']) if (existsSync(join(this.root, dir))) writeFileSync(join(this.root, dir, 'tests.json'), json)
  }
}
