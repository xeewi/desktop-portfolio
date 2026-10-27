import { expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/** Opens the site on a given OS / language, as a returning visitor would (localStorage).
 *  Seeds only once per tab, so reload() keeps whatever the test changed. */
export async function visit(page: Page, { os = 'vista', lang = 'en' }: { os?: string; lang?: string } = {}) {
  await page.addInitScript(
    ([os, lang]) => {
      if (sessionStorage.getItem('seeded')) return
      localStorage.setItem('os', os)
      localStorage.setItem('lang', lang)
      sessionStorage.setItem('seeded', '1')
    },
    [os, lang],
  )
  await page.goto('/')
}

/** App titles in English, in desktop order. */
export const APPS = ['About me', 'Experience', 'Skills', 'Projects & talks', 'Contact', 'Personalize', 'Change OS', 'Under the hood', 'Guided tour'] as const

/** Runs `check` on every screen of an open app: Under the hood has a home screen, three screens behind it,
 *  and a file open in Architecture. Ends back on its home screen. */
export async function eachScreen(page: Page, app: string, check: (screen: string) => Promise<void>) {
  await check(app)
  if (app !== 'Under the hood') return
  const win = appWindow(page, app)
  for (const screen of ['Technical choices', 'Architecture', 'Tests']) {
    await win.getByRole('button', { name: new RegExp('^' + screen) }).click()
    await check(`${app} / ${screen}`)
    if (screen === 'Architecture') {
      await win.getByRole('button', { name: /^src\/App\.tsx/ }).click()
      await expect(win.locator('pre')).toBeVisible()
      await check(`${app} / ${screen} / a file`)
    }
    await win.getByRole('button', { name: /^Back/ }).click() // back to the home screen
  }
}

export const desktopIcon = (page: Page, name: string) => page.getByRole('navigation', { name: /^(Desktop|Bureau)$/ }).getByRole('button', { name, exact: true })
export const appWindow = (page: Page, name: string) => page.getByRole('region', { name, exact: true })
export const taskbar = (page: Page) => page.getByRole('contentinfo')
export const task = (page: Page, name: string) => taskbar(page).getByRole('button', { name, exact: true })

/** Drags with the mouse from (x, y) by (dx, dy). */
export async function dragBy(page: Page, x: number, y: number, dx: number, dy: number) {
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 5 })
  await page.mouse.up()
}

export async function box(page: Page, name: string) {
  const b = await appWindow(page, name).boundingBox()
  expect(b).not.toBeNull()
  return b!
}

/** WCAG 2.2 A + AA (and axe best practices) violations on the page, as readable strings.
 *  The wallpaper is left out: its signature is part of the picture (decoration, WCAG 1.4.3 exception)
 *  and repeats what the About window says. */
export async function a11yViolations(page: Page) {
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .exclude('.ds-wallpaper')
    .analyze()
  return r.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} (${n.failureSummary?.split('\n')[1]?.trim()})`))
}

/** How well a control stands out from what's around it, measured on screen pixels: for each side
 *  (top, right, bottom, left), the WCAG contrast between the control's edge (1px inside) and the
 *  background just outside (4px out), median along the middle of the side. Desktop (1 css px = 1 px). */
export async function edgeContrast(page: Page, el: import('@playwright/test').Locator): Promise<number[]> {
  const r = (await el.boundingBox())!
  const png = (await page.screenshot()).toString('base64')
  return page.evaluate(
    async ({ png, r }) => {
      const img = new Image()
      img.src = 'data:image/png;base64,' + png
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.width
      c.height = img.height
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const lum = (x: number, y: number) => {
        const [R, G, B] = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data
        const f = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        return 0.2126 * f(R) + 0.7152 * f(G) + 0.0722 * f(B)
      }
      const median = (a: number[]) => a.sort((p, q) => p - q)[a.length >> 1]
      const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      // along the middle 60% of a side: the outside (4px out) vs the edge, which is the strongest of
      // the 3 rows/columns just inside (a 1px border, a bevel, or the fill when there is no border)
      const side = (n: number, at: (t: number, inset: number) => [number, number]) => {
        const out = median([...Array(n + 1)].map((_, i) => lum(...at(0.2 + (0.6 * i) / n, -4))))
        return Math.max(...[0, 1, 2].map((d) => ratio(median([...Array(n + 1)].map((_, i) => lum(...at(0.2 + (0.6 * i) / n, d)))), out)))
      }
      const { x, y, width: w, height: h } = r
      return [
        side(12, (t, d) => [x + w * t, y + d]),
        side(6, (t, d) => [x + w - 1 - d, y + h * t]),
        side(12, (t, d) => [x + w * t, y + h - 1 - d]),
        side(6, (t, d) => [x + d, y + h * t]),
      ]
    },
    { png, r },
  )
}
