import { expect, test } from '@playwright/test'
import { APPS, a11yViolations, eachScreen, appWindow, desktopIcon, dragBy, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

test('starts on the home screen: icon grid, no window', async ({ page }) => {
  for (const name of APPS) await expect(desktopIcon(page, name)).toBeVisible()
  await expect(page.getByRole('region')).toHaveCount(0)
})

test('apps open full-screen, cannot be moved or resized', async ({ page }) => {
  await desktopIcon(page, 'Skills').click()
  const win = appWindow(page, 'Skills')
  await expect(win).toBeVisible()
  await expect(win.locator('.ds-window__edge')).toHaveCount(0)
  await expect(win.getByRole('button', { name: 'Maximize' })).toBeHidden()
  const before = (await win.boundingBox())!
  expect(before.width).toBeGreaterThan(page.viewportSize()!.width - 20)
  await dragBy(page, before.x + 100, before.y + 20, 60, 60)
  expect(await win.boundingBox()).toEqual(before)
  await win.getByRole('button', { name: 'Close' }).click()
  await expect(win).toHaveCount(0)
})

test('no signature on the wallpaper: the business card already says who this is', async ({ page }) => {
  await expect(page.getByTestId('wallpaper-signature')).toBeHidden()
})

// touch layout: full-screen windows, bigger targets. Each OS's default theme, every app.
for (const os of ['95', 'xp', 'vista', '10', 'ubuntu', 'mac'])
  test(`axe: home screen and every app on ${os}`, async ({ page }) => {
    await visit(page, { os })
    expect(await a11yViolations(page), 'home').toEqual([])
    for (const app of APPS) {
      await desktopIcon(page, app).click()
      await eachScreen(page, app, async (screen) => expect(await a11yViolations(page), screen).toEqual([]))
      await appWindow(page, app).getByRole('button', { name: 'Close' }).click()
    }
  })

test('Under the hood: "Show me" highlights a full-screen window', async ({ page }) => {
  await desktopIcon(page, 'Under the hood').click()
  await appWindow(page, 'Under the hood').getByRole('button', { name: /^Technical choices/ }).click()
  await appWindow(page, 'Under the hood').getByRole('button', { name: 'Show me – Windows, written by hand' }).click()
  await expect(appWindow(page, 'About me')).toBeVisible()
  await expect(page.locator('.ds-spotlight__caption')).toBeInViewport()
})

test('Experience: the company strip follows the scroll and jumps to a company', async ({ page }) => {
  await desktopIcon(page, 'Experience').click()
  const win = appWindow(page, 'Experience')
  const tab = (name: string) => win.getByRole('link', { name: new RegExp('^' + name + '( \\d|$)') })
  await tab('Deskover').click() // the strip scrolls sideways to show it
  await expect(win.getByRole('heading', { level: 3, name: 'Deskover' })).toBeInViewport()
  await expect(tab('Deskover')).toHaveAttribute('aria-current', 'location')
  await expect(tab('Deskover')).toBeInViewport()
  // regression: jumping to a company scrolled the whole screen, and the title bar went off screen
  await expect(win.getByRole('button', { name: 'Close' })).toBeInViewport()
  await win.locator('#xp-0').evaluate((el) => {
    // as the mouse wheel would: scroll the content panel only
    const box = el.closest('article')!
    box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top
  })
  await expect(tab('Believe')).toHaveAttribute('aria-current', 'location')
  await expect(tab('Believe')).toBeInViewport()
})

// regression: the business card sat at a fixed height and covered the last row of icons once the grid had 4 rows
for (const [width, height] of [[375, 667], [412, 915]])
  test(`the business card stays under the icons at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    const icons = await page.getByRole('navigation', { name: 'Desktop' }).locator('.ds-desk-icon').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().bottom))
    const card = (await page.locator('.ds-gadgets').boundingBox())!
    expect(card.y).toBeGreaterThanOrEqual(Math.max(...icons))
    for (const name of ['CV.pdf', 'Guided tour']) await page.getByRole('navigation', { name: 'Desktop' }).getByRole(name === 'CV.pdf' ? 'link' : 'button', { name }).click({ trial: true })
  })

// regression: the macOS / Ubuntu dock was wider than the phone and ran off both sides
for (const os of ['mac', 'ubuntu'])
  test(`the ${os} dock fits a small phone, its buttons still 24px wide`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.evaluate((os) => localStorage.setItem('os', os), os) // the file's beforeEach already opened the site
    await page.reload()
    const dock = (await page.locator('.ds-tasklist').boundingBox())!
    expect(dock.x).toBeGreaterThanOrEqual(0)
    expect(dock.x + dock.width).toBeLessThanOrEqual(320)
    for (const b of await page.locator('.ds-tasklist .ds-task').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width))) expect(b).toBeGreaterThanOrEqual(24)
  })
