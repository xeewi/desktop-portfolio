import { expect, test, type Page } from '@playwright/test'
import { APPS, appWindow, desktopIcon, eachScreen, visit } from './helpers.ts'

const OSES = [
  { name: 'Windows 95', chrome: 'classic' },
  { name: 'Windows XP', chrome: 'xp' },
  { name: 'Windows Vista', chrome: 'vista' },
  { name: 'Windows 10', chrome: 'modern' },
  { name: 'Ubuntu', chrome: 'gnome' },
  { name: 'macOS', chrome: 'mac' },
]

const pickOs = async (page: Page, name: string) => {
  await desktopIcon(page, 'Change OS').click()
  await appWindow(page, 'Change OS').getByRole('button', { name: new RegExp(`^${name}`) }).click()
}

test('lists every OS with its year, the current one marked', async ({ page }) => {
  await visit(page)
  await desktopIcon(page, 'Change OS').click()
  const win = appWindow(page, 'Change OS')
  for (const os of OSES) await expect(win.getByRole('button', { name: new RegExp(`^${os.name}`) })).toContainText(/\d{4}/)
  await expect(win.getByRole('button', { name: /^Windows Vista/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(win.getByRole('button', { name: /Windows 98/ })).toHaveCount(0)
})

for (const os of OSES) {
  test(`switching to ${os.name} changes the chrome and is remembered`, async ({ page }) => {
    await visit(page, { os: os.chrome === 'vista' ? 'xp' : 'vista' })
    await pickOs(page, os.name)
    await expect(page.locator('html')).toHaveAttribute('data-chrome', os.chrome)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-chrome', os.chrome)
    await desktopIcon(page, 'Personalize').click()
    await expect(appWindow(page, 'Personalize').getByRole('heading', { name: `Visual styles · ${os.name}` })).toBeVisible()
  })
}

test('each OS has its own icons, and they load', async ({ page }) => {
  await visit(page)
  const seen = new Set<string>()
  for (const os of OSES) {
    await pickOs(page, os.name)
    await expect(page.locator('html')).toHaveAttribute('data-chrome', os.chrome)
    const urls = await page.locator('nav .ds-icon').evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundImage))
    expect(urls).toHaveLength(APPS.length + 1) // every app + CV.pdf
    for (const u of urls) {
      const src = u.match(/^url\("(.+)"\)$/)?.[1]
      expect(src, 'icon has an image').toBeTruthy()
      // small icons are inlined by Vite as data: URIs, the others must be served
      if (!src!.startsWith('data:')) expect((await page.request.get(src!)).ok(), src).toBe(true)
    }
    const userIcon = urls[0]
    expect(seen.has(userIcon), `${os.name} reuses another OS icon`).toBe(false)
    seen.add(userIcon)
  }
})

// regression: apps drew emoji (💡, 📁, ✉️…) that look the same on every OS, instead of the OS's own icons
test('apps use the OS icons, never emoji', async ({ page }) => {
  await visit(page)
  for (const app of APPS) {
    await desktopIcon(page, app).click()
    const win = appWindow(page, app)
    await eachScreen(page, app, async (screen) => {
      expect(await win.innerText(), screen).not.toMatch(/\p{Emoji_Presentation}|️/u)
      const images = await win.locator('.ds-icon').evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundImage))
      for (const img of images) expect(img, screen).toMatch(/^url\(/)
    })
    await win.getByRole('button', { name: 'Close' }).click()
  }
})

// regression: on macOS the icon columns filled from the left, leaving the rightmost one half empty
test('macOS fills the rightmost icon column first', async ({ page }) => {
  await visit(page, { os: 'mac' })
  const first = (await desktopIcon(page, 'About me').boundingBox())!
  const last = (await page.getByRole('link', { name: 'CV.pdf' }).boundingBox())!
  expect(first.x).toBeGreaterThan(last.x)
  expect(first.x + first.width).toBeGreaterThan(1280 - 40)
})
