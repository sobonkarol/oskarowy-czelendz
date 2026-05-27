import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/auth", () => ({ auth: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { update: vi.fn() } },
}))

vi.mock("@/lib/avatars", async () => {
  const url = "https://api.dicebear.com/9.x/avataaars/svg?seed=meryl&backgroundColor=b6e3f4"
  return {
    PRESET_AVATAR_URLS: new Set([url]),
    PRESET_AVATARS: [{ id: "meryl", label: "Meryl", url }],
  }
})

import { PATCH } from "@/app/api/profile/avatar/route"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const VALID_URL = "https://api.dicebear.com/9.x/avataaars/svg?seed=meryl&backgroundColor=b6e3f4"
const mockSession = { user: { id: "user-123" } }

function patchRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/profile/avatar", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("PATCH /api/profile/avatar", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    const res = await PATCH(patchRequest({ avatarUrl: VALID_URL }))
    expect(res.status).toBe(401)
  })

  it("returns 400 when avatarUrl is not in preset list", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await PATCH(patchRequest({ avatarUrl: "https://evil.com/fake.svg" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when avatarUrl is a number", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await PATCH(patchRequest({ avatarUrl: 123 }))
    expect(res.status).toBe(400)
  })

  it("accepts null to clear the avatar", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)
    const res = await PATCH(patchRequest({ avatarUrl: null }))
    expect(res.status).toBe(200)
    expect(vi.mocked(prisma.user.update).mock.calls[0][0].data.avatarUrl).toBeNull()
  })

  it("updates user with the preset avatarUrl", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)
    const res = await PATCH(patchRequest({ avatarUrl: VALID_URL }))
    expect(res.status).toBe(200)
    const call = vi.mocked(prisma.user.update).mock.calls[0][0]
    expect(call.where.id).toBe("user-123")
    expect(call.data.avatarUrl).toBe(VALID_URL)
  })

  it("returns ok and avatarUrl on success", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)
    const res = await PATCH(patchRequest({ avatarUrl: VALID_URL }))
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.avatarUrl).toBe(VALID_URL)
  })
})
