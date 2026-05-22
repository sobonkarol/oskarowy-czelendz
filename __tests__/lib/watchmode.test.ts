import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getPlatformMeta, getStreamingSources, type StreamingSource } from "@/lib/watchmode"

describe("getPlatformMeta", () => {
  it("returns correct meta for Netflix", () => {
    const meta = getPlatformMeta("Netflix")
    expect(meta.color).toBe("#E50914")
    expect(meta.logo).toBe("N")
  })

  it("returns correct meta for Disney+", () => {
    const meta = getPlatformMeta("Disney+")
    expect(meta.color).toBe("#113CCF")
    expect(meta.logo).toBe("D+")
  })

  it("returns correct meta for MAX (HBO Max)", () => {
    const meta = getPlatformMeta("MAX")
    expect(meta.color).toBe("#002BE7")
  })

  it("returns correct meta for Canal+", () => {
    const meta = getPlatformMeta("Canal+")
    expect(meta.color).toBe("#000000")
    expect(meta.logo).toBe("C+")
  })

  it("returns gray color for unknown platform", () => {
    const meta = getPlatformMeta("SomeUnknownPlatform")
    expect(meta.color).toBe("#6B7280")
  })

  it("returns first letter as logo for unknown platform", () => {
    const meta = getPlatformMeta("ZenStream")
    expect(meta.logo).toBe("Z")
  })

  it("returns correct meta for MUBI", () => {
    const meta = getPlatformMeta("MUBI")
    expect(meta.color).toBe("#3F5EFB")
  })
})

describe("getStreamingSources", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function mockFetch(...responses: Array<{ ok: boolean; data?: unknown }>) {
    let call = 0
    vi.mocked(fetch).mockImplementation(async () => {
      const r = responses[call++] ?? { ok: false }
      return {
        ok: r.ok,
        json: async () => r.data,
      } as Response
    })
  }

  it("returns empty array when search API returns non-ok response", async () => {
    mockFetch({ ok: false })
    const result = await getStreamingSources(12345)
    expect(result).toEqual([])
  })

  it("returns empty array when no title_results found", async () => {
    mockFetch({ ok: true, data: { title_results: [] } })
    const result = await getStreamingSources(12345)
    expect(result).toEqual([])
  })

  it("returns empty array when sources API fails", async () => {
    mockFetch(
      { ok: true, data: { title_results: [{ id: 99 }] } },
      { ok: false }
    )
    const result = await getStreamingSources(12345)
    expect(result).toEqual([])
  })

  it("returns sub/free sources up to 5", async () => {
    const sources: StreamingSource[] = [
      { source_id: 1, name: "Netflix", type: "sub", web_url: "https://netflix.com", format: "HD", region: "PL" },
      { source_id: 2, name: "MAX", type: "sub", web_url: "https://max.com", format: "HD", region: "PL" },
      { source_id: 3, name: "Disney+", type: "free", web_url: "https://disney.com", format: "HD", region: "PL" },
      { source_id: 4, name: "MUBI", type: "sub", web_url: "https://mubi.com", format: "HD", region: "PL" },
      { source_id: 5, name: "Hulu", type: "sub", web_url: "https://hulu.com", format: "HD", region: "PL" },
      { source_id: 6, name: "Peacock", type: "sub", web_url: "https://peacock.com", format: "HD", region: "PL" },
    ]
    mockFetch(
      { ok: true, data: { title_results: [{ id: 99 }] } },
      { ok: true, data: sources }
    )
    const result = await getStreamingSources(12345)
    expect(result).toHaveLength(5)
    expect(result.every((s) => s.type === "sub" || s.type === "free")).toBe(true)
  })

  it("falls back to rent sources (up to 3) when no sub/free available", async () => {
    const sources: StreamingSource[] = [
      { source_id: 1, name: "Netflix", type: "rent", web_url: "https://netflix.com", format: "HD", region: "PL" },
      { source_id: 2, name: "MAX", type: "rent", web_url: "https://max.com", format: "HD", region: "PL" },
      { source_id: 3, name: "Apple TV+", type: "rent", web_url: "https://apple.com", format: "HD", region: "PL" },
      { source_id: 4, name: "Amazon", type: "rent", web_url: "https://amazon.com", format: "HD", region: "PL" },
    ]
    mockFetch(
      { ok: true, data: { title_results: [{ id: 99 }] } },
      { ok: true, data: sources }
    )
    const result = await getStreamingSources(12345)
    expect(result).toHaveLength(3)
    expect(result.every((s) => s.type === "rent")).toBe(true)
  })

  it("deduplicates sources by platform name", async () => {
    const sources: StreamingSource[] = [
      { source_id: 1, name: "Netflix", type: "sub", web_url: "https://netflix.com/1", format: "HD", region: "PL" },
      { source_id: 2, name: "Netflix", type: "sub", web_url: "https://netflix.com/2", format: "4K", region: "PL" },
      { source_id: 3, name: "MAX", type: "sub", web_url: "https://max.com", format: "HD", region: "PL" },
    ]
    mockFetch(
      { ok: true, data: { title_results: [{ id: 99 }] } },
      { ok: true, data: sources }
    )
    const result = await getStreamingSources(12345)
    const names = result.map((s) => s.name)
    expect(names.filter((n) => n === "Netflix")).toHaveLength(1)
    expect(result).toHaveLength(2)
  })

  it("prefers sub/free over rent even when rent sources are present too", async () => {
    const sources: StreamingSource[] = [
      { source_id: 1, name: "Netflix", type: "rent", web_url: "https://netflix.com", format: "HD", region: "PL" },
      { source_id: 2, name: "MAX", type: "sub", web_url: "https://max.com", format: "HD", region: "PL" },
    ]
    mockFetch(
      { ok: true, data: { title_results: [{ id: 99 }] } },
      { ok: true, data: sources }
    )
    const result = await getStreamingSources(12345)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("MAX")
    expect(result[0].type).toBe("sub")
  })

  it("returns empty array on fetch exception", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"))
    const result = await getStreamingSources(12345)
    expect(result).toEqual([])
  })

  it("excludes buy-type sources from both sub/free and rent fallback", async () => {
    const sources: StreamingSource[] = [
      { source_id: 1, name: "Netflix", type: "buy", web_url: "https://netflix.com", format: "HD", region: "PL" },
      { source_id: 2, name: "MAX", type: "buy", web_url: "https://max.com", format: "HD", region: "PL" },
    ]
    mockFetch(
      { ok: true, data: { title_results: [{ id: 99 }] } },
      { ok: true, data: sources }
    )
    const result = await getStreamingSources(12345)
    expect(result).toEqual([])
  })
})
