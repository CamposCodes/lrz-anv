import { test, expect } from '@playwright/test'
import {
  CONTRIBUTOR_COUNT, SCENE_COUNT, PORTRAIT, LANDSCAPE,
  waitForContent, sceneTops, scrollTo, expectSceneEntered
} from './helpers'

test.use({ viewport: PORTRAIT, hasTouch: true, isMobile: true })

test('cenas são contíguas e assentam no próprio topo, nos dois sentidos', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const scenes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.scroll-scene')).map(el => ({
      id: el.id || null,
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
      height: (el as HTMLElement).offsetHeight
    }))
  )

  expect(scenes).toHaveLength(SCENE_COUNT)

  let expected = 0
  for (const scene of scenes) {
    expect(Math.abs(scene.top - expected)).toBeLessThanOrEqual(1)
    expected += scene.height
  }

  expect(scenes.map(s => s.id).filter(Boolean))
    .toEqual(Array.from({ length: CONTRIBUTOR_COUNT }, (_, i) => `contributor-${i}`))

  for (const scene of [...scenes, ...[...scenes].reverse()]) {
    await scrollTo(page, scene.top)
    expect(Math.round(await page.evaluate(() => window.scrollY))).toBe(scene.top)
  }
})

test('nenhuma cena gera rolagem horizontal', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const tops = await sceneTops(page)
  for (const top of tops) {
    await scrollTo(page, top)
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `rolagem horizontal no scroll ${top}`).toBeLessThanOrEqual(1)
  }
})

test('gesto vertical continua rolando a página por cima dos elementos arrastáveis', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const tops = await sceneTops(page)
  await scrollTo(page, tops[1]!)
  await expectSceneEntered(page, 0)

  const cardTouchAction = await page.evaluate(() => {
    const el = document.querySelector('#contributor-0 .touch-pan-y')
    return el ? getComputedStyle(el).touchAction : null
  })
  expect(cardTouchAction).toBe('pan-y')

  await scrollTo(page, tops[tops.length - 1]!)
  const galleryTouchAction = await page.evaluate(() => {
    const el = document.querySelector('.gallery-viewport')
    return el ? getComputedStyle(el).touchAction : null
  })
  expect(galleryTouchAction).toBe('pan-y')
})

test('arrastar o cartão na horizontal troca a foto', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const tops = await sceneTops(page)
  await scrollTo(page, tops[1]!)
  await expectSceneEntered(page, 0)

  const card = page.locator('#contributor-0 .z-20').first()
  const fotoAtual = () => card.locator('img').first().getAttribute('src')

  const antes = await fotoAtual()
  const box = (await card.boundingBox())!

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(box.x + box.width / 2 - i * 30, box.y + box.height / 2)
  }
  await page.mouse.up()

  await expect.poll(fotoAtual, { timeout: 10000, message: 'foto central não trocou após o arrasto' })
    .not.toBe(antes)
})

test('botões de ícone têm alvo de toque de 44px', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const menuButton = page.getByRole('button', { name: /abrir menu/i })
  const box = (await menuButton.boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(44)
  expect(box.height).toBeGreaterThanOrEqual(44)
})

test('girar o celular reposiciona as pilhas no novo tamanho de palco', async ({ page }) => {
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const section = page.locator('#contributor-0')

  const stackOffset = () => section.evaluate((el) => {
    const stage = el.querySelector('.sticky')!.getBoundingClientRect()
    const center = stage.left + stage.width / 2
    const xs = Array.from(el.querySelectorAll('[data-pose-x]')).map((node) => {
      const r = node.getBoundingClientRect()
      return Math.abs(r.left + r.width / 2 - center)
    })
    return Math.max(0, ...xs)
  })

  async function settleOnSection() {
    const top = await section.evaluate(el => el.getBoundingClientRect().top + window.scrollY)
    await scrollTo(page, top)
    await expectSceneEntered(page, 0)
  }

  await settleOnSection()
  const portrait = await stackOffset()
  expect(portrait).toBeGreaterThan(100)

  await page.setViewportSize(LANDSCAPE)
  await page.waitForTimeout(600)
  await settleOnSection()

  expect(await stackOffset()).toBeGreaterThan(portrait * 1.5)
})
