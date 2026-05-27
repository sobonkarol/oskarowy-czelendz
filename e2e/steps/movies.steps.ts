import { Then, expect } from "../fixtures"
import type { Page } from "@playwright/test"

function movieCards(page: Page) {
  return page.locator("[class*='glass'][class*='rounded']").filter({
    has: page.locator("[aria-label*='Ocena']"),
  })
}

Then("I can see at least {int} movie cards", async ({ page }, count: number) => {
  const cards = movieCards(page)
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThanOrEqual(count)
})

Then("I can see exactly {int} movie cards", async ({ page }, count: number) => {
  const cards = movieCards(page)
  await expect(cards.first()).toBeVisible({ timeout: 10_000 })
  await expect(cards).toHaveCount(count)
})

Then("I can see the trophy icon on the winner", async ({ page }) => {
  const badge = page.locator("[class*='winner-badge']").first()
  await expect(badge).toBeVisible()
})

Then("I can see star ratings", async ({ page }) => {
  await expect(page.locator("[aria-label*='Ocena']").first()).toBeVisible()
})

Then("I can see a back link", async ({ page }) => {
  const back = page.locator("a[href='/dashboard']").first()
  await expect(back).toBeVisible()
})

Then("I can see a 404 error page", async ({ page }) => {
  const has404 = await page.getByText(/404|nie znaleziono/i).first().isVisible().catch(() => false)
  expect(has404).toBeTruthy()
})
