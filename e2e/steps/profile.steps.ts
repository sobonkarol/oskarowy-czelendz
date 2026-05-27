import { When, Then, expect } from "../fixtures"

When(
  "I fill in the password form with current {string} new {string} confirm {string}",
  async ({ page }, current: string, newPw: string, confirm: string) => {
    await page.locator("#currentPassword").fill(current)
    await page.locator("#newPassword").fill(newPw)
    await page.locator("#confirmPassword").fill(confirm)
  }
)

When("I click the change password button", async ({ page }) => {
  await page.getByRole("button", { name: "Zmień hasło" }).click()
})

When("I click the first avatar option", async ({ page }) => {
  await page.getByRole("button", { name: /Avatar:/i }).first().click()
})

When("I click the save avatar button", async ({ page }) => {
  await page.getByRole("button", { name: "Zapisz awatar" }).click()
})
