import { expect, test, type Page } from '@playwright/test'
import { a11yViolations, visit } from './helpers.ts'

const open = async (page: Page, lang = 'en') => {
  await page.addInitScript((lang) => localStorage.setItem('lang', lang), lang)
  await page.goto('/classic')
  await page.getByRole('heading', { level: 1 }).waitFor()
}

test('the classic page gives the essentials and a way to write', async ({ page }) => {
  await open(page)
  await expect(page.getByRole('heading', { level: 1, name: 'Guillaume Gautier' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Email me about a mission' })).toHaveCount(2) // the hero and the contact
  await expect(page.getByRole('link', { name: 'Email me about a mission' }).first()).toHaveAttribute('href', 'mailto:gg-xeewi@pm.me')
  await expect(page.getByRole('link', { name: 'Resume (PDF)' }).first()).toHaveAttribute('href', '/cv.pdf')
  await expect(page.locator('.ds-desktop, [role="contentinfo"] button')).toHaveCount(0) // none of the desktop
})

test('the clients lead to their missions', async ({ page }) => {
  await open(page)
  const clients = page.getByRole('region', { name: 'Companies I worked with' })
  await clients.getByRole('link', { name: 'Lola Health' }).click()
  await expect(page).toHaveURL(/#xp-lola-health$/)
  await expect(page.locator('#xp-lola-health').getByRole('heading', { name: 'Lola Health' })).toBeInViewport()
  // a service names where it happened, and links there
  await page.getByRole('region', { name: 'What I’m brought in for' }).getByRole('link', { name: 'Seaver' }).click()
  await expect(page.locator('#xp-seaver').getByRole('heading', { name: 'Seaver' })).toBeInViewport()
})

test('the presenter view follows the slide being read', async ({ page }) => {
  await open(page)
  const presenter = page.getByRole('complementary', { name: 'Presenter view' })
  await expect(presenter).toContainText('01 / 08')
  await page.locator('#xp-seaver').evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect(presenter).toContainText('04 / 08')
  await expect(presenter).toContainText('Seaver')
  await page.locator('#contact').evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect(presenter).toContainText('08 / 08')
})

test('the desktop, on the home page, offers the classic version from About me', async ({ page }) => {
  await visit(page)
  const link = page.getByRole('link', { name: 'See the classic version' })
  await expect(link).toHaveAttribute('href', '/classic')
  await expect(link).not.toHaveAttribute('target', '_blank') // same tab: it is this site
  await link.click()
  await expect(page).toHaveURL(/\/classic$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Guillaume Gautier' })).toBeVisible()
})

test('the page switches to French and leads to the desktop', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: /^EN\b.*Passer en français/ }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.getByRole('link', { name: 'Me proposer une mission' }).first()).toBeVisible()
  await page.getByRole('link', { name: 'Lancer le mode bureau' }).click()
  await expect(page).toHaveURL(/:\d+\/$/) // the desktop is the home page
  await expect(page.getByRole('contentinfo')).toBeVisible() // the taskbar
})

for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }])
  for (const lang of ['en', 'fr'])
    test(`no WCAG 2.2 AA violation, ${viewport.width}px, ${lang}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await open(page, lang)
      expect(await a11yViolations(page)).toEqual([])
    })
