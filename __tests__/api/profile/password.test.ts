import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/auth", () => ({ auth: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn(), update: vi.fn() } },
}))

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(async () => "hashed_new_password"),
  },
}))

import { PATCH } from "@/app/api/profile/password/route"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const mockSession = { user: { id: "user-123" } }
const mockUser = { id: "user-123", password: "hashed_old_password" }

function patchRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/profile/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("PATCH /api/profile/password", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    const res = await PATCH(patchRequest({ currentPassword: "old", newPassword: "new123" }))
    expect(res.status).toBe(401)
  })

  it("returns 400 when currentPassword is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await PATCH(patchRequest({ newPassword: "new123" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when newPassword is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await PATCH(patchRequest({ currentPassword: "old" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when newPassword is shorter than 6 characters", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await PATCH(patchRequest({ currentPassword: "old", newPassword: "abc" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("6")
  })

  it("returns 400 when newPassword exceeds 128 characters", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await PATCH(patchRequest({ currentPassword: "old", newPassword: "x".repeat(129) }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when currentPassword is incorrect", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never)
    const res = await PATCH(patchRequest({ currentPassword: "wrong", newPassword: "newpass123" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Nieprawidłowe")
  })

  it("hashes new password and updates user on success", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)

    const res = await PATCH(patchRequest({ currentPassword: "oldpass", newPassword: "newpass123" }))
    expect(res.status).toBe(200)
    expect(bcrypt.hash).toHaveBeenCalledWith("newpass123", 12)
    const call = vi.mocked(prisma.user.update).mock.calls[0][0]
    expect(call.where.id).toBe("user-123")
    expect(call.data.password).toBe("hashed_new_password")
  })

  it("returns { ok: true } on success", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)

    const res = await PATCH(patchRequest({ currentPassword: "oldpass", newPassword: "newpass123" }))
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  it("never stores the plain-text password", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as never)
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never)
    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never)

    await PATCH(patchRequest({ currentPassword: "oldpass", newPassword: "newpass123" }))
    const call = vi.mocked(prisma.user.update).mock.calls[0][0]
    expect(call.data.password).not.toBe("newpass123")
  })
})
