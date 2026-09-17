import { test, expect } from '@playwright/test'

// Viewport de celular (iPhone 12/13). O site tem breakpoint único em 640px,
// então 390 de largura exercita todo o caminho mobile.
const PORTRAIT = { width: 390, height: 844 }
const LANDSCAPE = { width: 844, height: 390 }

// O gate de loading espera fontes + uma foto por contribuidor + load da janela,
// com piso de 1.5s. Em dev (primeira compilação) pode passar de 10s.
async function waitForContent(page: import('@playwright/test').Page) {
  await page.waitForSelector('.lrz-mark', { state: 'detached', timeout: 60000 })
}

test.use({ viewport: PORTRAIT })

test('toda cena é alcançável no scroll, descendo e subindo', async ({ page }) => {
  // O gate de loading (fontes + 22 fotos + piso de 1.5s) somado à compilação sob
  // demanda do Nuxt em dev passa fácil dos 30s padrão do Playwright.
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

  // Capa + 25 contribuidores + final.
  expect(scenes).toHaveLength(27)

  // Nenhum buraco nem sobreposição entre cenas: o topo de cada uma é a soma das
  // alturas anteriores. Buraco aqui vira ponto de scroll que não pertence a
  // cena nenhuma — é assim que uma seção "passa despercebida".
  let expected = 0
  for (const scene of scenes) {
    expect(Math.abs(scene.top - expected)).toBeLessThanOrEqual(1)
    expected += scene.height
  }

  // Todos os contribuidores têm âncora sequencial (o menu depende disso).
  const ids = scenes.map(s => s.id).filter(Boolean)
  expect(ids).toEqual(Array.from({ length: 25 }, (_, i) => `contributor-${i}`))

  // Descendo: cada cena assenta exatamente no próprio topo.
  for (const scene of scenes) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), scene.top)
    expect(Math.round(await page.evaluate(() => window.scrollY))).toBe(scene.top)
  }

  // Subindo: mesma garantia no sentido inverso.
  for (const scene of [...scenes].reverse()) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), scene.top)
    expect(Math.round(await page.evaluate(() => window.scrollY))).toBe(scene.top)
  }
})

test('entrada da cena toca ao descer e desfaz ao subir', async ({ page }) => {
  // O gate de loading (fontes + 22 fotos + piso de 1.5s) somado à compilação sob
  // demanda do Nuxt em dev passa fácil dos 30s padrão do Playwright.
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  // Amostra (começo/meio/fim): é o mesmo componente pras 25, e esperar a
  // timeline inteira em todas levaria minutos.
  for (const index of [0, 12, 24]) {
    const section = page.locator(`#contributor-${index}`)
    const caption = section.locator('.caption-fade')
    if (!(await caption.count())) continue // seções de duas vozes não têm legenda

    const top = await section.evaluate(el => el.getBoundingClientRect().top + window.scrollY)

    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top)
    await expect.poll(
      () => caption.evaluate(el => Number(getComputedStyle(el).opacity)),
      { timeout: 10000, message: `entrada da seção ${index} não completou descendo` }
    ).toBeGreaterThan(0.9)

    // Voltar pra cena ANTERIOR (um ponto de snap de verdade — com
    // scroll-snap-type mandatory, rolar pra um offset qualquer no meio do
    // caminho é reassentado pelo navegador) tem de DESFAZER a entrada
    // (toggleActions 'play reverse play reverse'), senão subir e descer de novo
    // deixa a cena montada sem animação.
    const previousTop = await page.evaluate((y) => {
      const tops = Array.from(document.querySelectorAll('.scroll-scene'))
        .map(el => Math.round(el.getBoundingClientRect().top + window.scrollY))
        .filter(t => t < y)
      return tops.length ? Math.max(...tops) : 0
    }, top)

    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), previousTop)
    await expect.poll(
      () => caption.evaluate(el => Number(getComputedStyle(el).opacity)),
      { timeout: 10000, message: `entrada da seção ${index} não reverteu subindo` }
    ).toBeLessThan(0.1)
  }
})

test('girar o celular reposiciona as pilhas no novo tamanho de palco', async ({ page }) => {
  // O gate de loading (fontes + 22 fotos + piso de 1.5s) somado à compilação sob
  // demanda do Nuxt em dev passa fácil dos 30s padrão do Playwright.
  test.setTimeout(120000)
  await page.goto('/')
  await waitForContent(page)

  const section = page.locator('#contributor-0')
  const caption = section.locator('.caption-fade')

  // Só as camadas de pilha carregam data-pose-x (escrito por writeStackPoses) —
  // é o seletor que separa elas das cópias de entrada/viajantes, que param em
  // outros pontos e não são reposicionadas.
  const stackOffset = () => section.evaluate((el) => {
    const stage = el.querySelector('.sticky')!.getBoundingClientRect()
    const center = stage.left + stage.width / 2
    const xs = Array.from(el.querySelectorAll('[data-pose-x]')).map((node) => {
      const r = node.getBoundingClientRect()
      // Centro da camada menos o centro do palco = exatamente a pose x.
      return Math.abs(r.left + r.width / 2 - center)
    })
    return Math.max(0, ...xs)
  })

  async function settleOnSection() {
    const top = await section.evaluate(el => el.getBoundingClientRect().top + window.scrollY)
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top)
    await expect.poll(
      () => caption.evaluate(el => Number(getComputedStyle(el).opacity)),
      { timeout: 10000 }
    ).toBeGreaterThan(0.9)
  }

  await settleOnSection()
  // Pose em retrato: 390 * 0.30 + peek ≈ 147.
  const portrait = await stackOffset()
  expect(portrait).toBeGreaterThan(100)

  await page.setViewportSize(LANDSCAPE)
  // Debounce do resize (150ms) + margem. Rolar de novo porque a rotação muda a
  // altura de todas as cenas: o mesmo scrollY passa a cair em outro lugar.
  await page.waitForTimeout(600)
  await settleOnSection()

  // Paisagem: 844 * 0.30 + peek ≈ 283. Sem remedir o palco, ficava parado no
  // valor do retrato.
  const landscape = await stackOffset()
  expect(landscape).toBeGreaterThan(portrait * 1.5)
})
