const BASE = "https://api.watchmode.com/v1"
const KEY = process.env.WATCHMODE_API_KEY!

export type StreamingSource = {
  source_id: number
  name: string
  type: "sub" | "rent" | "buy" | "free"
  web_url: string
  format: string
  price?: number
  region: string
}

const PLATFORM_META: Record<string, { color: string; logo: string }> = {
  Netflix: { color: "#E50914", logo: "N" },
  MAX: { color: "#002BE7", logo: "M" },
  Max: { color: "#002BE7", logo: "M" },
  "HBO Max": { color: "#002BE7", logo: "M" },
  "Disney+": { color: "#113CCF", logo: "D+" },
  "Amazon Prime Video": { color: "#00A8E0", logo: "P" },
  "Prime Video": { color: "#00A8E0", logo: "P" },
  "Apple TV+": { color: "#555555", logo: "A" },
  AppleTV: { color: "#555555", logo: "A" },
  "Apple TV": { color: "#555555", logo: "A" },
  MUBI: { color: "#3F5EFB", logo: "M" },
  "Paramount+": { color: "#0064FF", logo: "P+" },
  Peacock: { color: "#E30074", logo: "P" },
  Hulu: { color: "#1CE783", logo: "H" },
  "Canal+": { color: "#000000", logo: "C+" },
  "Player.pl": { color: "#E4000F", logo: "Pl" },
  Polsat: { color: "#E31E24", logo: "Po" },
  TVP: { color: "#003087", logo: "T" },
  Chili: { color: "#FF6B00", logo: "Ch" },
  "Rakuten TV": { color: "#BF0000", logo: "R" },
  YouTube: { color: "#FF0000", logo: "YT" },
  "SkyShowtime": { color: "#0B2244", logo: "SS" },
}

export function getPlatformMeta(name: string) {
  return PLATFORM_META[name] ?? { color: "#6B7280", logo: name[0] }
}

export async function getStreamingSources(tmdbId: number): Promise<StreamingSource[]> {
  try {
    // Search for title by TMDB ID
    const searchUrl = `${BASE}/search/?apiKey=${KEY}&search_field=tmdb_movie_id&search_value=${tmdbId}`
    const searchRes = await fetch(searchUrl, { cache: "no-store" })
    if (!searchRes.ok) return []
    const searchData = await searchRes.json()

    const titleResult = searchData.title_results?.[0]
    if (!titleResult) return []

    // Get streaming sources (PL region only — free plan doesn't support US)
    const sourcesUrl = `${BASE}/title/${titleResult.id}/sources/?apiKey=${KEY}&regions=PL`
    const sourcesRes = await fetch(sourcesUrl, { cache: "no-store" })
    if (!sourcesRes.ok) return []

    const sources: StreamingSource[] = await sourcesRes.json()

    const seen = new Set<string>()
    function dedup(list: StreamingSource[]) {
      return list.filter((s) => {
        if (seen.has(s.name)) return false
        seen.add(s.name)
        return true
      })
    }

    // Prefer sub/free; fall back to rent if nothing found
    const subFree = dedup(sources.filter((s) => s.type === "sub" || s.type === "free"))
    if (subFree.length > 0) return subFree.slice(0, 5)

    return dedup(sources.filter((s) => s.type === "rent")).slice(0, 3)
  } catch {
    return []
  }
}
