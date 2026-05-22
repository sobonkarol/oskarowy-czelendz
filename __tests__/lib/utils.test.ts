import { describe, it, expect } from "vitest"
import { formatScore, getScoreColor, getInitials, cn } from "@/lib/utils"

describe("formatScore", () => {
  it("returns em dash for null", () => {
    expect(formatScore(null)).toBe("–")
  })

  it("formats integer with one decimal place", () => {
    expect(formatScore(7)).toBe("7.0")
    expect(formatScore(10)).toBe("10.0")
    expect(formatScore(1)).toBe("1.0")
  })

  it("formats decimal with one decimal place", () => {
    expect(formatScore(8.5)).toBe("8.5")
    expect(formatScore(6.3)).toBe("6.3")
  })

  it("rounds to one decimal place", () => {
    // Note: 7.35 is stored as 7.3499... in IEEE 754, so toFixed(1) gives "7.3"
    expect(formatScore(7.35)).toBe("7.3")
    expect(formatScore(7.34)).toBe("7.3")
    expect(formatScore(7.36)).toBe("7.4")
  })

  it("handles zero", () => {
    expect(formatScore(0)).toBe("0.0")
  })
})

describe("getScoreColor", () => {
  it("returns emerald for scores >= 8", () => {
    expect(getScoreColor(8)).toBe("text-emerald-400")
    expect(getScoreColor(9)).toBe("text-emerald-400")
    expect(getScoreColor(10)).toBe("text-emerald-400")
  })

  it("returns yellow for scores >= 6 and < 8", () => {
    expect(getScoreColor(6)).toBe("text-yellow-400")
    expect(getScoreColor(7)).toBe("text-yellow-400")
    expect(getScoreColor(7.9)).toBe("text-yellow-400")
  })

  it("returns orange for scores >= 4 and < 6", () => {
    expect(getScoreColor(4)).toBe("text-orange-400")
    expect(getScoreColor(5)).toBe("text-orange-400")
    expect(getScoreColor(5.9)).toBe("text-orange-400")
  })

  it("returns red for scores < 4", () => {
    expect(getScoreColor(3)).toBe("text-red-400")
    expect(getScoreColor(1)).toBe("text-red-400")
    expect(getScoreColor(3.9)).toBe("text-red-400")
  })

  it("handles boundary exactly at 8", () => {
    expect(getScoreColor(7.999)).toBe("text-yellow-400")
    expect(getScoreColor(8.0)).toBe("text-emerald-400")
  })

  it("handles boundary exactly at 6", () => {
    expect(getScoreColor(5.999)).toBe("text-orange-400")
    expect(getScoreColor(6.0)).toBe("text-yellow-400")
  })

  it("handles boundary exactly at 4", () => {
    expect(getScoreColor(3.999)).toBe("text-red-400")
    expect(getScoreColor(4.0)).toBe("text-orange-400")
  })
})

describe("getInitials", () => {
  it("returns uppercase initials from first and last name", () => {
    expect(getInitials("Jan", "Kowalski")).toBe("JK")
    expect(getInitials("Anna", "Nowak")).toBe("AN")
  })

  it("uppercases lowercase names", () => {
    expect(getInitials("jan", "kowalski")).toBe("JK")
  })

  it("handles single-character names", () => {
    expect(getInitials("J", "K")).toBe("JK")
  })

  it("handles empty lastName gracefully", () => {
    expect(getInitials("Jan", "")).toBe("J")
  })

  it("handles empty firstName gracefully", () => {
    expect(getInitials("", "Nowak")).toBe("N")
  })

  it("handles both empty strings", () => {
    expect(getInitials("", "")).toBe("")
  })
})

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("ignores falsy values", () => {
    expect(cn("foo", false && "bar", undefined, null, "baz")).toBe("foo baz")
  })

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("text-red-400", "text-blue-400")).toBe("text-blue-400")
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("handles conditional classes via objects", () => {
    expect(cn({ "text-gold": true, "text-red": false })).toBe("text-gold")
  })

  it("returns empty string with no valid inputs", () => {
    expect(cn(false, undefined, null)).toBe("")
  })
})
