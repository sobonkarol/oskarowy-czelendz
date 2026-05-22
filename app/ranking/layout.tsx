import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"

export default async function RankingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
