import { expect, test } from '@playwright/test'

// a first visit (nothing saved): the site opens on the OS the visitor is not using
const VISITORS = [
  { from: 'Windows', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36', chrome: 'mac' },
  { from: 'macOS', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', chrome: 'xp' },
  { from: 'Linux', ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0', chrome: 'xp' },
  { from: 'an iPhone', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148', chrome: 'xp' },
]

for (const v of VISITORS)
  test.describe(() => {
    test.use({ userAgent: v.ua })
    test(`a visitor on ${v.from} lands on ${v.chrome}`, async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('data-chrome', v.chrome)
    })
  })

test('a chosen OS still wins over the default', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('os', '95'))
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-chrome', 'classic')
})
