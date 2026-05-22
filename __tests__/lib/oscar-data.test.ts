import { describe, it, expect } from "vitest"
import { oscarData, type OscarNominee } from "@/lib/oscar-data"

const years = Object.keys(oscarData).map(Number)
const allEntries = Object.entries(oscarData) as [string, OscarNominee[]][]

describe("oscar-data structure", () => {
  it("contains entries for all years from 1929 to 2026", () => {
    expect(years).toContain(1929)
    expect(years).toContain(1970)
    expect(years).toContain(2026)
    expect(Math.min(...years)).toBe(1929)
    expect(Math.max(...years)).toBe(2026)
  })

  it("has no duplicate ceremony years", () => {
    const unique = new Set(years)
    expect(unique.size).toBe(years.length)
  })

  it("every year has at least one nominee", () => {
    for (const [year, nominees] of allEntries) {
      expect(nominees.length, `Year ${year} has no nominees`).toBeGreaterThan(0)
    }
  })

  it("every year has exactly one winner", () => {
    for (const [year, nominees] of allEntries) {
      const winners = nominees.filter((n) => n.isWinner)
      expect(winners.length, `Year ${year} should have exactly 1 winner`).toBe(1)
    }
  })

  it("every nominee has a non-empty title and director", () => {
    for (const [year, nominees] of allEntries) {
      for (const n of nominees) {
        expect(n.title, `Year ${year}: empty title`).toBeTruthy()
        expect(n.director, `Year ${year}: "${n.title}" has empty director`).toBeTruthy()
      }
    }
  })

  it("every nominee has a valid releaseYear", () => {
    for (const [year, nominees] of allEntries) {
      for (const n of nominees) {
        expect(n.releaseYear, `Year ${year}: "${n.title}" releaseYear invalid`).toBeGreaterThan(1900)
        expect(n.releaseYear).toBeLessThan(2030)
      }
    }
  })

  it("releaseYear is always before or equal to ceremonyYear", () => {
    for (const [yearStr, nominees] of allEntries) {
      const ceremonyYear = Number(yearStr)
      for (const n of nominees) {
        expect(
          n.releaseYear,
          `Year ${ceremonyYear}: "${n.title}" releaseYear ${n.releaseYear} >= ceremonyYear`
        ).toBeLessThanOrEqual(ceremonyYear)
      }
    }
  })
})

describe("oscar-data known facts", () => {
  it("1929 (1st ceremony) has exactly 3 nominees", () => {
    expect(oscarData[1929]).toHaveLength(3)
  })

  it("Wings won the 1929 ceremony", () => {
    const winner = oscarData[1929].find((n) => n.isWinner)
    expect(winner?.title).toBe("Wings")
  })

  it("1933 (5th ceremony) has 8 nominees", () => {
    expect(oscarData[1933]).toHaveLength(8)
  })

  it("Grand Hotel won the 1933 ceremony", () => {
    const winner = oscarData[1933].find((n) => n.isWinner)
    expect(winner?.title).toBe("Grand Hotel")
  })

  it("1935 (7th ceremony) has 12 nominees", () => {
    expect(oscarData[1935]).toHaveLength(12)
  })

  it("It Happened One Night won in 1935", () => {
    const winner = oscarData[1935].find((n) => n.isWinner)
    expect(winner?.title).toBe("It Happened One Night")
    expect(winner?.director).toBe("Frank Capra")
  })

  it("Gone with the Wind won in 1940", () => {
    const winner = oscarData[1940].find((n) => n.isWinner)
    expect(winner?.title).toBe("Gone with the Wind")
  })

  it("Citizen Kane was nominated in 1942 but did not win", () => {
    const entry = oscarData[1942].find((n) => n.title === "Citizen Kane")
    expect(entry).toBeDefined()
    expect(entry?.isWinner).toBe(false)
  })

  it("Casablanca won in 1944 with correct director", () => {
    const winner = oscarData[1944].find((n) => n.isWinner)
    expect(winner?.title).toBe("Casablanca")
    expect(winner?.director).toBe("Michael Curtiz")
  })

  it("1945 (17th ceremony) onwards has exactly 5 nominees", () => {
    const modernYears = years.filter((y) => y >= 1945 && y <= 2009)
    for (const y of modernYears) {
      expect(oscarData[y], `Year ${y}`).toHaveLength(5)
    }
  })

  it("All About Eve won in 1951 with 5 nominees", () => {
    expect(oscarData[1951]).toHaveLength(5)
    const winner = oscarData[1951].find((n) => n.isWinner)
    expect(winner?.title).toBe("All About Eve")
  })

  it("Sunset Boulevard was nominated in 1951 but did not win", () => {
    const entry = oscarData[1951].find((n) => n.title === "Sunset Boulevard")
    expect(entry).toBeDefined()
    expect(entry?.isWinner).toBe(false)
  })

  it("The Godfather won in 1973", () => {
    const winner = oscarData[1973].find((n) => n.isWinner)
    expect(winner?.title).toBe("The Godfather")
  })

  it("2026 ceremony has 10 nominees", () => {
    expect(oscarData[2026]).toHaveLength(10)
  })
})
