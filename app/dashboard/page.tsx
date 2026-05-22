import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { oscarData, CEREMONY_YEARS, TOTAL_FILMS } from "@/lib/oscar-data"
import YearCard from "@/components/year-card"
import ProgressStats from "@/components/progress-stats"
import { Trophy } from "lucide-react"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const userId = session.user.id

  const ratings = await prisma.rating.findMany({
    where: { userId },
    include: { movie: { select: { ceremonyYear: true } } },
  })

  const ratedByYear: Record<number, number> = {}
  for (const r of ratings) {
    const y = r.movie.ceremonyYear
    ratedByYear[y] = (ratedByYear[y] ?? 0) + 1
  }

  const avgScore =
    ratings.length > 0
      ? ratings.reduce((sum: number, r) => sum + r.score, 0) / ratings.length
      : null

  const completedYears = CEREMONY_YEARS.filter(
    y => (ratedByYear[y] ?? 0) >= (oscarData[y]?.length ?? 0)
  ).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7 text-(--gold)" />
          <h1 className="font-playfair font-bold text-3xl text-(--text-primary)">
            Oskarowy Czelendż
          </h1>
        </div>
        <p className="text-(--text-secondary) ml-10">
          Witaj, <span className="text-(--text-primary)">{session.user.firstName}</span>!
          Wybierz rok i zacznij oceniać nominacje do Oscara.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10">
        <ProgressStats
          totalFilms={TOTAL_FILMS}
          ratedFilms={ratings.length}
          avgScore={avgScore}
          completedYears={completedYears}
          totalYears={CEREMONY_YEARS.length}
        />
      </div>

      {/* Year grid */}
      <div>
        <h2 className="font-playfair font-semibold text-xl text-(--text-primary) mb-5">
          Wybierz rok ceremonii
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CEREMONY_YEARS.map(year => {
            const nominees = oscarData[year] ?? []
            const winner = nominees.find(n => n.isWinner)
            return (
              <YearCard
                key={year}
                year={year}
                winnerTitle={winner?.title ?? "–"}
                totalFilms={nominees.length}
                ratedFilms={ratedByYear[year] ?? 0}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
