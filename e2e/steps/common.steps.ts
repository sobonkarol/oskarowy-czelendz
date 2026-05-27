import { Given, When, Then, Before, expect } from "../fixtures"

// Clear auth cookies for scenarios that must run as a guest
Before({ tags: "@unauthenticated" }, async ({ context }) => {
  await context.clearCookies()
})

Given("I am on the home page", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")
})

Given("I navigate to {string}", async ({ page }, path: string) => {
  await page.goto(path)
  await page.waitForLoadState("networkidle")
})

Given("I am logged in and on {string}", async ({ page }, path: string) => {
  await page.goto(path)
  await page.waitForLoadState("networkidle")
})

When("I click the submit button", async ({ page }) => {
  await page.getByRole("button", { name: /zarejestruj|zaloguj/i }).click()
})

When("I reload the page", async ({ page }) => {
  await page.reload()
  await page.waitForLoadState("networkidle")
})

Then("I am on page {string}", async ({ page }, path: string) => {
  await expect(page).toHaveURL(new RegExp(path.replace(/\//g, "\\/") + "($|[?#])"), {
    timeout: 8_000,
  })
})

Then("I can see the text {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text, { exact: false }).first()).toBeVisible()
})

Then("I can see a link {string}", async ({ page }, label: string) => {
  await expect(page.getByRole("link", { name: label, exact: false }).first()).toBeVisible()
})

Then("I can see an error message", async ({ page }) => {
  const error = page.locator("main [class*='red-'], form [class*='red-']").first()
  await expect(error).toBeVisible({ timeout: 5_000 })
})

Then("I can see an error message containing {string}", async ({ page }, text: string) => {
  const error = page.locator("main [class*='red-'], form [class*='red-']").first()
  await expect(error).toBeVisible({ timeout: 5_000 })
  await expect(error).toContainText(text)
})

Then("I can see the section {string}", async ({ page }, heading: string) => {
  await expect(page.getByText(heading, { exact: false }).first()).toBeVisible()
})
