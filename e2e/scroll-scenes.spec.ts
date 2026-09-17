import { test, expect } from '@playwright/test'
import {
  CONTRIBUTOR_COUNT, SCENE_COUNT, PORTRAIT, DESKTOP,
  waitForContent, sceneTops, scrollTo, sceneOpacity,
  expectSceneEntered, expectSceneReversed, collectErrors
} from './helpers'

// Varredura das 25 cenas em ambos os sentidos, nos dois breakpoints do site
// (único corte em 640px). Cada varredura espera a timeline de entrada de cada
// seção, então o teste é longo por natureza.
for (const [nome, viewport] of [['mobile', PORTRAIT], ['desktop', DESKTOP]] as const) {
  test.describe(nome, () => {
    test.use({ viewport })

    test(`toda cena monta descendo e desfaz subindo (${nome})`, async ({ page }) => {
      test.setTimeout(600000)
      const errors = collectErrors(page)

      await page.goto('/')
      await waitForContent(page)

      const tops = await sceneTops(page)
      expect(tops).toHaveLength(SCENE_COUNT)

      // Descendo: cada seção assenta no próprio topo E monta o conteúdo.
      // É a garantia de que nenhuma passa despercebida num scroll rápido.
      for (let i = 0; i < CONTRIBUTOR_COUNT; i++) {
        const top = tops[i + 1]! // tops[0] é a capa
        await scrollTo(page, top)
        expect(Math.round(await page.evaluate(() => window.scrollY))).toBe(top)
        await expectSceneEntered(page, i)
      }

      // Subindo: a entrada tem de tocar ao contrário (toggleActions
      // 'play reverse play reverse'), senão a cena fica montada pra sempre e
      // descer de novo não anima nada.
      for (let i = CONTRIBUTOR_COUNT - 1; i >= 0; i--) {
        await scrollTo(page, tops[i]!) // cena anterior = ponto de snap real
        await expectSceneReversed(page, i)
      }

      // E descendo de novo: o ciclo completo tem de ser repetível.
      for (const i of [0, Math.floor(CONTRIBUTOR_COUNT / 2), CONTRIBUTOR_COUNT - 1]) {
        await scrollTo(page, tops[i + 1]!)
        await expectSceneEntered(page, i)
      }

      expect(errors, `erros de console: ${errors.join(' | ')}`).toEqual([])
    })
  })
}

test.describe('capa e final', () => {
  test.use({ viewport: PORTRAIT })

  test('capa dispersa no scrub e volta ao subir', async ({ page }) => {
    test.setTimeout(180000)
    await page.goto('/')
    await waitForContent(page)

    const letter = page.locator('.ransom-letter').first()
    const opacity = () => letter.evaluate(el => Number(getComputedStyle(el).opacity))

    // No topo, título inteiro visível.
    await scrollTo(page, 0)
    await expect.poll(opacity, { timeout: 10000 }).toBeGreaterThan(0.9)

    // Rolando pra fora da capa, as letras dispersam (scrub ligado à rolagem).
    const tops = await sceneTops(page)
    await scrollTo(page, tops[1]!)
    await expect.poll(opacity, { timeout: 10000 }).toBeLessThan(0.1)

    // Scrub é reversível por natureza: voltando ao topo, o título se refaz.
    await scrollTo(page, 0)
    await expect.poll(opacity, { timeout: 10000 }).toBeGreaterThan(0.9)
  })

  test('final monta a galeria e a mensagem', async ({ page }) => {
    test.setTimeout(180000)
    await page.goto('/')
    await waitForContent(page)

    const tops = await sceneTops(page)
    await scrollTo(page, tops[tops.length - 1]!)

    const message = page.locator('.scroll-scene').last().locator('p').last()
    await expect.poll(
      () => message.evaluate(el => Number(getComputedStyle(el).opacity)),
      { timeout: 15000 }
    ).toBeGreaterThan(0.9)

    // A galeria cilíndrica precisa ter montado cartões de verdade.
    const cards = await page.locator('.gallery-col img').count()
    expect(cards).toBeGreaterThan(0)
  })
})

test.describe('menu de navegação', () => {
  test.use({ viewport: PORTRAIT })

  test('menu leva à seção da pessoa escolhida', async ({ page }) => {
    test.setTimeout(180000)
    await page.goto('/')
    await waitForContent(page)

    const tops = await sceneTops(page)

    await page.getByRole('button', { name: /abrir menu/i }).click()
    const panel = page.locator('#nav-menu-panel')
    await expect(panel).toBeVisible()

    // Um botão por contribuidor.
    const pills = panel.locator('button')
    expect(await pills.count()).toBe(CONTRIBUTOR_COUNT)

    const alvo = 17
    await pills.nth(alvo).click()

    await expect(panel).toBeHidden()
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 10000 })
      .toBe(tops[alvo + 1]!)
    await expectSceneEntered(page, alvo)
  })
})

test.describe('movimento reduzido', () => {
  test.use({ viewport: PORTRAIT })

  test('cenas aparecem prontas, sem depender de animação', async ({ page }) => {
    test.setTimeout(180000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await waitForContent(page)

    const tops = await sceneTops(page)

    // Sem animação de entrada, o conteúdo precisa nascer no estado final —
    // o risco aqui é o oposto do normal: cena que nunca fica visível.
    for (const i of [0, 12, 24]) {
      await scrollTo(page, tops[i + 1]!)
      await expect.poll(() => sceneOpacity(page, i), { timeout: 10000 }).toBeGreaterThan(0.9)
    }
  })
})
