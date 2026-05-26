import { When } from "../fixtures"
import { TEST_USER } from "../test-user"

When("I log in as the test user", async ({ page }) => {
  await page.getByPlaceholder("ty@example.com").fill(TEST_USER.email)
  await page.getByPlaceholder("••••••••").fill(TEST_USER.password)
  await page.getByRole("button", { name: /zaloguj/i }).click()
  await page.waitForURL("**/dashboard")
})

When("I fill in the email field with {string}", async ({ page }, email: string) => {
  await page.getByPlaceholder("ty@example.com").fill(email)
})

When("I fill in the login password field with {string}", async ({ page }, password: string) => {
  await page.getByPlaceholder("••••••••").fill(password)
})

When("I fill in the registration form with valid data", async ({ page }) => {
  await page.getByPlaceholder("Jan").fill("Nowy")
  await page.getByPlaceholder("Kowalski").fill("Użytkownik")
  await page.getByPlaceholder("ty@example.com").fill(`new-${Date.now()}@example.com`)
  await page.getByPlaceholder("Min. 6 znaków").fill("Valid123!")
})

When("I fill in the registration form with the existing email", async ({ page }) => {
  await page.getByPlaceholder("Jan").fill("Test")
  await page.getByPlaceholder("Kowalski").fill("User")
  await page.getByPlaceholder("ty@example.com").fill(TEST_USER.email)
  await page.getByPlaceholder("Min. 6 znaków").fill("Valid123!")
})

When("I fill in {string} with {string}", async ({ page }, placeholder: string, value: string) => {
  await page.getByPlaceholder(placeholder).fill(value)
})
