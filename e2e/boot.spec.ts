import { expect, test } from '@playwright/test'
import { appWindow, desktopIcon, visit } from './helpers.ts'

test.use({ reducedMotion: 'no-preference' })

test('boot screen on arrival, gone by itself; a click skips it', async ({ page }) => {
  await visit(page)
  const boot = page.locator('.ds-boot')
  await expect(boot).toBeVisible()
  await expect(boot).toContainText('Windows Vista')
  await expect(boot).toBeHidden({ timeout: 5000 })

  await page.reload()
  await boot.click()
  await expect(boot).toBeHidden()
})

test('any key skips the boot screen too (keyboard users)', async ({ page }) => {
  await visit(page)
  await expect(page.locator('.ds-boot')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('.ds-boot')).toHaveCount(0)
})

test('switching OS replays the boot screen', async ({ page }) => {
  await visit(page)
  await page.locator('.ds-boot').click()
  await desktopIcon(page, 'Change OS').click()
  await appWindow(page, 'Change OS').getByRole('button', { name: /^macOS/ }).click()
  await expect(page.locator('.ds-boot')).toContainText('macOS')
})

test('no boot screen when the visitor prefers reduced motion', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await visit(page)
  await expect(page.locator('.ds-boot')).toHaveCount(0)
})
