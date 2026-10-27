import { expect, test, type Page } from '@playwright/test'
import { appWindow, desktopIcon, taskbar, visit } from './helpers.ts'
import type { Report } from '../src/apps/hood/testReport.ts'

const REPORT: Report = {
  unit: { date: '2026-10-27T10:00:00.000Z', files: [{ file: 'src/a.test.ts', tests: [{ name: 'a adds', status: 'passed', ms: 3 }] }] },
  e2e: {
    date: '2026-10-27T10:05:00.000Z',
    files: [
      {
        file: 'e2e/windows.spec.ts',
        tests: [
          { name: 'windows can be dragged', status: 'passed', ms: 2000 },
          { name: 'windows can be resized', status: 'failed', ms: 1500 },
        ],
      },
    ],
  },
}

/** Serves `report` as /tests.json (null: not published yet), then opens Under the hood on its Tests screen. */
async function open(page: Page, report: Report | null) {
  await page.route('**/tests.json', (r) => (report ? r.fulfill({ json: report }) : r.fulfill({ status: 404 })))
  await visit(page)
  await desktopIcon(page, 'Under the hood').click()
  await appWindow(page, 'Under the hood').getByRole('button', { name: /^Tests/ }).click()
  return appWindow(page, 'Under the hood')
}

test('shows each suite with its totals; a file opens to its tests, in both languages', async ({ page }) => {
  const win = await open(page, REPORT)
  await expect(win.getByRole('heading', { level: 4 })).toHaveText(['Unit tests', 'End-to-end tests'])
  await expect(win).toContainText('1 passed · 1 failed · 3.5 s · run on October 27, 2026')
  await expect(win.getByText('windows can be resized')).toBeHidden()
  await win.getByText('e2e/windows.spec.ts').click()
  await expect(win.getByRole('listitem')).toHaveText(['passed: windows can be dragged', 'failed: windows can be resized'].map((t) => new RegExp(t)))
  await taskbar(page).getByRole('button', { name: /^EN/ }).click()
  await expect(appWindow(page, 'Sous le capot')).toContainText('1 réussis · 1 en échec · 3,5 s')
})

test('says so when no results have been published yet', async ({ page }) => {
  const win = await open(page, null)
  await expect(win).toContainText('No results yet')
  await expect(win.getByRole('heading', { level: 4 })).toHaveCount(0)
})

test('keyboard: a file opens and closes with Enter', async ({ page }) => {
  const win = await open(page, REPORT)
  const file = win.locator('summary', { hasText: 'src/a.test.ts' })
  await file.focus()
  await expect(file).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(win.getByText('a adds')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(win.getByText('a adds')).toBeHidden()
})

test('"Show me" on the tests note opens the Tests screen', async ({ page }) => {
  const hood = await open(page, REPORT)
  await hood.getByRole('button', { name: /^Back/ }).click()
  await hood.getByRole('button', { name: /^Technical choices/ }).click()
  await hood.getByRole('button', { name: 'Show me – Tested on every theme' }).click()
  await expect(hood.getByRole('heading', { level: 3, name: 'Tests' })).toBeFocused()
  await expect(hood).toContainText('End-to-end tests')
})
