import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UserCircle } from "lucide-react"
import AvatarPicker from "./_components/AvatarPicker"
import PasswordForm from "./_components/PasswordForm"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true, firstName: true, lastName: true, email: true },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <UserCircle className="w-7 h-7 text-[var(--gold)]" />
        <h1 className="font-playfair font-bold text-3xl text-[var(--text-primary)]">
          Ustawienia profilu
        </h1>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <p className="text-[var(--text-muted)] text-sm mb-1">Zalogowany jako</p>
        <p className="text-[var(--text-primary)] font-semibold">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-[var(--text-secondary)] text-sm">{user?.email}</p>
      </div>

      <div className="mb-6">
        <AvatarPicker currentAvatarUrl={user?.avatarUrl ?? null} />
      </div>

      <PasswordForm />
    </div>
  )
}
