import { test, expect } from '@playwright/test'

test('homepage carrega', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
})
