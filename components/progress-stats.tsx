import { Trophy, Film, Star, TrendingUp } from "lucide-react"
import { formatScore } from "@/lib/utils"

type Props = {
  totalFilms: number
  ratedFilms: number
  avgScore: number | null
  completedYears: number
  totalYears: number
}

export default function ProgressStats({ totalFilms, ratedFilms, avgScore, completedYears, totalYears }: Props) {
  const stats = [
    {
      label: "Ocenione filmy",
      value: `${ratedFilms}/${totalFilms}`,
      icon: Film,
      sub: `${Math.round((ratedFilms / totalFilms) * 100)}%`,
    },
    {
      label: "Ukończone lata",
      value: `${completedYears}/${totalYears}`,
      icon: Trophy,
      sub: "lat",
    },
    {
      label: "Twoja średnia",
      value: formatScore(avgScore),
      icon: Star,
      sub: "/ 10",
    },
    {
      label: "Postęp",
      value: `${Math.round((ratedFilms / totalFilms) * 100)}%`,
      icon: TrendingUp,
      sub: "ukończono",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, sub }) => (
        <div key={label} className="glass rounded-xl p-4 text-center">
          <Icon className="w-5 h-5 text-[var(--gold)] mx-auto mb-2" />
          <div className="font-playfair font-bold text-xl gold-text">{value}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
          <div className="text-xs text-[var(--text-secondary)]">{sub}</div>
        </div>
      ))}
    </div>
  )
}
