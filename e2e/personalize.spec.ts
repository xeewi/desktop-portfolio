import { expect, test } from '@playwright/test'
import { appWindow, desktopIcon, visit } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await visit(page)
  await desktopIcon(page, 'Personalize').click()
})

test('shows only the current OS themes, no OS tabs', async ({ page }) => {
  const win = appWindow(page, 'Personalize')
  await expect(win.getByRole('heading', { name: 'Visual styles · Windows Vista' })).toBeVisible()
  await expect(win.getByRole('tab')).toHaveCount(0)
  await expect(win.getByRole('button', { name: /^Aero/ })).toHaveAttribute('aria-pressed', 'true')
})

test('picking a theme applies it and is remembered', async ({ page }) => {
  const html = page.locator('html')
  const wall = () => html.evaluate((el) => el.style.getPropertyValue('--wall'))
  const before = await wall()
  await appWindow(page, 'Personalize').getByRole('button', { name: /^Longhorn Plex/ }).click()
  await expect(appWindow(page, 'Personalize').getByRole('button', { name: /^Longhorn Plex/ })).toHaveAttribute('aria-pressed', 'true')
  expect(await wall()).not.toBe(before)
  const picked = await wall()
  await page.reload()
  expect(await wall()).toBe(picked)
})

test('"Change OS…" opens the OS picker', async ({ page }) => {
  await appWindow(page, 'Personalize').getByRole('button', { name: 'Change OS…' }).click()
  await expect(appWindow(page, 'Change OS')).toHaveAttribute('data-active', 'true')
})
