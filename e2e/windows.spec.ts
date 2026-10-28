import { expect, test } from '@playwright/test'
import { APPS, appWindow, box, desktopIcon, dragBy, task, visit } from './helpers.ts'

test.beforeEach(({ page }) => visit(page))

test('opens only "About me" on start, in front', async ({ page }) => {
  await expect(appWindow(page, 'About me')).toHaveAttribute('data-active', 'true')
  await expect(page.getByRole('region')).toHaveCount(1)
})

test('every desktop icon opens its window, in front, with a taskbar button', async ({ page }) => {
  for (const name of APPS) {
    await desktopIcon(page, name).click()
    const win = appWindow(page, name)
    await expect(win).toBeVisible()
    await expect(win).toHaveAttribute('data-active', 'true')
    await expect(task(page, name)).toHaveAttribute('data-active', 'true')
  }
})

// regression: a tall window opening low (Under the hood) ran past the bottom of the screen, and the desktop
// scrolled to show it, making the whole screen jump
for (const os of ['vista', 'mac'])
  test(`every window opens fully above the taskbar (${os})`, async ({ page }) => {
    await visit(page, { os })
    const bottom = (await page.getByRole('contentinfo').boundingBox())!
    for (const name of APPS) {
      await desktopIcon(page, name).click()
      const win = await box(page, name)
      // macOS: the dock floats over the desktop, the window only has to stay on screen
      expect(win.y + win.height, name).toBeLessThanOrEqual(os === 'mac' ? page.viewportSize()!.height : bottom.y)
      await appWindow(page, name).getByRole('button', { name: 'Close' }).click()
    }
    expect(await page.locator('.ds-desktop').evaluate((d) => d.scrollTop)).toBe(0)
  })

test('clicking a window behind brings it to the front', async ({ page }) => {
  await desktopIcon(page, 'Skills').click()
  await expect(appWindow(page, 'About me')).not.toHaveAttribute('data-active')
  await appWindow(page, 'About me').getByRole('heading').first().click()
  await expect(appWindow(page, 'About me')).toHaveAttribute('data-active', 'true')
})

test('minimise, restore from the taskbar, minimise again from the taskbar', async ({ page }) => {
  const win = appWindow(page, 'About me')
  await win.getByRole('button', { name: 'Minimize' }).click()
  await expect(win).toBeHidden()
  await task(page, 'About me').click()
  await expect(win).toBeVisible()
  await task(page, 'About me').click()
  await expect(win).toBeHidden()
})

test('maximise with the button and by double-clicking the title bar', async ({ page }) => {
  const win = appWindow(page, 'About me')
  await win.getByRole('button', { name: 'Maximize' }).click()
  expect((await box(page, 'About me')).width).toBe(1280)
  await win.locator('.ds-window__titlebar').dblclick()
  expect((await box(page, 'About me')).width).toBe(680)
})

test('close removes the window', async ({ page }) => {
  await appWindow(page, 'About me').getByRole('button', { name: 'Close' }).click()
  await expect(appWindow(page, 'About me')).toHaveCount(0)
  await expect(page.getByRole('region')).toHaveCount(0)
})

test('dragging the title bar moves the window on both axes', async ({ page }) => {
  const before = await box(page, 'About me')
  await dragBy(page, before.x + 200, before.y + 12, 150, 80)
  const after = await box(page, 'About me')
  expect(after.x - before.x).toBe(150)
  expect(after.y - before.y).toBe(80)
})

test.describe('resize (desktop)', () => {
  test('from the bottom-right corner', async ({ page }) => {
    const b = await box(page, 'About me')
    await dragBy(page, b.x + b.width - 4, b.y + b.height - 4, 100, -150)
    const a = await box(page, 'About me')
    expect([a.x, a.y, a.width, Math.round(a.height)]).toEqual([b.x, b.y, b.width + 100, Math.round(b.height) - 150])
  })

  test('from the left edge: the right edge stays put', async ({ page }) => {
    const b = await box(page, 'About me')
    await dragBy(page, b.x + 2, b.y + 100, -60, 0)
    const a = await box(page, 'About me')
    expect(a.x).toBe(b.x - 60)
    expect(a.x + a.width).toBe(b.x + b.width)
  })

  test('never below 300 × 180', async ({ page }) => {
    const b = await box(page, 'About me')
    await dragBy(page, b.x + b.width - 4, b.y + b.height - 4, -1000, -1000)
    const a = await box(page, 'About me')
    expect([a.width, a.height]).toEqual([300, 180])
  })

  // regression: after a resize the window could only move vertically
  test('a resized window still moves horizontally', async ({ page }) => {
    const b = await box(page, 'About me')
    await dragBy(page, b.x + b.width - 4, b.y + b.height - 4, 120, -100)
    const r = await box(page, 'About me')
    await dragBy(page, r.x + 150, r.y + 12, 200, 50)
    const a = await box(page, 'About me')
    expect([a.x - r.x, a.y - r.y]).toEqual([200, 50])
  })

  test('no resize edges while maximised, size kept after restore', async ({ page }) => {
    const win = appWindow(page, 'About me')
    const b = await box(page, 'About me')
    await dragBy(page, b.x + b.width - 4, b.y + b.height - 4, 80, -80)
    const resized = await box(page, 'About me')
    await win.getByRole('button', { name: 'Maximize' }).click()
    await expect(win.locator('.ds-window__edge')).toHaveCount(0)
    await win.getByRole('button', { name: 'Maximize' }).click()
    expect(await box(page, 'About me')).toEqual(resized)
  })

  test('windows open at their normal size, not full width', async ({ page }) => {
    for (const [name, width] of [['Skills', 640], ['Personalize', 880], ['Change OS', 760]] as const) {
      await desktopIcon(page, name).click()
      expect((await box(page, name)).width).toBe(width)
    }
  })
})
