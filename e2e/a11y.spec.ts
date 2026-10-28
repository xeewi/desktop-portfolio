import { expect, test } from '@playwright/test'
import { APPS, a11yViolations, eachScreen, appWindow, desktopIcon, edgeContrast, taskbar, visit } from './helpers.ts'

const OSES = ['95', 'xp', 'vista', '10', 'ubuntu', 'mac']

// Every theme of every OS (new ones included: they're read from Personalize), every app:
// no WCAG 2.2 AA violation axe can see.
for (const os of OSES)
  test(`axe: every theme and app on ${os}`, async ({ page }) => {
    test.setTimeout(300_000) // up to a dozen themes × 7 apps
    await visit(page, { os })
    const personalize = appWindow(page, 'Personalize')
    const cards = personalize.locator('.ds-themecard')
    await appWindow(page, 'About me').getByRole('button', { name: 'Close' }).click()
    await desktopIcon(page, 'Personalize').click()
    const count = await cards.count()
    await personalize.getByRole('button', { name: 'Close' }).click()
    for (let i = 0; i < count; i++) {
      await desktopIcon(page, 'Personalize').click()
      await cards.nth(i).click()
      const theme = await cards.nth(i).locator('b').textContent()
      await personalize.getByRole('button', { name: 'Close' }).click()
      for (const app of APPS) {
        await desktopIcon(page, app).click()
        await eachScreen(page, app, async (screen) => expect(await a11yViolations(page), `${theme} / ${screen}`).toEqual([]))
        await appWindow(page, app).getByRole('button', { name: 'Close' }).click()
      }
    }
  })

// regression: the title of a window in the background was dimmed below 4.5:1 on Windows 10, Ubuntu and macOS
for (const os of OSES)
  test(`axe: a window in the background on ${os}`, async ({ page }) => {
    await visit(page, { os })
    await desktopIcon(page, 'Experience').click()
    await expect(appWindow(page, 'About me')).not.toHaveAttribute('data-active')
    expect(await a11yViolations(page)).toEqual([])
  })

// axe checks text, not the outline of controls (WCAG 1.4.11, 3:1). Measured on screen instead, every theme:
// a button must stand out from the window on at least 2 sides (a Windows 95 bevel only shows on 2).
// regression: secondary buttons were invisible on macOS Dark Mode, and barely visible on 10, Ubuntu, Vista
for (const os of OSES)
  test(`buttons and the selection stand out on every theme of ${os}`, async ({ page }) => {
    test.setTimeout(120_000)
    await visit(page, { os })
    const about = appWindow(page, 'About me')
    const personalize = appWindow(page, 'Personalize')
    const experience = appWindow(page, 'Experience')
    const cards = personalize.locator('.ds-themecard')
    await about.getByRole('button', { name: 'Close' }).click()
    await desktopIcon(page, 'Personalize').click()
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      await cards.nth(i).click()
      const theme = await cards.nth(i).locator('b').textContent()
      await personalize.getByRole('button', { name: 'Close' }).click()
      await desktopIcon(page, 'About me').click()
      for (const name of ['See my career', 'Contact me']) {
        const sides = await edgeContrast(page, about.getByRole('button', { name }))
        expect(sides.filter((c) => c >= 3).length, `${theme} / ${name}: ${sides.map((c) => c.toFixed(1))}`).toBeGreaterThanOrEqual(2)
      }
      await about.getByRole('button', { name: 'Close' }).click()
      // the selected company in Experience: a bar on one side is enough (Windows 10)
      // regression: the selection was a pale tint on Ubuntu, XP and Vista
      await desktopIcon(page, 'Experience').click()
      await page.mouse.move(0, 0) // no hover
      const sides = await edgeContrast(page, experience.locator('[aria-current="location"]'))
      expect(sides.filter((c) => c >= 3).length, `${theme} / selected company: ${sides.map((c) => c.toFixed(1))}`).toBeGreaterThanOrEqual(1)
      await experience.getByRole('button', { name: 'Close' }).click()
      // the cards on Under the hood's home screen are buttons too: their outline must show
      await desktopIcon(page, 'Under the hood').click()
      await page.mouse.move(0, 0)
      const card = await edgeContrast(page, appWindow(page, 'Under the hood').getByRole('button', { name: /^Architecture/ }))
      expect(card.filter((c) => c >= 3).length, `${theme} / home card: ${card.map((c) => c.toFixed(1))}`).toBeGreaterThanOrEqual(2)
      await appWindow(page, 'Under the hood').getByRole('button', { name: 'Close' }).click()
      await desktopIcon(page, 'Personalize').click()
    }
  })

