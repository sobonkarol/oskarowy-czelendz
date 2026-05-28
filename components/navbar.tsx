"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Film, BarChart3, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Session } from "next-auth"

type Props = { session: Session; avatarUrl?: string | null }

export default function Navbar({ session, avatarUrl }: Props) {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  const initials = `${session.user.firstName?.[0] ?? ""}${session.user.lastName?.[0] ?? ""}`.toUpperCase()

  const links = [
    { href: "/", label: "Lata", icon: Film },
    { href: "/ranking", label: "Ranking", icon: BarChart3 },
  ]

  const avatar = avatarUrl && !avatarUrl.startsWith("http") ? (
    <span className="text-base leading-none">{avatarUrl}</span>
  ) : (
    <span className="text-xs font-bold text-black">{initials}</span>
  )

  return (
    <nav className="sticky top-0 z-50 glass border-b border-(--border)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden group-hover:scale-110 transition-transform shrink-0" style={{ background: "#07070c", boxShadow: "0 0 0 1px rgba(212,168,67,0.3)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
                <rect width="32" height="32" rx="7" fill="#07070c"/>
                <circle cx="16" cy="7" r="3.5" fill="#d4a843"/>
                <rect x="14.8" y="10.5" width="2.4" height="2" fill="#d4a843"/>
                <polygon points="10.5,12.5 21.5,12.5 19.5,20 12.5,20" fill="#d4a843"/>
                <rect x="9" y="20" width="14" height="3" rx="1" fill="#d4a843"/>
                <rect x="7" y="23" width="18" height="3.5" rx="1.5" fill="#c49232"/>
                <circle cx="14.5" cy="5.8" r="1" fill="#f5c842" opacity="0.6"/>
              </svg>
            </div>
            <span className="font-playfair font-bold text-lg gold-text hidden sm:block">
              Oskarowy Czelendż
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  path === href
                    ? "bg-(--gold-muted) text-(--gold)"
                    : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/profile"
                title="Ustawienia profilu"
                className={cn(
                  "w-8 h-8 rounded-full winner-badge flex items-center justify-center overflow-hidden transition-transform hover:scale-110",
                  path === "/profile" && "ring-2 ring-(--gold) ring-offset-1 ring-offset-(--bg-primary)"
                )}
              >
                {avatar}
              </Link>
              <span className="text-sm text-(--text-secondary)">
                {session.user.firstName}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="hidden md:flex items-center gap-1 text-sm text-(--text-muted) hover:text-red-400 transition-colors px-2 py-1 rounded"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              className="md:hidden p-2 text-(--text-secondary)"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-(--border) p-4 space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                path === href
                  ? "bg-(--gold-muted) text-(--gold)"
                  : "text-(--text-secondary)"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between px-4 py-3 border-t border-(--border) mt-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm text-(--text-secondary)"
            >
              <div className="w-7 h-7 rounded-full winner-badge flex items-center justify-center overflow-hidden">
                {avatar}
              </div>
              {session.user.firstName} {session.user.lastName}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Wyloguj
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
