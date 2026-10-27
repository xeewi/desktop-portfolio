import { useEffect, useState } from 'react'
import { Heading, Pane, Text } from '../../design-system'
import type { Content } from '../../content'
import { count, type Report, type Suite } from './testReport'
import './Tests.css'

const MARK = { passed: '✓', failed: '✗', skipped: '–' }

/** Under the hood, Tests: the site's own test results, from the last full run (tests.json, written by e2e/reporter.ts). */
export function Tests({ c }: { c: Content }) {
  // undefined: loading, null: no report published yet
  const [report, setReport] = useState<Report | null>()
  useEffect(() => {
    fetch('/tests.json')
      .then((r) => (r.ok ? r.json() : null))
      .then(setReport, () => setReport(null))
  }, [])

  return (
    <Pane>
      <Text variant="muted">{c.ui.testsSub}</Text>
      {report === null && <Text>{c.ui.testsMissing}</Text>}
      {report?.unit && <SuiteView c={c} title={c.ui.unitTests} suite={report.unit} />}
      {report && <SuiteView c={c} title={c.ui.e2eTests} suite={report.e2e} />}
    </Pane>
  )
}

function SuiteView({ c, title, suite }: { c: Content; title: string; suite: Suite }) {
  const n = count(suite)
  const date = new Date(suite.date).toLocaleString(c.ui.locale, { dateStyle: 'long', timeStyle: 'short' })
  return (
    <section className="tests-suite">
      <Heading level={4}>{title}</Heading>
      <Text variant="muted">{c.ui.testsSummary(n.passed, n.failed, n.skipped, (n.ms / 1000).toLocaleString(c.ui.locale, { maximumSignificantDigits: 2 }), date)}</Text>
      {suite.files.map((f) => (
        <details key={f.file} className="tests-file">
          {/* lang="en": file paths and test names are written in English */}
          <summary>
            <code lang="en">{f.file}</code> ({f.tests.filter((t) => t.status === 'passed').length}/{f.tests.length})
          </summary>
          <ul lang="en">
            {f.tests.map((t) => (
              <li key={t.name} data-status={t.status}>
                <span aria-hidden>{MARK[t.status]}</span>
                <span className="ds-sr-only" lang={c.ui.locale.slice(0, 2)}>{c.ui.testStatus[t.status]}:</span> {t.name}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  )
}
