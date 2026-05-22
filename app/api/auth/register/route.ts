import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json()

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Wszystkie pola są wymagane" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Hasło musi mieć co najmniej 6 znaków" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Ten email jest już zajęty" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { firstName, lastName, email, password: hashed },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
