import { expect, test, type Page } from '@playwright/test'
import { appWindow, desktopIcon, taskbar, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

const hood = (page: Page) => appWindow(page, 'Under the hood')
const title = (page: Page) => hood(page).locator('.ds-explorer').getByRole('heading', { level: 4 })
const back = (page: Page) => hood(page).getByRole('button', { name: /^Back/ })

/** Under the hood, on its Architecture screen (the root of the repo). */
async function open(page: Page) {
  await desktopIcon(page, 'Under the hood').click()
  await hood(page).getByRole('button', { name: /^Architecture/ }).click()
}

test('browse folders down to a file and read its code; the path leads back up', async ({ page }) => {
  await open(page)
  await expect(title(page)).toHaveText('All files')
  await hood(page).getByRole('button', { name: 'src/', exact: true }).click()
  await hood(page).getByRole('button', { name: 'hooks/', exact: true }).click()
  await expect(title(page)).toHaveText('hooks/')
  await expect(hood(page)).toContainText('Five small React hooks') // the note on this folder
  await hood(page).getByRole('button', { name: 'useLang.ts', exact: true }).click()
  await expect(title(page)).toHaveText('useLang.ts')
  await expect(hood(page).locator('pre')).toContainText('export function useLang')
  await expect(hood(page)).toContainText('personalBranding ▸ src ▸ hooks ▸ useLang.ts')
  await hood(page).getByRole('navigation', { name: 'Path' }).getByRole('button', { name: 'src/' }).click()
  await expect(title(page)).toHaveText('src/')
})

// regression: Back retraced the history, then climbed the folders; it leads straight to the home screen
test('Back leads straight to the home screen, even from a file deep in a folder', async ({ page }) => {
  await open(page)
  await hood(page).getByRole('button', { name: /^src\/design-system\/chromes\// }).click()
  await hood(page).getByRole('button', { name: 'vista.css', exact: true }).click()
  await expect(title(page)).toHaveText('vista.css')
  await back(page).click()
  await expect(hood(page).getByRole('heading', { level: 3 })).toHaveText('Under the hood')
  await expect(back(page)).toHaveCount(0)
})

test('the sidebar jumps to the key folders, with their note, in both languages', async ({ page }) => {
  await open(page)
  await hood(page).getByRole('button', { name: /^src\/design-system\/chromes\// }).click()
  await expect(title(page)).toHaveText('chromes/')
  await expect(hood(page).getByRole('button', { name: /^src\/design-system\/chromes\// })).toHaveAttribute('aria-current', 'true')
  await expect(hood(page).getByRole('button', { name: 'vista.css', exact: true })).toBeVisible()
  await taskbar(page).getByRole('button', { name: /^EN/ }).click()
  await expect(appWindow(page, 'Sous le capot')).toContainText('L’allure de chaque famille d’OS')
})

test('keyboard: Enter opens an entry and focus lands on its name', async ({ page }) => {
  await open(page)
  const docs = hood(page).getByRole('button', { name: 'docs/', exact: true })
  await docs.focus()
  await page.keyboard.press('Enter')
  await expect(title(page)).toHaveText('docs/')
  await expect(title(page)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(hood(page).getByRole('button', { name: 'ACCESSIBILITE.md', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(hood(page).locator('pre')).toContainText('WCAG')
  await page.keyboard.press('Tab')
  await expect(hood(page).locator('pre')).toBeFocused() // scrollable with the keyboard
})
