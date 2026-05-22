const BASE = "https://api.themoviedb.org/3"
const KEY = process.env.TMDB_API_KEY!
export const TMDB_IMG = "https://image.tmdb.org/t/p/w500"
export const TMDB_IMG_LARGE = "https://image.tmdb.org/t/p/w780"

export type TmdbMovie = {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date: string
  vote_average: number
}

export async function searchTmdbMovie(
  title: string,
  year: number
): Promise<TmdbMovie | null> {
  const url = `${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(title)}&year=${year}&language=pl-PL`
  const res = await fetch(url, { next: { revalidate: 86400 } })
  if (!res.ok) return null
  const data = await res.json()

  if (data.results?.length > 0) return data.results[0]

  // Retry without year constraint
  const url2 = `${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(title)}&language=pl-PL`
  const res2 = await fetch(url2, { next: { revalidate: 86400 } })
  if (!res2.ok) return null
  const data2 = await res2.json()
  return data2.results?.[0] ?? null
}

export async function getTmdbMovieById(tmdbId: number): Promise<TmdbMovie | null> {
  const url = `${BASE}/movie/${tmdbId}?api_key=${KEY}&language=pl-PL`
  const res = await fetch(url, { next: { revalidate: 86400 } })
  if (!res.ok) return null
  return res.json()
}