test('axe: French, start menu open', async ({ page }) => {
  await visit(page, { lang: 'fr' })
  await taskbar(page).getByRole('button', { name: 'Démarrer' }).click()
  expect(await a11yViolations(page)).toEqual([])
})

test('the page has one h1, each window title is an h2', async ({ page }) => {
  await visit(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveText(/Guillaume Gautier/)
  await expect(appWindow(page, 'About me').getByRole('heading', { level: 2 })).toHaveText('About me')
})

test('keyboard: everything Tab reaches shows a focus ring', async ({ page }) => {
  await visit(page)
  const seen = new Set<string>()
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab')
    const f = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      if (el === document.body) return null // went past the last element
      const s = getComputedStyle(el)
      return { name: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 30) ?? el.tagName, ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 1 }
    })
    if (!f || seen.has(f.name)) break
    seen.add(f.name)
    expect(f.ring, f.name).toBe(true)
  }
  expect(seen.size).toBeGreaterThan(10)
})

test('keyboard: opening an app moves focus into its window, so it can be read and scrolled', async ({ page }) => {
  await visit(page)
  await page.setViewportSize({ width: 1280, height: 600 }) // so the window has to scroll
  await desktopIcon(page, 'Projects & talks').focus()
  await page.keyboard.press('Enter')
  const body = appWindow(page, 'Projects & talks').locator('.ds-window__body')
  await expect(body).toBeFocused()
  await page.keyboard.press('PageDown')
  await expect.poll(() => body.evaluate((e) => e.scrollTop)).toBeGreaterThan(0)
})

test('keyboard: closing a window hands focus to the next one', async ({ page }) => {
  await visit(page)
  await desktopIcon(page, 'Skills').click()
  await appWindow(page, 'Skills').getByRole('button', { name: 'Close' }).press('Enter')
  await expect(appWindow(page, 'About me').locator('.ds-window__body')).toBeFocused()
})

test('keyboard: tabbing into a window behind brings it to the front', async ({ page }) => {
  await visit(page)
  await desktopIcon(page, 'Contact').click()
  await expect(appWindow(page, 'About me')).not.toHaveAttribute('data-active')
  await appWindow(page, 'About me').getByRole('button', { name: 'Contact me' }).focus()
  await expect(appWindow(page, 'About me')).toHaveAttribute('data-active', 'true')
})

test('keyboard: the start menu takes focus, Escape closes it and gives focus back', async ({ page }) => {
  await visit(page)
  const start = taskbar(page).getByRole('button', { name: 'Start' })
  await start.focus()
  await page.keyboard.press('Enter')
  const menu = page.getByRole('navigation', { name: 'Start' })
  await expect(menu.getByRole('button').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await expect(start).toBeFocused()
})

// regression: the invisible resize corner covered the top-right of the close button
test('the whole close button closes the window, corners included', async ({ page }) => {
  await visit(page)
  const close = appWindow(page, 'About me').getByRole('button', { name: 'Close' })
  const b = (await close.boundingBox())!
  await page.mouse.click(b.x + b.width - 1, b.y + 1)
  await expect(appWindow(page, 'About me')).toHaveCount(0)
})
