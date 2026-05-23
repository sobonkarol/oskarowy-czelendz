import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(async () => "hashed_password"),
    compare: vi.fn(),
  },
}))

import { POST } from "@/app/api/auth/register/route"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 400 when firstName is missing", async () => {
    const res = await POST(makeRequest({ lastName: "Kowalski", email: "a@b.com", password: "secret123" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it("returns 400 when lastName is missing", async () => {
    const res = await POST(makeRequest({ firstName: "Jan", email: "a@b.com", password: "secret123" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ firstName: "Jan", lastName: "Kowalski", password: "secret123" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when password is missing", async () => {
    const res = await POST(makeRequest({ firstName: "Jan", lastName: "Kowalski", email: "a@b.com" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when password is shorter than 6 characters", async () => {
    const res = await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "a@b.com", password: "abc" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("6")
  })

  it("accepts password of exactly 6 characters", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({} as never)

    const res = await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "a@b.com", password: "abc123" }))
    expect(res.status).not.toBe(400)
  })

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "not-an-email", password: "secret123" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it("returns 400 when firstName exceeds 50 characters", async () => {
    const res = await POST(makeRequest({ firstName: "A".repeat(51), lastName: "K", email: "a@b.com", password: "secret123" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when password exceeds 128 characters", async () => {
    const res = await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "a@b.com", password: "x".repeat(129) }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when non-string fields are provided", async () => {
    const res = await POST(makeRequest({ firstName: 123, lastName: "K", email: "a@b.com", password: "secret123" }))
    expect(res.status).toBe(400)
  })

  it("returns 409 when email is already taken", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "existing-id",
      email: "taken@example.com",
    } as never)

    const res = await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "taken@example.com", password: "secret123" }))
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it("returns 201 with success on valid registration", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({} as never)

    const res = await POST(makeRequest({ firstName: "Jan", lastName: "Kowalski", email: "new@example.com", password: "secret123" }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it("hashes the password before storing", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({} as never)

    await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "x@x.com", password: "plaintext" }))

    expect(bcrypt.hash).toHaveBeenCalledWith("plaintext", 12)
    expect(vi.mocked(prisma.user.create).mock.calls[0][0].data.password).toBe("hashed_password")
  })

  it("stores the plain-text password never", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({} as never)

    await POST(makeRequest({ firstName: "Jan", lastName: "K", email: "x@x.com", password: "plaintext" }))

    const createCall = vi.mocked(prisma.user.create).mock.calls[0][0]
    expect(createCall.data.password).not.toBe("plaintext")
  })

  it("stores correct user data", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({} as never)

    await POST(makeRequest({ firstName: "Anna", lastName: "Nowak", email: "anna@nowak.com", password: "password123" }))

    const createCall = vi.mocked(prisma.user.create).mock.calls[0][0]
    expect(createCall.data.firstName).toBe("Anna")
    expect(createCall.data.lastName).toBe("Nowak")
    expect(createCall.data.email).toBe("anna@nowak.com")
  })
})
