"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PRESET_AVATARS } from "@/lib/avatars"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AvatarPicker({ currentAvatarUrl }: { currentAvatarUrl: string | null }) {
  const [selected, setSelected] = useState(currentAvatarUrl)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSave() {
    if (!selected || selected === currentAvatarUrl) return
    setSaving(true)
    const res = await fetch("/api/profile/avatar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: selected }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    }
  }

  const isDirty = selected !== currentAvatarUrl

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-playfair font-semibold text-xl text-[var(--text-primary)] mb-1">Awatar</h2>
      <p className="text-[var(--text-muted)] text-sm mb-6">Wybierz swojego bohatera filmowego</p>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
        {PRESET_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => { setSelected(avatar.url); setSaved(false) }}
            title={avatar.label}
            aria-label={`Avatar: ${avatar.label}`}
            className={cn(
              "relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200",
              selected === avatar.url
                ? "border-[var(--gold)] scale-105 shadow-lg shadow-[var(--gold)]/20"
                : "border-transparent hover:border-[var(--border-hover)] opacity-60 hover:opacity-100"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
            {selected === avatar.url && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-[var(--gold)] rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="px-6 py-2 rounded-lg text-sm font-medium bg-[var(--gold)] text-black hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Zapisuję..." : "Zapisz awatar"}
        </button>
        {saved && <span className="text-sm text-green-400">Zapisano ✓</span>}
      </div>
    </div>
  )
}
