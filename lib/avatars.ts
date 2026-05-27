const BASE = "https://api.dicebear.com/9.x/avataaars/svg"
const BG = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"]

function url(seed: string, bgIndex: number) {
  return `${BASE}?seed=${seed}&backgroundColor=${BG[bgIndex % BG.length]}`
}

export type PresetAvatar = {
  id: string
  label: string
  url: string
}

export const PRESET_AVATARS: PresetAvatar[] = [
  // Actresses
  { id: "meryl", label: "Meryl", url: url("meryl", 0) },
  { id: "audrey", label: "Audrey", url: url("audrey", 1) },
  { id: "cate", label: "Cate", url: url("cate", 2) },
  { id: "viola", label: "Viola", url: url("viola", 3) },
  { id: "natalie", label: "Natalie", url: url("natalie", 4) },
  { id: "charlize", label: "Charlize", url: url("charlize", 0) },
  { id: "halle", label: "Halle", url: url("halle", 1) },
  { id: "julia", label: "Julia", url: url("julia", 2) },
  // Actors
  { id: "denzel", label: "Denzel", url: url("denzel", 3) },
  { id: "morgan", label: "Morgan", url: url("morgan", 4) },
  { id: "tom", label: "Tom", url: url("tomhanks", 0) },
  { id: "leo", label: "Leonardo", url: url("leonardo", 1) },
  { id: "marlon", label: "Marlon", url: url("marlon", 2) },
  { id: "jack", label: "Jack", url: url("jacknick", 3) },
  // Cartoon / fairy-tale characters
  { id: "simba", label: "Simba", url: url("simba", 4) },
  { id: "elsa", label: "Elsa", url: url("elsa", 0) },
  { id: "woody", label: "Woody", url: url("woody", 1) },
  { id: "hermione", label: "Hermione", url: url("hermione", 2) },
  { id: "gandalf", label: "Gandalf", url: url("gandalf", 3) },
  { id: "shrek", label: "Shrek", url: url("shrek", 4) },
]

export const PRESET_AVATAR_URLS = new Set(PRESET_AVATARS.map(a => a.url))
