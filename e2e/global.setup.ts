import { chromium, request } from "@playwright/test"
import { TEST_USER, AUTH_FILE } from "./test-user"

export default async function globalSetup() {
  const baseURL = "http://localhost:3000"

  // Register test user — 409 means the user already exists, which is fine
  const api = await request.newContext({ baseURL })
  const res = await api.post("/api/auth/register", { data: TEST_USER })
  if (!res.ok() && res.status() !== 409) {
    throw new Error(`Failed to register test user: ${res.status()} ${await res.text()}`)
  }
  await api.dispose()

  // Log in and persist the session cookie to disk
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${baseURL}/login`)
  await page.getByPlaceholder("ty@example.com").fill(TEST_USER.email)
  await page.getByPlaceholder("••••••••").fill(TEST_USER.password)
  await page.getByRole("button", { name: /zaloguj/i }).click()
  await page.waitForURL("**/dashboard", { timeout: 15_000 })
  await page.context().storageState({ path: AUTH_FILE })
  await browser.close()
}
