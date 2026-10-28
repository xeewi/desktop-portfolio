import { expect, test } from '@playwright/test'
import { taskbar, visit } from './helpers.ts'

const signature = (page: import('@playwright/test').Page) => page.getByTestId('wallpaper-signature')

test('the wallpaper says whose site this is, in the current language', async ({ page }) => {
  await visit(page)
  await expect(signature(page)).toBeVisible()
  await expect(signature(page)).toContainText('Guillaume Gautier')
  await expect(signature(page)).toContainText('Senior Full-Stack Engineer')
  await expect(signature(page)).toContainText('2× CTO')
  await taskbar(page).getByRole('button', { name: /^EN/ }).click()
  await expect(signature(page)).toContainText(/ans d.expérience/)
})

test('the signature follows the theme: dark ink on a light wallpaper', async ({ page }) => {
  await visit(page, { os: 'xp' })
  const ink = () => signature(page).evaluate((el) => getComputedStyle(el).color)
  expect(await ink()).toBe('rgb(255, 255, 255)')
  await page.evaluate(() => localStorage.setItem('theme:xp', 'watercolor'))
  await page.reload()
  expect(await ink()).not.toBe('rgb(255, 255, 255)')
})
