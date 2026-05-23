import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    rating: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

import { POST, DELETE, GET } from "@/app/api/ratings/route"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const mockSession = { user: { id: "user-123", email: "test@test.com", name: "Test User" } }

const mockRating = {
  id: "rating-1",
  userId: "user-123",
  movieId: "movie-1",
  score: 8,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function postRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function deleteRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/ratings", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function getRequest(year?: number) {
  const url = year
    ? `http://localhost/api/ratings?year=${year}`
    : "http://localhost/api/ratings"
  return new NextRequest(url, { method: "GET" })
}

describe("POST /api/ratings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    const res = await POST(postRequest({ movieId: "m1", score: 8 }))
    expect(res.status).toBe(401)
  })

  it("returns 400 when movieId is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await POST(postRequest({ score: 8 }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when score is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await POST(postRequest({ movieId: "m1" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when score is 0 (below minimum)", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await POST(postRequest({ movieId: "m1", score: 0 }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when score is 11 (above maximum)", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await POST(postRequest({ movieId: "m1", score: 11 }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when score is a string", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await POST(postRequest({ movieId: "m1", score: "eight" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 when score is a float", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await POST(postRequest({ movieId: "m1", score: 7.5 }))
    expect(res.status).toBe(400)
  })

  it("accepts score of exactly 1", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.upsert).mockResolvedValueOnce({ ...mockRating, score: 1 } as never)
    const res = await POST(postRequest({ movieId: "m1", score: 1 }))
    expect(res.status).toBe(200)
  })

  it("accepts score of exactly 10", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.upsert).mockResolvedValueOnce({ ...mockRating, score: 10 } as never)
    const res = await POST(postRequest({ movieId: "m1", score: 10 }))
    expect(res.status).toBe(200)
  })

  it("upserts rating with correct userId and movieId", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.upsert).mockResolvedValueOnce(mockRating as never)

    await POST(postRequest({ movieId: "movie-abc", score: 7 }))

    const call = vi.mocked(prisma.rating.upsert).mock.calls[0][0]
    expect(call.where.userId_movieId.userId).toBe("user-123")
    expect(call.where.userId_movieId.movieId).toBe("movie-abc")
    expect(call.create.score).toBe(7)
    expect(call.update.score).toBe(7)
  })

  it("returns the upserted rating", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.upsert).mockResolvedValueOnce(mockRating as never)

    const res = await POST(postRequest({ movieId: "m1", score: 8 }))
    const body = await res.json()
    expect(body.id).toBe("rating-1")
    expect(body.score).toBe(8)
  })
})

describe("DELETE /api/ratings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    const res = await DELETE(deleteRequest({ movieId: "m1" }))
    expect(res.status).toBe(401)
  })

  it("returns 400 when movieId is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const res = await DELETE(deleteRequest({}))
    expect(res.status).toBe(400)
  })

  it("deletes rating for the authenticated user", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.deleteMany).mockResolvedValueOnce({ count: 1 } as never)

    const res = await DELETE(deleteRequest({ movieId: "movie-abc" }))
    expect(res.status).toBe(200)

    const call = vi.mocked(prisma.rating.deleteMany).mock.calls[0][0]
    expect(call?.where?.userId).toBe("user-123")
    expect(call?.where?.movieId).toBe("movie-abc")
  })

  it("returns { ok: true } on success", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.deleteMany).mockResolvedValueOnce({ count: 1 } as never)

    const res = await DELETE(deleteRequest({ movieId: "m1" }))
    const body = await res.json()
    expect(body.ok).toBe(true)
  })
})

describe("GET /api/ratings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    const res = await GET(getRequest())
    expect(res.status).toBe(401)
  })

  it("returns all user ratings when no year filter", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([mockRating] as never)

    const res = await GET(getRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)

    const call = vi.mocked(prisma.rating.findMany).mock.calls[0][0]
    expect(call?.where).toEqual({ userId: "user-123" })
  })

  it("filters by year when ?year= param provided", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([] as never)

    await GET(getRequest(2024))

    const call = vi.mocked(prisma.rating.findMany).mock.calls[0][0]
    expect(call?.where).toEqual({
      userId: "user-123",
      movie: { ceremonyYear: 2024 },
    })
  })

  it("returns 400 when year param is not a valid integer", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    const req = new NextRequest("http://localhost/api/ratings?year=abc", { method: "GET" })
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it("includes movie data in the response", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([mockRating] as never)

    await GET(getRequest())

    const call = vi.mocked(prisma.rating.findMany).mock.calls[0][0]
    expect(call?.include?.movie?.select).toMatchObject({
      id: true,
      title: true,
      ceremonyYear: true,
    })
  })
})
