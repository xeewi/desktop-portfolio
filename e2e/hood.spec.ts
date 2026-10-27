import { expect, test } from '@playwright/test'
import { appWindow, desktopIcon, taskbar, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

const hood = (page: import('@playwright/test').Page) => appWindow(page, 'Under the hood')
const showMe = (page: import('@playwright/test').Page, note: string) => hood(page).getByRole('button', { name: `Show me – ${note}` })
const caption = (page: import('@playwright/test').Page) => page.locator('.ds-spotlight__caption')
const card = (page: import('@playwright/test').Page, name: string) => hood(page).getByRole('button', { name: new RegExp('^' + name) })
const back = (page: import('@playwright/test').Page) => hood(page).getByRole('button', { name: /^Back/ })
/** Under the hood, on its Technical choices screen. */
async function choices(page: import('@playwright/test').Page) {
  await desktopIcon(page, 'Under the hood').click()
  await card(page, 'Technical choices').click()
}

test('explains the technical choices, in both languages', async ({ page }) => {
  await choices(page)
  await expect(hood(page).getByRole('heading', { level: 4 })).toHaveCount(9)
  await expect(hood(page)).toContainText('55 themes, one set of components')
  await taskbar(page).getByRole('button', { name: /^EN/ }).click()
  await expect(appWindow(page, 'Sous le capot')).toContainText('55 thèmes, un seul jeu de composants')
})

test('"Show me" brings the window it is about to the front and highlights it; a click closes it', async ({ page }) => {
  await choices(page)
  await showMe(page, 'Windows, written by hand').click()
  await expect(appWindow(page, 'About me')).toHaveAttribute('data-active', 'true')
  await expect(caption(page)).toContainText('Windows, written by hand')
  const ring = (await page.locator('.ds-spotlight__ring').boundingBox())!
  const win = (await appWindow(page, 'About me').boundingBox())!
  expect(ring.x).toBeLessThan(win.x)
  expect(ring.x + ring.width).toBeGreaterThan(win.x + win.width)
  await page.mouse.click(5, 5)
  await expect(caption(page)).toHaveCount(0)
})

test('"Show me" on the start menu opens it', async ({ page }) => {
  await choices(page)
  await showMe(page, 'A start menu for the keyboard too').click()
  await expect(page.getByRole('navigation', { name: 'Start' })).toBeVisible()
  await expect(caption(page)).toBeVisible()
})

test('keyboard: Escape closes the highlight and gives focus back to the button', async ({ page }) => {
  await choices(page)
  const button = showMe(page, 'Two languages, checked by the compiler')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(caption(page)).toContainText('Two languages')
  await page.keyboard.press('Escape')
  await expect(caption(page)).toHaveCount(0)
  await expect(button).toBeFocused()
})

test('keyboard: Escape after showing another window brings Under the hood back', async ({ page }) => {
  await choices(page)
  const button = showMe(page, 'Readable on every theme')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(appWindow(page, 'About me')).toHaveAttribute('data-active', 'true')
  await page.keyboard.press('Escape')
  await expect(button).toBeFocused()
  await expect(hood(page)).toHaveAttribute('data-active', 'true')
})

test('home screen: one card per screen; Back comes home, and focus follows', async ({ page }) => {
  await desktopIcon(page, 'Under the hood').click()
  await expect(hood(page).getByRole('list').first().getByRole('button')).toHaveText([/Technical choices/, /Architecture/, /Tests/])
  await expect(back(page)).toHaveCount(0)
  await card(page, 'Architecture').click()
  await expect(hood(page).getByRole('heading', { level: 3 })).toHaveText('Architecture')
  await back(page).click()
  await expect(hood(page).getByRole('heading', { level: 3 })).toHaveText('Under the hood')
  await expect(hood(page).getByRole('heading', { level: 3 })).toBeFocused()
  await expect(back(page)).toHaveCount(0)
})

test('keyboard: a card opens with Enter, focus lands on the new title; Back with Enter', async ({ page }) => {
  await desktopIcon(page, 'Under the hood').click()
  await card(page, 'Tests').focus()
  await page.keyboard.press('Enter')
  await expect(hood(page).getByRole('heading', { level: 3, name: 'Tests' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(back(page)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(hood(page).getByRole('heading', { level: 3, name: 'Under the hood' })).toBeFocused()
})

// regression: when the file browser grew past the window, the whole window scrolled and Back went out of view
for (const os of ['95', 'vista'])
  test(`Back stays in view on long screens (${os})`, async ({ page }) => {
    await visit(page, { os })
    await desktopIcon(page, 'Under the hood').click()
    await card(page, 'Architecture').click()
    await hood(page).getByRole('button', { name: /^docs\/ ?The why/ }).click() // last in the sidebar
    await expect(back(page)).toBeInViewport()
    await back(page).click()
    await card(page, 'Technical choices').click()
    // scroll the window to its end, as the mouse wheel would
    const body = hood(page).locator('.ds-window__body')
    await body.evaluate((el) => el.scrollTo(0, el.scrollHeight))
    expect(await body.evaluate((el) => el.scrollTop)).toBeGreaterThan(100)
    const bar = (await back(page).boundingBox())!
    const win = (await body.boundingBox())!
    expect(bar.y).toBeGreaterThanOrEqual(win.y)
  })
