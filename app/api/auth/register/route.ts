import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { firstName, lastName, email, password } = body

  if (
    typeof firstName !== "string" || !firstName.trim() ||
    typeof lastName !== "string" || !lastName.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    return NextResponse.json({ error: "Wszystkie pola są wymagane" }, { status: 400 })
  }

  if (firstName.length > 50 || lastName.length > 50) {
    return NextResponse.json({ error: "Imię i nazwisko mogą mieć maksymalnie 50 znaków" }, { status: 400 })
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Nieprawidłowy adres email" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Hasło musi mieć co najmniej 6 znaków" }, { status: 400 })
  }

  if (password.length > 128) {
    return NextResponse.json({ error: "Hasło może mieć maksymalnie 128 znaków" }, { status: 400 })
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
