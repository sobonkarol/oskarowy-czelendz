"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { X, Trophy, Star, Users } from "lucide-react"
import { TMDB_IMG } from "@/lib/tmdb"
import { formatScore, getScoreColor, getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"

type UserRating = {
  score: number
  user: { id: string; firstName: string; lastName: string; avatarUrl: string | null }
}

type Movie = {
  id: string
  title: string
  director: string
  ceremonyYear: number
  isWinner: boolean
  posterPath: string | null
}

type Props = {
  movieId: string | null
  onClose: () => void
}

export default function MovieRatingsModal({ movieId, onClose }: Props) {
  const [data, setData] = useState<{ movie: Movie; ratings: UserRating[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!movieId) { setData(null); return }
    setLoading(true)
    fetch(`/api/movies/${movieId}/ratings`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [movieId])

  useEffect(() => {
    if (!movieId) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [movieId, onClose])

  if (!movieId) return null

  const avg = data
    ? data.ratings.reduce((s, r) => s + r.score, 0) / (data.ratings.length || 1)
    : null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div data-testid="ratings-modal" className="glass rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-(--border)">
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-(--border)">
          {data?.movie.posterPath && (
            <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 shadow-lg">
              <Image
                src={`${TMDB_IMG}${data.movie.posterPath}`}
                alt={data.movie.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 pt-0.5">
            {loading ? (
              <div className="h-5 w-48 bg-white/10 rounded animate-pulse mb-2" />
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  {data?.movie.isWinner && (
                    <Trophy className="w-4 h-4 text-(--gold) shrink-0" />
                  )}
                  <h2 className="font-playfair font-bold text-lg text-(--text-primary) leading-tight">
                    {data?.movie.title}
                  </h2>
                </div>
                <p className="text-sm text-(--text-muted) mt-0.5">
                  {data?.movie.ceremonyYear} · {data?.movie.director}
                </p>
                {avg !== null && data && data.ratings.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-3.5 h-3.5 text-(--gold)" />
                    <span className={cn("font-bold text-sm", getScoreColor(avg))}>
                      {formatScore(avg)}
                    </span>
                    <span className="text-xs text-(--text-muted)">
                      śr. · {data.ratings.length} {data.ratings.length === 1 ? "ocena" : "ocen"}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <button
            aria-label="Zamknij popup"
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-3.5 w-32 bg-white/10 rounded animate-pulse mb-1.5" />
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-8 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : data?.ratings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-(--text-muted)">
              <Users className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Nikt jeszcze nie ocenił tego filmu</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.ratings.map((r, i) => (
                <div
                  key={r.user.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span className="w-5 text-center text-xs text-(--text-muted) shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-full winner-badge flex items-center justify-center text-xs font-bold text-black shrink-0 overflow-hidden">
                    {r.user.avatarUrl
                      ? <span className="text-lg leading-none">{r.user.avatarUrl}</span>
                      : getInitials(r.user.firstName, r.user.lastName)
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-(--text-primary) truncate">
                      {r.user.firstName} {r.user.lastName}
                    </div>
                  </div>
                  <div className={cn("font-bold text-sm shrink-0", getScoreColor(r.score))}>
                    {r.score}
                    <span className="text-xs font-normal text-(--text-muted)">/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
