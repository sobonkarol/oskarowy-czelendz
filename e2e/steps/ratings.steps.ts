import { When, Then, expect } from "../fixtures"
import type { Page } from "@playwright/test"

function firstMovieCard(page: Page) {
  return page.locator("[class*='glass'][class*='rounded']").filter({
    has: page.locator("[aria-label*='Ocena']"),
  }).first()
}

When("I remove all ratings for year {int}", async ({ page }, _year: number) => {
  const deleteButtons = page.locator("[aria-label='Usuń ocenę']")
  while (await deleteButtons.count() > 0) {
    await deleteButtons.first().click()
    await page.waitForTimeout(400)
  }
})

When("I click star {int} for the first movie", async ({ page }, n: number) => {
  const star = firstMovieCard(page).locator(`[aria-label="Ocena ${n}"]`)
  await expect(star).toBeVisible()
  await star.click()
  await page.waitForTimeout(600)
})

When("I click the delete rating button for the first movie", async ({ page }) => {
  const btn = firstMovieCard(page).locator("[aria-label='Usuń ocenę']")
  await expect(btn).toBeVisible({ timeout: 5_000 })
  await btn.click()
  await page.waitForTimeout(600)
})

When("I hover over star {int} for the first movie", async ({ page }, n: number) => {
  const star = firstMovieCard(page).locator(`[aria-label="Ocena ${n}"]`)
  await star.hover()
})

Then("I can see the score {string} for the first movie", async ({ page }, score: string) => {
  await expect(firstMovieCard(page).getByText(score, { exact: false })).toBeVisible({ timeout: 5_000 })
})

Then("I cannot see a score for the first movie", async ({ page }) => {
  await expect(firstMovieCard(page).getByText(/\d\/10/)).toHaveCount(0, { timeout: 5_000 })
})

Then("{int} stars are active for the first movie", async ({ page }, count: number) => {
  const card = firstMovieCard(page)
  const filledStars = card.locator("button.star svg[class*='fill-\\[var']")
  expect(await filledStars.count()).toBeGreaterThanOrEqual(count)
})
