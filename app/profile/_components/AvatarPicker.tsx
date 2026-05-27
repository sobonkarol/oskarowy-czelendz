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

      <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 mb-6">
        {PRESET_AVATARS.map((avatar) => {
          const isSelected = selected === avatar.emoji
          return (
            <button
              key={avatar.id}
              onClick={() => { setSelected(avatar.emoji); setSaved(false) }}
              title={avatar.label}
              aria-label={`Avatar: ${avatar.label}`}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200",
                isSelected
                  ? "bg-[var(--gold-muted)] scale-105"
                  : "hover:bg-white/5 opacity-70 hover:opacity-100"
              )}
            >
              <span
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                  "bg-white/5 border-2 transition-colors",
                  isSelected ? "border-[var(--gold)] shadow-md shadow-[var(--gold)]/20" : "border-transparent"
                )}
              >
                {avatar.emoji}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] leading-tight text-center truncate w-full">
                {avatar.label}
              </span>
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--gold)] rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}
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
