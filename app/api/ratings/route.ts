import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { movieId, score } = await req.json()

  if (!movieId || typeof score !== "number" || score < 1 || score > 10) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const rating = await prisma.rating.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    update: { score },
    create: { userId: session.user.id, movieId, score },
  })

  return NextResponse.json(rating)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { movieId } = await req.json()
  if (!movieId) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

  await prisma.rating.deleteMany({
    where: { userId: session.user.id, movieId },
  })

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = searchParams.get("year")

  const where = year
    ? { userId: session.user.id, movie: { ceremonyYear: parseInt(year) } }
    : { userId: session.user.id }

  const ratings = await prisma.rating.findMany({
    where,
    include: { movie: { select: { id: true, title: true, ceremonyYear: true } } },
  })

  return NextResponse.json(ratings)
}
