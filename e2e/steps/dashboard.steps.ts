import { Then, When, expect } from "../fixtures"

Then("I can see progress stats", async ({ page }) => {
  await expect(page.locator("[class*='glass']").first()).toBeVisible()
})

Then("I can see year cards", async ({ page }) => {
  await expect(page.locator("a[href*='/movies/']").first()).toBeVisible()
})

Then("the number of year cards is greater than {int}", async ({ page }, count: number) => {
  const cards = page.locator("a[href*='/movies/']")
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThan(count)
})

Then("I can see a year card for {string}", async ({ page }, year: string) => {
  await expect(page.locator(`a[href*='/movies/${year}']`).first()).toBeVisible()
})

When("I click the year card for {string}", async ({ page }, year: string) => {
  await page.locator(`a[href*='/movies/${year}']`).first().click()
  await page.waitForLoadState("networkidle")
})
