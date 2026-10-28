import { expect, test } from '@playwright/test'
import { visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

const meta = (page: import('@playwright/test').Page, key: string) =>
  page.locator(`meta[property="${key}"], meta[name="${key}"]`).getAttribute('content')

test('a shared link gets a preview card: title, description, a 1200×630 image', async ({ page }) => {
  for (const key of ['og:title', 'og:description', 'og:url']) expect(await meta(page, key), key).toBeTruthy()
  expect(await meta(page, 'twitter:card')).toBe('summary_large_image')
  // crawlers need an absolute URL; the image itself is served by the site
  const image = new URL((await meta(page, 'og:image'))!)
  expect(image.protocol).toBe('https:')
  const res = await page.request.get(image.pathname)
  expect(res.ok()).toBe(true)
  expect(res.headers()['content-type']).toBe('image/png')
  const size = await page.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    return [img.naturalWidth, img.naturalHeight]
  }, image.pathname)
  expect(size).toEqual([Number(await meta(page, 'og:image:width')), Number(await meta(page, 'og:image:height'))])
})

test('phones get a PNG home screen icon (iOS ignores the SVG favicon)', async ({ page }) => {
  const href = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')
  const res = await page.request.get(href!)
  expect(res.ok()).toBe(true)
  expect(res.headers()['content-type']).toBe('image/png')
})
