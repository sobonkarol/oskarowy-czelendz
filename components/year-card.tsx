"use client"

import Link from "next/link"
import { Trophy, Film, CheckCircle, Cog } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type Props = {
  year: number
  winnerTitle: string
  totalFilms: number
  ratedFilms: number
}

export default function YearCard({ year, winnerTitle, totalFilms, ratedFilms }: Props) {
  const progress = totalFilms > 0 ? (ratedFilms / totalFilms) * 100 : 0
  const isComplete = ratedFilms === totalFilms && totalFilms > 0
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Link href={`/movies/${year}`} className="block group" onClick={() => setIsLoading(true)}>
      <div className={cn(
        "relative glass glass-hover rounded-2xl p-5 h-full flex flex-col gap-3 cursor-pointer select-none",
        isComplete && "ring-1 ring-(--gold) ring-opacity-40"
      )}>
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
            <Cog className="w-8 h-8 text-(--gold) animate-spin" />
          </div>
        )}

        <div className="flex items-start justify-between">
          <span className="font-playfair font-bold text-3xl gold-text">{year}</span>
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Film className="w-5 h-5 text-(--text-muted) group-hover:text-(--gold) transition-colors shrink-0" />
          )}
        </div>

        <div className="flex items-start gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-(--gold) shrink-0 mt-0.5" />
          <p className="text-xs text-(--text-secondary) leading-tight line-clamp-2">
            {winnerTitle}
          </p>
        </div>

        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between text-xs text-(--text-muted)">
            <span>{ratedFilms}/{totalFilms} ocenionych</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete ? "bg-emerald-400" : "bg-linear-to-r from-(--gold) to-(--gold-light)"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
