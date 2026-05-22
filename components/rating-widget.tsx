"use client"

import { useState, useTransition, useEffect } from "react"
import { Star, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  movieId: string
  initialScore: number | null
  onRate?: (score: number | null) => void
  onPendingChange?: (pending: boolean) => void
}

export default function RatingWidget({ movieId, initialScore, onRate, onPendingChange }: Props) {
  const [hovered, setHovered] = useState(0)
  const [score, setScore] = useState(initialScore)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    onPendingChange?.(pending)
  }, [pending])

  const active = hovered || score || 0

  async function handleRate(value: number) {
    setScore(value)
    onRate?.(value)
    startTransition(async () => {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, score: value }),
      })
    })
  }

  async function handleClear() {
    setScore(null)
    onRate?.(null)
    startTransition(async () => {
      await fetch("/api/ratings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      })
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1 star-rating" onMouseLeave={() => setHovered(0)}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            disabled={pending}
            onMouseEnter={() => setHovered(n)}
            onClick={() => handleRate(n)}
            className="star focus:outline-none"
            aria-label={`Ocena ${n}`}
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                n <= active
                  ? "fill-[var(--gold)] text-[var(--gold)]"
                  : "fill-transparent text-[var(--text-muted)]"
              )}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
        {score ? (
          <>
            <span className="text-(--gold) font-semibold">{score}/10</span>
            <button
              onClick={handleClear}
              disabled={pending}
              className="flex items-center gap-0.5 text-(--text-muted) hover:text-red-400 transition-colors text-xs"
              aria-label="Usuń ocenę"
            >
              <X className="w-3 h-3" />
              usuń
            </button>
          </>
        ) : (
          <span>Oceń film</span>
        )}
      </div>
    </div>
  )
}
