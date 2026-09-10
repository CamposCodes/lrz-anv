import { test, expect } from '@playwright/test'

test('homepage carrega com <h1> e conteúdo SSR', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('h1')).toBeVisible()
})

test('JSON-LD de Schema.org está presente no HTML', async ({ page }) => {
  await page.goto('/')
  const ldJson = page.locator('script[type="application/ld+json"]')
  await expect(ldJson.first()).toBeAttached()
})

test('/robots.txt responde e libera bots de IA', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('GPTBot')
  expect(body).toContain('Sitemap:')
})

test('/sitemap.xml responde', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  expect(await res.text()).toContain('<urlset')
})

test('/llms.txt responde', async ({ request }) => {
  const res = await request.get('/llms.txt')
  expect(res.status()).toBe(200)
})

test('cortina de abertura cobre a home e sai sozinha', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.loader')).toBeAttached()
  // O que não pode acontecer NUNCA é a cortina ficar: ela tapa a landing inteira.
  await expect(page.locator('.loader')).toBeHidden({ timeout: 20000 })
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('clip')
})

test('cortina de abertura não aparece fora da home', async ({ page }) => {
  await page.goto('/privacidade')
  await expect(page.locator('.loader')).toHaveCount(0)
})

test.describe('cortina de abertura sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('o teto em CSS abre a home sozinho', async ({ page }) => {
    await page.goto('/')
    // Em dev o Vite entrega o <style scoped> por JS: sem JS não há teto a testar.
    // Contra o build (npm run build && node .output/server/index.mjs) o teste roda.
    const temEstilo = await page.locator('.loader').evaluate(e => getComputedStyle(e).position === 'fixed')
    test.skip(!temEstilo, 'CSS do componente só chega em arquivo no build')
    await expect(page.locator('.loader')).toBeHidden({ timeout: 20000 })
  })
})
