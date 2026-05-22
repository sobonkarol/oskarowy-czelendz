import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { oscarData } from "../lib/oscar-data"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const TMDB_KEY = process.env.TMDB_API_KEY ?? "f444a77f642f0982dbc23fda35d86cf6"
const TMDB_BASE = "https://api.themoviedb.org/3"

async function searchTmdb(title: string, year: number) {
  const url = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&year=${year}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.results?.length > 0) return data.results[0]

  // Retry without year
  const url2 = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`
  const res2 = await fetch(url2)
  const data2 = await res2.json()
  return data2.results?.[0] ?? null
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  console.log("🎬 Seeding Oscar nominees database...")
  let total = 0
  let found = 0

  for (const [yearStr, nominees] of Object.entries(oscarData)) {
    const ceremonyYear = parseInt(yearStr)
    console.log(`\n📅 ${ceremonyYear} (${nominees.length} films)`)

    for (const nominee of nominees) {
      total++
      try {
        const tmdb = await searchTmdb(nominee.title, nominee.releaseYear)
        await sleep(150) // Stay within TMDB rate limits

        const existing = await prisma.movie.findFirst({
          where: {
            title: nominee.title,
            ceremonyYear,
          },
        })

        const data = {
          title: nominee.title,
          director: nominee.director,
          ceremonyYear,
          releaseYear: nominee.releaseYear,
          isWinner: nominee.isWinner,
          tmdbId: tmdb?.id ?? null,
          posterPath: tmdb?.poster_path ?? null,
          overview: tmdb?.overview ?? null,
        }

        if (existing) {
          await prisma.movie.update({ where: { id: existing.id }, data })
          if (tmdb) found++
          process.stdout.write(tmdb ? "✓" : "○")
        } else {
          await prisma.movie.create({ data })
          if (tmdb) found++
          process.stdout.write(tmdb ? "+" : "·")
        }
      } catch (err) {
        process.stdout.write("✗")
        console.error(`\n  Error for "${nominee.title}":`, err)
      }
    }
  }

  console.log(`\n\n✅ Done! ${found}/${total} films matched with TMDB data.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
