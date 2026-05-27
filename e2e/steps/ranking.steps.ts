import { Then, expect } from "../fixtures"

Then("I can see my user highlighted", async ({ page }) => {
  await expect(page.getByText("(Ty)", { exact: false }).first()).toBeVisible()
})
