import { request } from "@playwright/test"
import { AUTH_FILE } from "./test-user"

export default async function globalTeardown() {
  const baseURL = "http://localhost:3000"
  const api = await request.newContext({ baseURL, storageState: AUTH_FILE })

  const res = await api.get("/api/ratings")
  if (!res.ok()) {
    await api.dispose()
    return
  }

  const ratings: Array<{ movieId: string }> = await res.json()
  for (const { movieId } of ratings) {
    await api.delete("/api/ratings", { data: { movieId } })
  }

  await api.dispose()
}
