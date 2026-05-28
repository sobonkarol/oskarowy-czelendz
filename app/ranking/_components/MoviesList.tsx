"use client"

import { useState } from "react"
import Image from "next/image"
import { Trophy, Film } from "lucide-react"
import { TMDB_IMG } from "@/lib/tmdb"
import { formatScore, getScoreColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import MovieRatingsModal from "./MovieRatingsModal"

type Movie = {
  id: string
  title: string
  ceremonyYear: number
  isWinner: boolean
  posterPath: string | null
  avgScore: number
  ratingCount: number
}

export default function MoviesList({ movies }: { movies: Movie[] }) {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null)

  if (movies.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center text-(--text-muted)">
        <Film className="w-10 h-10 mx-auto mb-3 opacity-30" />
        Brak ocen filmów
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {movies.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setSelectedMovieId(m.id)}
            className="w-full glass rounded-xl flex items-center gap-3 overflow-hidden glass-hover text-left transition-all hover:ring-1 hover:ring-[var(--gold)]/30 active:scale-[0.99]"
          >
            <div className="w-10 text-center text-xs font-bold text-(--text-muted) px-2 shrink-0">
              #{i + 1}
            </div>

            <div className="relative w-10 h-14 shrink-0">
              {m.posterPath ? (
                <Image
                  src={`${TMDB_IMG}${m.posterPath}`}
                  alt={m.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Film className="w-4 h-4 text-(--text-muted)" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 py-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {m.isWinner && <Trophy className="w-3 h-3 text-(--gold) shrink-0" />}
                <span className="text-sm font-medium text-(--text-primary) truncate">
                  {m.title}
                </span>
              </div>
              <div className="text-xs text-(--text-muted) truncate">
                {m.ceremonyYear} · {m.ratingCount} {m.ratingCount === 1 ? "głos" : "głosów"}
              </div>
            </div>

            <div className="text-right px-3 py-2 shrink-0">
              <div className={cn("font-bold", getScoreColor(m.avgScore))}>
                {formatScore(m.avgScore)}
              </div>
              <div className="text-xs text-(--text-muted)">/10</div>
            </div>
          </button>
        ))}
      </div>

      <MovieRatingsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </>
  )
}
