import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()

  if (typeof currentPassword !== "string" || typeof newPassword !== "string" ||
      !currentPassword || !newPassword) {
    return NextResponse.json({ error: "Wymagane oba hasła" }, { status: 400 })
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Hasło musi mieć min. 6 znaków" }, { status: 400 })
  }
  if (newPassword.length > 128) {
    return NextResponse.json({ error: "Hasło jest za długie" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "Użytkownik nie istnieje" }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return NextResponse.json({ error: "Nieprawidłowe aktualne hasło" }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return NextResponse.json({ ok: true })
}
