import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { oscarData } from "@/lib/oscar-data"
import { notFound, redirect } from "next/navigation"
import { getStreamingSources } from "@/lib/watchmode"
import MovieCard from "@/components/movie-card"
import Link from "next/link"
import { ArrowLeft, Trophy, Film } from "lucide-react"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ year: string }> }

export default async function MoviesPage({ params }: Props) {
  const session = await auth()
  if (!session) redirect("/login")

  const { year: yearParam } = await params
  const year = parseInt(yearParam, 10)

  const nominees = oscarData[year]
  if (!nominees) notFound()

  const userId = session.user.id

  // Fetch movies from DB
  const movies = await prisma.movie.findMany({
    where: { ceremonyYear: year },
    include: {
      ratings: {
        select: { score: true, userId: true },
      },
    },
  })

  // Refresh streaming data if stale (>7 days) or missing
  const now = new Date()
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

  await Promise.all(
    movies
      .filter(
        m =>
          m.tmdbId &&
          (!m.streamingCachedAt ||
            now.getTime() - m.streamingCachedAt.getTime() > SEVEN_DAYS)
      )
      .map(async m => {
        const sources = await getStreamingSources(m.tmdbId!)
        await prisma.movie.update({
          where: { id: m.id },
          data: {
            streamingData: sources as object[],
            streamingCachedAt: now,
          },
        })
        m.streamingData = sources as object[]
        m.streamingCachedAt = now
      })
  )

  // Re-fetch after updates
  const refreshed = await prisma.movie.findMany({
    where: { ceremonyYear: year },
    include: { ratings: { select: { score: true, userId: true } } },
  })

  const winner = nominees.find(n => n.isWinner)
  const prev = year > 1980 ? year - 1 : null
  const next = year < 2025 ? year + 1 : null

  type StreamSource = { name: string; web_url: string }

  const cards = refreshed
    .sort((a, b) => (b.isWinner ? 1 : 0) - (a.isWinner ? 1 : 0))
    .map(m => {
      const userRating = m.ratings.find(r => r.userId === userId)
      const avgScore =
        m.ratings.length > 0
          ? m.ratings.reduce((s, r) => s + r.score, 0) / m.ratings.length
          : null
      const rawStreaming = (m.streamingData ?? []) as StreamSource[]

      return {
        id: m.id,
        title: m.title,
        director: m.director,
        posterPath: m.posterPath,
        isWinner: m.isWinner,
        userScore: userRating?.score ?? null,
        avgScore,
        ratingCount: m.ratings.length,
        streaming: rawStreaming,
      }
    })

  const ratedCount = cards.filter(c => c.userScore !== null).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </Link>
        <div className="flex items-center gap-2">
          {prev && (
            <Link
              href={`/movies/${prev}`}
              className="px-3 py-1.5 rounded-lg glass text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              ← {prev}
            </Link>
          )}
          {next && (
            <Link
              href={`/movies/${next}`}
              className="px-3 py-1.5 rounded-lg glass text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              {next} →
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-playfair font-bold text-5xl gold-text">{year}</span>
          <span className="text-(--text-muted) text-sm pt-2">Ceremonia Oscarów</span>
        </div>
        {winner && (
          <div className="flex items-center gap-2 mt-2">
            <Trophy className="w-4 h-4 text-(--gold)" />
            <p className="text-(--text-secondary) text-sm">
              Zdobywca: <span className="text-(--gold) font-semibold">{winner.title}</span>
            </p>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3">
          <Film className="w-4 h-4 text-(--text-muted)" />
          <span className="text-sm text-(--text-secondary)">
            {ratedCount}/{cards.length} ocenionych
          </span>
          <div className="flex-1 max-w-32 bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-(--gold) to-(--gold-light)"
              style={{ width: `${(ratedCount / cards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Movie grid */}
      {cards.length === 0 ? (
        <div className="text-center py-20 text-(--text-muted)">
          <Film className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Dane filmów są ładowane. Odśwież stronę za chwilę.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
