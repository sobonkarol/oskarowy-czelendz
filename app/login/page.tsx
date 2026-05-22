"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)
    if (res?.error) {
      setError("Nieprawidłowy email lub hasło")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 winner-badge rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <h1 className="font-playfair font-bold text-3xl text-(--text-primary) mb-2">Witaj z powrotem</h1>
          <p className="text-(--text-secondary)">Zaloguj się i kontynuuj czelendż</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm text-(--text-secondary)">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-white/5 border border-(--border) rounded-xl px-4 py-3 text-(--text-primary) placeholder-[var(--text-muted)] focus:outline-none focus:border-(--gold) transition-colors"
              placeholder="ty@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-(--text-secondary)">Hasło</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-(--border) rounded-xl px-4 py-3 pr-12 text-(--text-primary) placeholder-[var(--text-muted)] focus:outline-none focus:border-(--gold) transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary)"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl winner-badge font-semibold text-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>

          <p className="text-center text-sm text-(--text-secondary)">
            Nie masz konta?{" "}
            <Link href="/register" className="text-(--gold) hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
