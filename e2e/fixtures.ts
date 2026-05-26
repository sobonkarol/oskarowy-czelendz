import { test as base } from "playwright-bdd"
import { createBdd } from "playwright-bdd"
import { TEST_USER } from "./test-user"

export type TestFixtures = {
  testUser: typeof TEST_USER
}

export const test = base.extend<TestFixtures>({
  testUser: async ({}, use) => {
    await use(TEST_USER)
  },
})

export const { Given, When, Then, Before, After } = createBdd(test)
export { expect } from "@playwright/test"
