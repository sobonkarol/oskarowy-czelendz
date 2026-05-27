import { request } from "@playwright/test"
import { TEST_USER, AUTH_FILE } from "./test-user"

export default async function globalTeardown() {
  const baseURL = "http://localhost:3000"
  const api = await request.newContext({ baseURL, storageState: AUTH_FILE })

  // Delete all ratings for the test user
  const ratingsRes = await api.get("/api/ratings")
  if (ratingsRes.ok()) {
    const ratings: Array<{ movieId: string }> = await ratingsRes.json()
    for (const { movieId } of ratings) {
      await api.delete("/api/ratings", { data: { movieId } })
    }
  }

  // Reset avatar to null
  await api.patch("/api/profile/avatar", { data: { avatarUrl: null } })

  // Reset password: try new password first (in case the change-password test ran),
  // then fall back to original (if the test did not run or already reset)
  const resetWithNew = await api.patch("/api/profile/password", {
    data: { currentPassword: TEST_USER.newPassword, newPassword: TEST_USER.password },
  })
  if (!resetWithNew.ok()) {
    // Already on original password — nothing to do
  }

  await api.dispose()
}
