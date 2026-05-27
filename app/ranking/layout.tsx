import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Navbar from "@/components/navbar"

export default async function RankingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session} avatarUrl={user?.avatarUrl ?? null} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
