import { expect, test } from '@playwright/test'
import { appWindow, taskbar, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

const about = (page: import('@playwright/test').Page) => appWindow(page, 'About me')

test('About me explains the site, then what to try, then who I am', async ({ page }) => {
  await expect(about(page)).toContainText('I built a computer you can actually use')
  await expect(about(page).getByRole('heading', { level: 3 })).toHaveText(['Guillaume Gautier', 'Things to try', 'Who I am'])
  for (const title of ['Feeling lucky?', 'Change the look', 'Switch operating system', 'Look under the hood', 'Read it in French', 'Use it like a desktop'])
    await expect(about(page).getByRole('heading', { level: 4, name: title })).toBeVisible()
})

test('the tips open each app', async ({ page }) => {
  for (const app of ['Personalize', 'Change OS', 'Under the hood']) {
    await about(page).getByRole('button', { name: `Open “${app}”` }).click()
    await expect(appWindow(page, app)).toHaveAttribute('data-active', 'true')
    await appWindow(page, app).getByRole('button', { name: 'Close' }).click() // it covers About me
  }
})

test('keyboard: a tip button opens its app in front', async ({ page }) => {
  await about(page).getByRole('button', { name: 'Open “Under the hood”' }).focus()
  await page.keyboard.press('Enter')
  await expect(appWindow(page, 'Under the hood')).toHaveAttribute('data-active', 'true')
})

test('the language tip switches the whole site to French', async ({ page }) => {
  await about(page).getByRole('button', { name: 'Passer en français' }).click()
  await expect(appWindow(page, 'À propos de moi').getByRole('button', { name: 'Ouvrir « Sous le capot »' })).toBeVisible()
  await expect(taskbar(page).getByRole('button', { name: /^FR/ })).toBeVisible()
})

test('Surprise me reboots into another system, with one of its themes', async ({ page }) => {
  await about(page).getByRole('button', { name: 'Surprise me' }).click()
  const os = await page.evaluate(() => localStorage.getItem('os'))
  expect(os).not.toBe('vista')
  expect(await page.evaluate((os) => localStorage.getItem('theme:' + os), os)).toBeTruthy()
  await expect(about(page)).toBeVisible()
})
