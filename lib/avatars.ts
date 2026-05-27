export type PresetAvatar = {
  id: string
  label: string
  emoji: string
}

export const PRESET_AVATARS: PresetAvatar[] = [
  // Animated Oscar winners / nominees
  { id: "simba",      label: "Simba",           emoji: "🦁" },
  { id: "shrek",      label: "Shrek",           emoji: "🧌" },
  { id: "woody",      label: "Woody",           emoji: "🤠" },
  { id: "nemo",       label: "Nemo",            emoji: "🐟" },
  { id: "remy",       label: "Remy",            emoji: "🐀" },
  { id: "walle",      label: "WALL-E",          emoji: "🤖" },
  { id: "panda",      label: "Po",              emoji: "🐼" },
  { id: "fox",        label: "Lis",             emoji: "🦊" },
  { id: "dragon",     label: "Smok",            emoji: "🐉" },
  { id: "mermaid",    label: "Arielka",         emoji: "🧜" },
  // Iconic film characters
  { id: "scooby",     label: "Scooby-Doo",      emoji: "🐕" },
  { id: "kermit",     label: "Kermit",          emoji: "🐸" },
  { id: "gandalf",    label: "Gandalf",         emoji: "🧙" },
  { id: "et",         label: "E.T.",            emoji: "👽" },
  { id: "jaws",       label: "Szczęki",         emoji: "🦈" },
  { id: "jack",       label: "Jack Skellington",emoji: "🎃" },
  { id: "penguin",    label: "Happy Feet",      emoji: "🐧" },
  { id: "ghost",      label: "Duch",            emoji: "👻" },
  { id: "unicorn",    label: "Jednorożec",      emoji: "🦄" },
  { id: "paddington", label: "Paddington",      emoji: "🐻" },
]

// Set of allowed emoji values stored in DB
export const PRESET_AVATAR_EMOJIS = new Set(PRESET_AVATARS.map(a => a.emoji))
