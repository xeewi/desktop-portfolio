import { expect, test } from '@playwright/test'
import { appWindow, taskbar, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

const tour = (page: import('@playwright/test').Page) => appWindow(page, 'Guided tour')

test('the guided tour lists what to try and opens each app', async ({ page }) => {
  for (const title of ['Change the look', 'Switch operating system', 'Look under the hood', 'Use it like a desktop', 'Read it in French'])
    await expect(tour(page).getByRole('heading', { name: title })).toBeVisible()
  for (const app of ['Personalize', 'Change OS', 'Under the hood']) {
    await tour(page).getByRole('button', { name: `Open “${app}”` }).click()
    await expect(appWindow(page, app)).toHaveAttribute('data-active', 'true')
    await appWindow(page, app).getByRole('button', { name: 'Close' }).click() // it covers the tour
  }
})

test('keyboard: a tour button opens its app in front', async ({ page }) => {
  const button = tour(page).getByRole('button', { name: 'Open “Under the hood”' })
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(appWindow(page, 'Under the hood')).toHaveAttribute('data-active', 'true')
})

test('the guided tour is in French too', async ({ page }) => {
  await taskbar(page).getByRole('button', { name: /^EN/ }).click()
  await expect(appWindow(page, 'Visite guidée').getByRole('button', { name: 'Ouvrir « Sous le capot »' })).toBeVisible()
})
