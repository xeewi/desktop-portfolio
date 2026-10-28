import { expect, test, type Page } from '@playwright/test'
import { WEB_APPS, a11yViolations, appWindow, desktopIcon, visit } from './helpers.ts'

// the real sites are stubbed: the test checks the window, not someone else's server
async function stubSites(page: Page) {
  for (const [name, url] of Object.entries(WEB_APPS))
    await page.route(url, (r) => r.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="en"><title>${name}</title><main aria-label="${name} site"><h1>${name} site</h1></main></html>` }))
}

for (const [name, url] of Object.entries(WEB_APPS))
  test(`${name} opens with the keyboard and shows the site`, async ({ page }) => {
    await stubSites(page)
    await visit(page)
    await desktopIcon(page, name).focus()
    await page.keyboard.press('Enter')
    const win = appWindow(page, name)
    await expect(win).toBeVisible()

    const frame = win.locator('iframe')
    await expect(frame).toHaveAttribute('src', url)
    await expect(frame).toHaveAttribute('title', name)
    await expect(page.frameLocator(`iframe[title="${name}"]`).getByRole('heading', { name: `${name} site` })).toBeVisible()
    expect((await frame.boundingBox())!.height).toBeGreaterThan(300)

    const out = win.getByRole('link', { name: /^Open in a new tab/ })
    await expect(out).toHaveAttribute('href', url)
    await expect(out).toHaveAttribute('target', '_blank')
    await out.focus()
    await expect(out).toBeFocused()

    expect(await a11yViolations(page)).toEqual([])
  })

test('Projects opens each site in its window, with the keyboard', async ({ page }) => {
  await stubSites(page)
  await visit(page)
  await desktopIcon(page, 'Projects & talks').click()
  const projects = appWindow(page, 'Projects & talks')
  for (const [project, name] of [['MixCoach', 'MixCoach'], ['noMigrationCost', 'Migration cost'], ['DirectChange', 'DirectChange']]) {
    const open = projects.getByRole('button', { name: `Open ${project}` })
    await open.focus()
    await page.keyboard.press('Enter')
    await expect(appWindow(page, name)).toHaveAttribute('data-active')
    await expect(appWindow(page, name).locator('iframe')).toBeVisible()
  }
  expect(await a11yViolations(page)).toEqual([])
})
