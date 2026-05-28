import { When, Then, expect } from "../fixtures"

Then("I can see my user highlighted", async ({ page }) => {
  await expect(page.getByText("(Ty)", { exact: false }).first()).toBeVisible()
})

When("I rate the first unrated film with score {int}", async ({ page }, score: number) => {
  const star = page.locator(`[aria-label="Ocena ${score}"]`).first()
  await expect(star).toBeVisible({ timeout: 8_000 })
  await star.click()
  await page.waitForTimeout(600)
})

When("I click the first film in the ranking", async ({ page }) => {
  const filmBtn = page.locator("button").filter({ hasText: /głosów/ }).first()
  await expect(filmBtn).toBeVisible({ timeout: 8_000 })
  await filmBtn.click()
})

Then("I can see the ratings popup", async ({ page }) => {
  await expect(page.locator("[data-testid='ratings-modal']")).toBeVisible({ timeout: 5_000 })
})

Then("I can see the score {string} in the popup", async ({ page }, score: string) => {
  const modal = page.locator("[data-testid='ratings-modal']")
  await expect(modal).toBeVisible({ timeout: 5_000 })
  await expect(modal.getByText(score, { exact: false }).first()).toBeVisible()
})

When("I close the ratings popup", async ({ page }) => {
  await page.getByRole("button", { name: "Zamknij popup" }).click()
})

Then("the ratings popup is closed", async ({ page }) => {
  await expect(page.locator("[data-testid='ratings-modal']")).not.toBeVisible({ timeout: 3_000 })
})
