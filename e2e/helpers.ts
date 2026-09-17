import { expect, type Page } from '@playwright/test'

export const PORTRAIT = { width: 390, height: 844 }
export const LANDSCAPE = { width: 844, height: 390 }
export const DESKTOP = { width: 1280, height: 800 }

export const CONTRIBUTOR_COUNT = 25
export const SCENE_COUNT = CONTRIBUTOR_COUNT + 2

export async function waitForContent(page: Page) {
  await page.waitForSelector('.lrz-mark', { state: 'detached', timeout: 60000 })
}

export function sceneTops(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('.scroll-scene'))
      .map(el => Math.round(el.getBoundingClientRect().top + window.scrollY))
  )
}

export async function scrollTo(page: Page, top: number) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top)
}

export function sceneOpacity(page: Page, index: number) {
  return page.evaluate((i) => {
    const el = document.querySelector(`#contributor-${i} [data-scene-ready]`)
    return el ? Number(getComputedStyle(el).opacity) : -1
  }, index)
}

export async function expectSceneEntered(page: Page, index: number) {
  await expect
    .poll(() => sceneOpacity(page, index), { timeout: 15000, message: `cena ${index} não montou` })
    .toBeGreaterThan(0.9)
}

export async function expectSceneReversed(page: Page, index: number) {
  await expect
    .poll(() => sceneOpacity(page, index), { timeout: 15000, message: `cena ${index} não desfez` })
    .toBeLessThan(0.1)
}

export function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', err => errors.push(String(err)))
  return errors
}
