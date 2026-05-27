import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PRESET_AVATAR_EMOJIS } from "@/lib/avatars"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { avatarUrl } = await req.json()

  if (avatarUrl !== null && (typeof avatarUrl !== "string" || !PRESET_AVATAR_EMOJIS.has(avatarUrl))) {
    return NextResponse.json({ error: "Invalid avatar" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: avatarUrl ?? null },
  })

  return NextResponse.json({ ok: true, avatarUrl })
}
