"use client"

import Image from "next/image"
import { Trophy, Star, User, Cog } from "lucide-react"
import { TMDB_IMG } from "@/lib/tmdb"
import { cn, formatScore, getScoreColor } from "@/lib/utils"
import RatingWidget from "./rating-widget"
import StreamingBadges from "./streaming-badges"
import { useState } from "react"

type Movie = {
  id: string
  title: string
  director: string
  posterPath: string | null
  isWinner: boolean
  userScore: number | null
  avgScore: number | null
  ratingCount: number
  streaming: { name: string; web_url: string }[]
}

type Props = { movie: Movie; index: number }

export default function MovieCard({ movie, index }: Props) {
  const [userScore, setUserScore] = useState(movie.userScore)
  const [isPending, setIsPending] = useState(false)

  return (
    <div
      data-movie-title={movie.title}
      className={cn(
        "group relative glass glass-hover rounded-2xl overflow-hidden",
        movie.isWinner && "ring-1 ring-(--gold) ring-opacity-60"
      )}
    >
      {/* Loading overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
          <Cog className="w-9 h-9 text-(--gold) animate-spin" />
        </div>
      )}

      <div className="flex gap-4 p-4">
        {/* Poster */}
        <div className="relative shrink-0 w-24 h-36 rounded-xl overflow-hidden bg-white/5">
          {movie.posterPath ? (
            <Image
              src={`${TMDB_IMG}${movie.posterPath}`}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="96px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-(--text-muted)">
              <User className="w-8 h-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-1 left-1 right-1 text-center text-[10px] text-(--text-muted) font-mono">
            #{index + 1}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {movie.isWinner && (
              <div className="inline-flex items-center gap-1 winner-badge rounded-full px-2 py-0.5 text-xs font-bold mb-1.5">
                <Trophy className="w-3 h-3" />
                Zdobywca Oscara
              </div>
            )}
            <h3 className={cn(
              "font-playfair font-semibold text-base leading-tight mb-1",
              movie.isWinner ? "text-(--gold)" : "text-(--text-primary)"
            )}>
              {movie.title}
            </h3>
            <p className="text-xs text-(--text-secondary) mb-2">
              reż. {movie.director}
            </p>
            <StreamingBadges sources={movie.streaming} />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-(--text-secondary)">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-(--gold) text-(--gold)" />
                <span className={cn("font-semibold", movie.avgScore ? getScoreColor(movie.avgScore) : "")}>
                  {formatScore(movie.avgScore)}
                </span>
                <span className="text-(--text-muted)">({movie.ratingCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="px-4 pb-4">
        <div className="border-t border-(--border) pt-3">
          <RatingWidget
            movieId={movie.id}
            initialScore={userScore}
            onRate={setUserScore}
            onPendingChange={setIsPending}
          />
        </div>
      </div>
    </div>
  )
}
