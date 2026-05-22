import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number | null): string {
  if (score === null) return "–"
  return score.toFixed(1)
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400"
  if (score >= 6) return "text-yellow-400"
  if (score >= 4) return "text-orange-400"
  return "text-red-400"
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}
