import { expect, test } from '@playwright/test'
import { APPS, appWindow, taskbar, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

const startMenu = (page: import('@playwright/test').Page) => page.locator('.ds-startmenu')

test('lists every app and opens one', async ({ page }) => {
  await taskbar(page).getByRole('button', { name: 'Start' }).click()
  for (const name of APPS) await expect(startMenu(page).getByRole('button', { name, exact: true })).toBeVisible()
  await startMenu(page).getByRole('button', { name: 'Skills', exact: true }).click()
  await expect(appWindow(page, 'Skills')).toBeVisible()
  await expect(startMenu(page)).toBeHidden()
})

test('closes when clicking the desktop or the start button again', async ({ page }) => {
  const start = taskbar(page).getByRole('button', { name: 'Start' })
  await start.click()
  await expect(start).toHaveAttribute('aria-expanded', 'true')
  await start.click()
  await expect(startMenu(page)).toBeHidden()
  await start.click()
  await page.mouse.click(900, 700)
  await expect(startMenu(page)).toBeHidden()
})

test('has the profile links', async ({ page }) => {
  await taskbar(page).getByRole('button', { name: 'Start' }).click()
  await expect(startMenu(page).getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', /linkedin\.com/)
  await expect(startMenu(page).getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', /github\.com/)
  await expect(startMenu(page).getByRole('link', { name: 'Email' })).toHaveAttribute('href', /^mailto:/)
  await expect(startMenu(page).getByRole('link', { name: 'Resume (PDF)' })).toHaveAttribute('href', '/cv.pdf')
})
