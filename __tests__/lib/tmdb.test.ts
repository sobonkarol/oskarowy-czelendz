import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { searchTmdbMovie, getTmdbMovieById } from "@/lib/tmdb"

const mockMovie = {
  id: 11,
  title: "Star Wars",
  poster_path: "/path.jpg",
  backdrop_path: "/back.jpg",
  overview: "A long time ago...",
  release_date: "1977-05-25",
  vote_average: 8.6,
}

describe("searchTmdbMovie", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns the first result when found with year", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockMovie] }),
    } as Response)

    const result = await searchTmdbMovie("Star Wars", 1977)
    expect(result).toEqual(mockMovie)
    expect(fetch).toHaveBeenCalledOnce()
  })

  it("retries without year when first search returns empty results", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [mockMovie] }),
      } as Response)

    const result = await searchTmdbMovie("Star Wars", 1977)
    expect(result).toEqual(mockMovie)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("includes year param in first call URL", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockMovie] }),
    } as Response)

    await searchTmdbMovie("Star Wars", 1977)
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain("year=1977")
    // encodeURIComponent encodes spaces as %20, not +
    expect(url).toContain("query=Star%20Wars")
  })

  it("does not include year param in retry call", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [mockMovie] }) } as Response)

    await searchTmdbMovie("Some Film", 2000)
    const retryUrl = vi.mocked(fetch).mock.calls[1][0] as string
    expect(retryUrl).not.toContain("year=")
  })

  it("returns null when first response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)
    const result = await searchTmdbMovie("Unknown", 2000)
    expect(result).toBeNull()
  })

  it("returns null when both searches return empty results", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) } as Response)

    const result = await searchTmdbMovie("Nothing", 2000)
    expect(result).toBeNull()
  })

  it("returns null when retry response is not ok", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) } as Response)
      .mockResolvedValueOnce({ ok: false } as Response)

    const result = await searchTmdbMovie("Film", 2000)
    expect(result).toBeNull()
  })

  it("encodes special characters in title", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [mockMovie] }),
    } as Response)

    await searchTmdbMovie("It's a Wonderful Life", 1946)
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain("It")
    expect(url).toContain("Wonderful%20Life")
  })
})

describe("getTmdbMovieById", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns movie data on successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    } as Response)

    const result = await getTmdbMovieById(11)
    expect(result).toEqual(mockMovie)
  })

  it("returns null on non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)
    const result = await getTmdbMovieById(999)
    expect(result).toBeNull()
  })

  it("includes the tmdbId in the URL", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    } as Response)

    await getTmdbMovieById(42)
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain("/movie/42")
  })

  it("requests Polish language", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    } as Response)

    await getTmdbMovieById(11)
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain("language=pl-PL")
  })
})
