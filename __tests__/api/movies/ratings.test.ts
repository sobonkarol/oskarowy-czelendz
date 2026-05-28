import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/auth", () => ({ auth: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    movie: { findUnique: vi.fn() },
    rating: { findMany: vi.fn() },
  },
}))

import { GET } from "@/app/api/movies/[movieId]/ratings/route"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const mockSession = { user: { id: "user-123" } }

const mockMovie = {
  id: "movie-1",
  title: "The Godfather",
  director: "Francis Ford Coppola",
  ceremonyYear: 1973,
  isWinner: true,
  posterPath: "/abc.jpg",
}

const mockRatings = [
  { score: 10, user: { id: "u1", firstName: "Anna", lastName: "Nowak", avatarUrl: "🦁" } },
  { score: 8,  user: { id: "u2", firstName: "Jan",  lastName: "Kowalski", avatarUrl: null } },
  { score: 6,  user: { id: "u3", firstName: "Ola",  lastName: "Wiśniewska", avatarUrl: null } },
]

function getRequest(movieId: string) {
  return new NextRequest(`http://localhost/api/movies/${movieId}/ratings`, {
    method: "GET",
  })
}

function makeParams(movieId: string) {
  return { params: Promise.resolve({ movieId }) }
}

describe("GET /api/movies/[movieId]/ratings", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    const res = await GET(getRequest("movie-1"), makeParams("movie-1"))
    expect(res.status).toBe(401)
  })

  it("returns 404 when movie does not exist", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.movie.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([] as never)
    const res = await GET(getRequest("nonexistent"), makeParams("nonexistent"))
    expect(res.status).toBe(404)
  })

  it("returns movie data and ratings on success", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.movie.findUnique).mockResolvedValueOnce(mockMovie as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce(
      mockRatings.map(r => ({ score: r.score, user: r.user })) as never
    )

    const res = await GET(getRequest("movie-1"), makeParams("movie-1"))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.movie.title).toBe("The Godfather")
    expect(body.movie.isWinner).toBe(true)
    expect(body.ratings).toHaveLength(3)
  })

  it("returns empty ratings array when no one has rated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.movie.findUnique).mockResolvedValueOnce(mockMovie as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([] as never)

    const res = await GET(getRequest("movie-1"), makeParams("movie-1"))
    const body = await res.json()
    expect(body.ratings).toEqual([])
  })

  it("queries ratings ordered by score descending", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.movie.findUnique).mockResolvedValueOnce(mockMovie as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([] as never)

    await GET(getRequest("movie-1"), makeParams("movie-1"))

    const call = vi.mocked(prisma.rating.findMany).mock.calls[0][0]
    expect(call?.orderBy).toEqual({ score: "desc" })
  })

  it("filters ratings by the requested movieId", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.movie.findUnique).mockResolvedValueOnce(mockMovie as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce([] as never)

    await GET(getRequest("movie-abc"), makeParams("movie-abc"))

    const call = vi.mocked(prisma.rating.findMany).mock.calls[0][0]
    expect(call?.where).toEqual({ movieId: "movie-abc" })
  })

  it("includes user firstName, lastName and avatarUrl in response", async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as never)
    vi.mocked(prisma.movie.findUnique).mockResolvedValueOnce(mockMovie as never)
    vi.mocked(prisma.rating.findMany).mockResolvedValueOnce(
      [{ score: 9, user: { id: "u1", firstName: "Anna", lastName: "Nowak", avatarUrl: "🦁" } }] as never
    )

    const res = await GET(getRequest("movie-1"), makeParams("movie-1"))
    const body = await res.json()
    const rating = body.ratings[0]
    expect(rating.user.firstName).toBe("Anna")
    expect(rating.user.lastName).toBe("Nowak")
    expect(rating.user.avatarUrl).toBe("🦁")
    expect(rating.score).toBe(9)
  })
})
