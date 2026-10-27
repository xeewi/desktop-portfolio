import { expect, test } from '@playwright/test'
import { appWindow, desktopIcon, taskbar, visit } from './helpers.ts'

test('English by default, switch to French from the tray, kept after reload', async ({ page }) => {
  await visit(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await taskbar(page).getByRole('button', { name: 'Passer en français' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(appWindow(page, 'À propos de moi')).toBeVisible()
  await expect(desktopIcon(page, 'Changer d’OS')).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(taskbar(page).getByRole('button', { name: 'Switch to English' })).toBeVisible()
})

test('the tray clock shows the time', async ({ page }) => {
  await visit(page)
  await expect(taskbar(page).locator('.ds-trayclock')).toHaveText(/^\d{1,2}:\d{2}/)
})
