import { expect, test } from '@playwright/test'
import { appWindow, desktopIcon, task, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

test('About me: buttons open the career, projects and contact windows', async ({ page }) => {
  await appWindow(page, 'About me').getByRole('button', { name: 'See my career' }).click()
  await expect(appWindow(page, 'Experience')).toHaveAttribute('data-active', 'true')
  // Experience now covers About: bring About back from the taskbar first, like a visitor would
  await task(page, 'About me').click()
  // keyboard path for projects
  await appWindow(page, 'About me').getByRole('button', { name: 'See my projects' }).focus()
  await page.keyboard.press('Enter')
  await expect(appWindow(page, 'Projects & talks')).toHaveAttribute('data-active', 'true')
  await task(page, 'About me').click()
  await appWindow(page, 'About me').getByRole('button', { name: 'Contact me' }).click()
  await expect(appWindow(page, 'Contact')).toHaveAttribute('data-active', 'true')
})

test('Experience: every company in one scroll, the list follows', async ({ page }) => {
  await desktopIcon(page, 'Experience').click()
  const win = appWindow(page, 'Experience')
  const item = (name: string) => win.getByRole('link', { name: new RegExp('^' + name + ' \\d') })
  await expect(win.getByRole('heading', { level: 3 })).toHaveCount(7)
  await expect(item('Believe')).toHaveAttribute('aria-current', 'location')
  // scrolling down to Seaver: the list and the address bar follow
  await win.locator('#xp-5').evaluate((el) => {
    // as the mouse wheel would: scroll the content panel only
    const box = el.closest('article')!
    box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top
  })
  await expect(item('Seaver')).toHaveAttribute('aria-current', 'location')
  await expect(item('Believe')).not.toHaveAttribute('aria-current')
  await expect(win).toContainText('Career ▸ Seaver')
  // keyboard: Enter on a company jumps to it and moves focus to its title
  await item('Sunday').focus()
  await page.keyboard.press('Enter')
  await expect(win.getByRole('heading', { level: 3, name: 'Sunday' })).toBeFocused()
  await expect(win.getByRole('heading', { level: 3, name: 'Sunday' })).toBeInViewport()
  await expect(item('Sunday')).toHaveAttribute('aria-current', 'location')
  // regression: jumping to a company scrolled the whole desktop, and the title bar went off screen
  await item('Deskover').click()
  await expect(win.getByRole('heading', { level: 3, name: 'Deskover' })).toBeInViewport()
  await expect(win.getByRole('button', { name: 'Close' })).toBeInViewport()
  await expect(item('Believe')).toBeInViewport()
})

test('Experience: logos, websites and screenshots', async ({ page, context }) => {
  await desktopIcon(page, 'Experience').click()
  const win = appWindow(page, 'Experience')
  await win.getByRole('link', { name: /^Lola Health \d/ }).click()
  const site = win.getByRole('link', { name: /^lolahealth\.fr/ })
  await expect(site).toHaveAttribute('href', 'https://lolahealth.fr')
  await expect(site).toHaveAttribute('target', '_blank')
  const shots = win.getByRole('link', { name: /^Lola Health app/ })
  await expect(shots).toHaveCount(3)
  // a screenshot opens full size in a new tab
  const [tab] = await Promise.all([context.waitForEvent('page'), shots.first().click()])
  expect(tab.url()).toMatch(/\/xp\/lola-health-1\.jpg$/)
  // every logo and screenshot exists (they load lazily, so ask the server)
  for (const src of await win.locator('img').evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src)))
    expect((await page.request.get(src)).ok(), src).toBe(true)
})

test('Skills and Projects show their sections', async ({ page }) => {
  await desktopIcon(page, 'Skills').click()
  await expect(appWindow(page, 'Skills')).toContainText('Front-end')
  await desktopIcon(page, 'Projects & talks').click()
  await expect(appWindow(page, 'Projects & talks')).toContainText('Training & talks given')
})

test('Contact links and the resume', async ({ page }) => {
  await desktopIcon(page, 'Contact').click()
  const win = appWindow(page, 'Contact')
  await expect(win.getByRole('link', { name: /@/ })).toHaveAttribute('href', /^mailto:/)
  await expect(win.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /linkedin\.com/)
  await expect(win.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', /github\.com/)
  await expect(page.getByRole('link', { name: 'CV.pdf' })).toHaveAttribute('href', '/cv.pdf')
  expect((await page.request.get('/cv.pdf')).ok()).toBe(true)
})
