import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TMDB_IMG } from "@/lib/tmdb"
import { formatScore, getScoreColor, getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Trophy, Star, Medal, Film } from "lucide-react"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function RankingPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Top films by avg score (min 1 rating)
  const topMovies = await prisma.movie.findMany({
    where: { ratings: { some: {} } },
    include: {
      ratings: { select: { score: true } },
    },
    orderBy: { ratings: { _count: "desc" } },
  })

  const moviesRanked = topMovies
    .map(m => ({
      id: m.id,
      title: m.title,
      director: m.director,
      ceremonyYear: m.ceremonyYear,
      isWinner: m.isWinner,
      posterPath: m.posterPath,
      avgScore: m.ratings.reduce((s, r) => s + r.score, 0) / m.ratings.length,
      ratingCount: m.ratings.length,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 50)

  // Top users by number of ratings & avg score
  const users = await prisma.user.findMany({
    where: { ratings: { some: {} } },
    include: {
      ratings: { select: { score: true } },
    },
    orderBy: { ratings: { _count: "desc" } },
    take: 50,
  })

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true },
  })

  const usersRanked = users
    .map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      avatarUrl: u.avatarUrl,
      ratingCount: u.ratings.length,
      avgScore: u.ratings.reduce((s, r) => s + r.score, 0) / u.ratings.length,
    }))
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 50)

  const meIndex = usersRanked.findIndex(u => u.id === session.user.id)

  const medalColors = ["text-yellow-400", "text-gray-300", "text-amber-600"]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-7 h-7 text-(--gold)" />
        <h1 className="font-playfair font-bold text-3xl text-(--text-primary)">Ranking</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Users ranking */}
        <div>
          <h2 className="font-playfair font-semibold text-xl text-(--text-primary) mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-(--gold)" />
            Ranking użytkowników
          </h2>
          <p className="text-sm text-(--text-secondary) mb-5">
            Posortowani wg liczby ocenionych filmów
          </p>

          <div className="space-y-2">
            {usersRanked.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-(--text-muted)">
                Brak ocen. Bądź pierwszy!
              </div>
            ) : (
              usersRanked.map((u, i) => {
                const isMe = u.id === session.user.id
                return (
                  <div
                    key={u.id}
                    className={cn(
                      "glass rounded-xl px-4 py-3 flex items-center gap-3 transition-all",
                      isMe && "ring-1 ring-(--gold) ring-opacity-60 bg-(--gold-muted)"
                    )}
                  >
                    <span className={cn("w-7 text-center font-bold text-sm", medalColors[i] ?? "text-(--text-muted)")}>
                      {i < 3 ? <Medal className="w-4 h-4 mx-auto" /> : `#${i + 1}`}
                    </span>

                    <div className="w-9 h-9 rounded-full winner-badge flex items-center justify-center text-xs font-bold text-black shrink-0 overflow-hidden">
                      {u.avatarUrl
                        ? <span className="text-lg leading-none">{u.avatarUrl}</span>
                        : getInitials(u.firstName, u.lastName)
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-(--text-primary) text-sm truncate">
                        {u.firstName} {u.lastName}
                        {isMe && <span className="text-xs text-(--gold) ml-2">(Ty)</span>}
                      </div>
                      <div className="text-xs text-(--text-muted)">{u.ratingCount} ocenionych</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={cn("font-bold text-sm", getScoreColor(u.avgScore))}>
                        {formatScore(u.avgScore)}
                      </div>
                      <div className="text-xs text-(--text-muted)">śr.</div>
                    </div>
                  </div>
                )
              })
            )}

            {meIndex === -1 && (
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 ring-1 ring-(--gold) ring-opacity-30 border-dashed border-(--border)">
                <span className="w-7 text-center text-sm text-(--text-muted)">–</span>
                <div className="w-9 h-9 rounded-full winner-badge flex items-center justify-center text-xs font-bold text-black overflow-hidden">
                  {currentUser?.avatarUrl
                    ? <span className="text-lg leading-none">{currentUser.avatarUrl}</span>
                    : getInitials(session.user.firstName, session.user.lastName)
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-(--text-primary) truncate">
                    {session.user.firstName} {session.user.lastName}
                    <span className="text-xs text-(--gold) ml-2">(Ty)</span>
                  </div>
                  <div className="text-xs text-(--text-muted) truncate">Jeszcze nie oceniłeś żadnego filmu</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Films ranking */}
        <div>
          <h2 className="font-playfair font-semibold text-xl text-(--text-primary) mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-(--gold)" />
            Top filmy
          </h2>
          <p className="text-sm text-(--text-secondary) mb-5">
            Najwyżej oceniane filmy przez społeczność
          </p>

          <div className="space-y-2">
            {moviesRanked.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center text-(--text-muted)">
                <Film className="w-10 h-10 mx-auto mb-3 opacity-30" />
                Brak ocen filmów
              </div>
            ) : (
              moviesRanked.map((m, i) => (
                <div key={m.id} className="glass rounded-xl flex items-center gap-3 overflow-hidden glass-hover">
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
                    <div className="text-xs text-(--text-muted) truncate">{m.ceremonyYear} · {m.ratingCount} głosów</div>
                  </div>

                  <div className="text-right px-3 py-2 shrink-0">
                    <div className={cn("font-bold", getScoreColor(m.avgScore))}>
                      {formatScore(m.avgScore)}
                    </div>
                    <div className="text-xs text-(--text-muted)">/10</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
