import { expect, test, type Locator } from '@playwright/test'
import { appWindow, desktopIcon, task, taskbar, visit } from './helpers.ts'

// Each OS animates windows, the start menu and the taskbar its own way (tokens in chromes/*.css).
test.use({ reducedMotion: 'no-preference' })

const OSES = [
  { os: '95', min: 'win-caption-min', restore: 'win-caption-unmin', max: 'win-caption-max', close: 'none', menu: 'none', launch: 'none' },
  { os: 'xp', min: 'win-caption-min', restore: 'win-caption-unmin', max: 'win-caption-max', close: 'none', menu: 'sm-scroll', launch: 'none' },
  { os: 'vista', min: 'win-min', restore: 'win-unmin', max: 'none', close: 'win-close', menu: 'sm-fade', launch: 'task-fade' },
  { os: '10', min: 'win-min', restore: 'win-unmin', max: 'none', close: 'win-close', menu: 'sm-rise', launch: 'task-rise' },
  { os: 'ubuntu', min: 'win-min', restore: 'win-unmin', max: 'none', close: 'win-close', menu: 'sm-drop', launch: 'task-pulse' },
  { os: 'mac', min: 'win-genie-min', restore: 'win-genie-unmin', max: 'none', close: 'win-close', menu: 'none', launch: 'task-bounce' },
]

const animationName = (el: Locator) => el.evaluate((e) => getComputedStyle(e).animationName)
/** the animations running right now (they last 150–500 ms) */
const running = (el: Locator) => el.evaluate((e) => e.getAnimations().map((a) => (a as CSSAnimation).animationName))

for (const o of OSES) {
  test(`${o.os}: windows minimise, restore, maximise and close the way this OS does`, async ({ page }) => {
    await visit(page, { os: o.os })
    await page.locator('.ds-boot').click()
    await desktopIcon(page, 'Experience').click() // a second window, for focus to land in once About me closes
    await task(page, 'About me').click()
    const win = appWindow(page, 'About me')
    const frame = page.locator('#win-about') // stays reachable while minimised (out of the accessibility tree)

    await win.getByRole('button', { name: 'Minimize' }).click()
    expect(await running(frame)).toEqual([o.min])
    await expect(win).toBeHidden()

    await task(page, 'About me').click()
    await expect(win).toBeVisible()
    expect(await animationName(frame)).toBe(o.restore)

    await win.getByRole('button', { name: 'Maximize' }).click()
    expect(await animationName(frame)).toBe(o.max)
    await expect.poll(async () => (await win.boundingBox())!.width).toBeGreaterThan(1200)

    // keyboard: Enter on Close plays the closing animation, then focus lands in the next window
    const close = win.getByRole('button', { name: 'Close' })
    await close.focus()
    expect(await frame.evaluate((e) => getComputedStyle(e).getPropertyValue('--win-close-animation'))).toContain(o.close)
    await page.keyboard.press('Enter')
    await expect(frame).toHaveCount(0)
    await expect(appWindow(page, 'Experience').locator('.ds-window__body')).toBeFocused()
  })

  test(`${o.os}: start menu and app launch animations`, async ({ page }) => {
    await visit(page, { os: o.os })
    await page.locator('.ds-boot').click()
    await taskbar(page).getByRole('button', { name: /^(Start|Activities)$/ }).click()
    expect(await animationName(page.locator('#ds-startmenu'))).toBe(o.menu)
    await page.keyboard.press('Escape')

    await desktopIcon(page, 'Experience').click()
    expect(await animationName(task(page, 'Experience').locator('.ds-task__icon'))).toBe(o.launch)
  })
}

test('reduced motion: minimising and closing are instant', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await visit(page, { os: 'mac' })
  const win = appWindow(page, 'About me')
  await win.getByRole('button', { name: 'Minimize' }).click()
  await expect(win).toBeHidden({ timeout: 100 })
  await task(page, 'About me').click()
  await win.getByRole('button', { name: 'Close' }).click()
  await expect(win).toHaveCount(0, { timeout: 100 })
})

// regression: on XP the start menu slides up from below the screen, and moving focus into it scrolled the whole
// desktop up while it slid (the screen jumped)
for (const o of OSES)
  test(`${o.os}: opening the start menu never moves the desktop`, async ({ page }) => {
    await visit(page, { os: o.os })
    await page.locator('.ds-boot').click()
    const desktop = page.locator('.ds-desktop')
    await taskbar(page).getByRole('button', { name: /^(Start|Activities)$/ }).click()
    for (let i = 0; i < 5; i++) {
      expect(await desktop.evaluate((d) => d.scrollTop)).toBe(0)
      await page.waitForTimeout(30)
    }
  })
