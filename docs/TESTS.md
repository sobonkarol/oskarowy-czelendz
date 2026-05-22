# Dokumentacja testów jednostkowych

## Przegląd

Projekt używa **Vitest 4** jako frameworku testowego. Testy są zlokalizowane w katalogu `__tests__/` i odzwierciedlają strukturę katalogu `lib/` oraz `app/api/`.

```
__tests__/
  lib/
    utils.test.ts         # Funkcje pomocnicze
    oscar-data.test.ts    # Integralność danych historycznych
    watchmode.test.ts     # Logika streamingu
    tmdb.test.ts          # Pobieranie danych filmowych
  api/
    register.test.ts      # Endpoint rejestracji
    ratings.test.ts       # Endpoint ocen (GET/POST/DELETE)
```

### Wyniki

```
Test Files  6 passed (6)
      Tests  101 passed (101)
   Duration  ~300ms
```

---

## Uruchamianie testów

```bash
# Jednorazowe uruchomienie (np. w CI)
npm test

# Tryb watch — przeładowuje przy każdej zmianie pliku
npm run test:watch

# Raport pokrycia kodu
npm run test:coverage
```

---

## Konfiguracja

**`vitest.config.ts`** — konfiguracja Vitest:

```typescript
export default defineConfig({
  test: {
    globals: true,      // expect, describe, it bez importu
    environment: "node" // środowisko Node.js (nie jsdom)
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") } // alias @/ → katalog główny
  },
})
```

Testy działają w środowisku Node.js — nie wymagają DOM ani przeglądarki. Mocki zewnętrznych zależności (fetch, Prisma, NextAuth) tworzone są za pomocą `vi.mock()` i `vi.stubGlobal()`.

---

## Opis plików testowych

### `__tests__/lib/utils.test.ts` — 23 testy

Testy czystych funkcji z `lib/utils.ts`. Nie wymagają żadnych mocków.

#### `formatScore(score: number | null): string`

| Test | Wejście | Oczekiwane wyjście |
|---|---|---|
| Null daje myślnik | `null` | `"–"` |
| Liczba całkowita | `7` | `"7.0"` |
| Dziesiętna | `8.5` | `"8.5"` |
| Zero | `0` | `"0.0"` |
| Zaokrąglenie IEEE 754 | `7.35` | `"7.3"` ¹ |

> ¹ `7.35` w IEEE 754 to faktycznie `7.3499...`, więc `toFixed(1)` daje `"7.3"`, nie `"7.4"`.

#### `getScoreColor(score: number): string`

Testowane są wszystkie cztery przedziały i dokładne wartości graniczne:

| Przedział | Klasa CSS |
|---|---|
| `score >= 8` | `"text-emerald-400"` |
| `score >= 6` | `"text-yellow-400"` |
| `score >= 4` | `"text-orange-400"` |
| `score < 4` | `"text-red-400"` |

Granice `4.0`, `6.0` i `8.0` testowane są osobno (wartość spełniająca i o epsilon poniżej warunku).

#### `getInitials(firstName, lastName): string`

Pokryte przypadki: normalne imiona, małe litery (uppercase), puste stringi, brakujące imię lub nazwisko.

#### `cn(...inputs): string`

Testowane: łączenie klas, wartości falsy (`false`, `undefined`, `null`), rozwiązywanie konfliktów Tailwind (np. `p-2` + `p-4` → `p-4`), obiekty warunkowe.

---

### `__tests__/lib/oscar-data.test.ts` — 20 testów

Testy integralności statycznych danych historycznych z `lib/oscar-data.ts`. Nie wymagają żadnych mocków.

#### Testy strukturalne (iterują po wszystkich 98 latach)

- Każdy rok ma **dokładnie jednego zwycięzcę** (`isWinner: true`)
- Brak zduplikowanych lat ceremonii
- Każdy nominowany ma niepuste `title` i `director`
- `releaseYear` mieści się w przedziale `(1900, 2030)`
- `releaseYear <= ceremonyYear` dla każdego roku

#### Testy faktów historycznych (konkretne wartości)

| Fakt | Test |
|---|---|
| 1929: 3 nominacje | `oscarData[1929]` ma długość 3 |
| Zdobywca 1929 | Wings (William A. Wellman) |
| 1933: 8 nominacji | Grand Hotel (Edmund Goulding) |
| 1935: 12 nominacji | It Happened One Night (Frank Capra) |
| Citizen Kane przegrał | `isWinner: false` w 1942 |
| Od 1945: 5 nominacji | Wszystkie lata 1945–2009 mają 5 nominacji |
| All About Eve wygrało w 1951 | + Sunset Boulevard nie wygrał |
| 2026: 10 nominacji | |

---

### `__tests__/lib/watchmode.test.ts` — 14 testów

#### `getPlatformMeta(name: string)` — 7 testów

Funkcja czysta (lookup w stałej `PLATFORM_META`). Testowane są znane platformy (Netflix, Disney+, MAX, MUBI, Canal+) oraz fallback dla nieznanej platformy (szary kolor `#6B7280`, pierwsza litera nazwy).

#### `getStreamingSources(tmdbId: number)` — 7 testów

Funkcja asynchroniczna wywołująca dwukrotnie zewnętrzne API (Watchmode). Fetch jest mockowany via `vi.stubGlobal("fetch", vi.fn())`.

Helper `mockFetch(...responses)` pozwala na sekwencyjne zwracanie różnych odpowiedzi:

```typescript
function mockFetch(...responses: Array<{ ok: boolean; data?: unknown }>) {
  let call = 0
  vi.mocked(fetch).mockImplementation(async () => {
    const r = responses[call++] ?? { ok: false }
    return { ok: r.ok, json: async () => r.data } as Response
  })
}
```

| Scenariusz | Oczekiwany wynik |
|---|---|
| Pierwsze API zwraca błąd (non-ok) | `[]` |
| Brak wyników wyszukiwania | `[]` |
| Drugie API zwraca błąd | `[]` |
| 6 źródeł sub/free | max 5 wyników, wszystkie `sub`/`free` |
| Tylko źródła rent | max 3 wyniki, wszystkie `rent` |
| Zduplikowane platformy | deduplikacja po nazwie |
| Sub/free + rent w odpowiedzi | zwraca tylko sub/free |
| Wyjątek sieci (fetch throws) | `[]` (błąd złapany w catch) |
| Tylko źródła `buy` | `[]` (typ `buy` jest ignorowany) |

---

### `__tests__/lib/tmdb.test.ts` — 12 testów

Fetch mockowany via `vi.stubGlobal`. Używany jest stały obiekt `mockMovie` (uproszczony `TmdbMovie`).

#### `searchTmdbMovie(title, year)` — 9 testów

| Scenariusz | Oczekiwany wynik |
|---|---|
| Znaleziono z rokiem | Zwraca pierwsze wynik, 1 wywołanie fetch |
| Puste wyniki z rokiem | Retry bez roku, 2 wywołania fetch |
| Pierwsze wywołanie non-ok | `null`, brak retry |
| Oba wywołania zwracają puste | `null` |
| Retry zwraca non-ok | `null` |
| URL zawiera `year=1977` | Weryfikacja parametru |
| URL nie zawiera `year=` przy retry | Weryfikacja braku parametru |
| URL zawiera zakodowany tytuł | `%20` dla spacji (nie `+`) |

> **Uwaga:** `encodeURIComponent` koduje spacje jako `%20`, nie `+`. Test dokumentuje tę właściwość.

#### `getTmdbMovieById(tmdbId)` — 3 testy

Sukces, non-ok odpowiedź (zwraca `null`), obecność `/movie/42` i `language=pl-PL` w URL.

---

### `__tests__/api/register.test.ts` — 10 testów

Mockowane moduły:
- `@/lib/prisma` — `prisma.user.findUnique`, `prisma.user.create`
- `bcryptjs` — `hash` zwraca stałą `"hashed_password"`

Requesty konstruowane są jako `NextRequest` (natywne API Next.js 15):

```typescript
function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}
```

| Test | Status |
|---|---|
| Brak `firstName` | 400 |
| Brak `lastName` | 400 |
| Brak `email` | 400 |
| Brak `password` | 400 |
| Hasło krótsze niż 6 znaków | 400, komunikat zawiera "6" |
| Hasło dokładnie 6 znaków | OK (nie 400) |
| Email już istnieje w DB | 409 |
| Poprawna rejestracja | 201, `{ success: true }` |
| Hasło hashowane bcrypt z 12 rundami | `bcrypt.hash("plaintext", 12)` wywołany |
| Plain-text nigdy nie trafia do DB | `createCall.data.password !== "plaintext"` |

---

### `__tests__/api/ratings.test.ts` — 22 testy

Mockowane moduły:
- `@/auth` — `auth` zwraca `mockSession` lub `null`
- `@/lib/prisma` — `prisma.rating.upsert`, `deleteMany`, `findMany`

```typescript
const mockSession = { user: { id: "user-123", email: "test@test.com", name: "Test User" } }
```

#### `POST /api/ratings` — 10 testów

| Test | Status |
|---|---|
| Brak sesji | 401 |
| Brak `movieId` | 400 |
| Brak `score` | 400 |
| `score = 0` (poniżej minimum) | 400 |
| `score = 11` (powyżej maksimum) | 400 |
| `score = "eight"` (string zamiast liczby) | 400 |
| `score = 1` (minimum) | 200 |
| `score = 10` (maksimum) | 200 |
| Wywołanie upsert z `userId` i `movieId` | Weryfikacja argumentów Prismy |
| Odpowiedź zawiera ocenę | `body.id`, `body.score` |

#### `DELETE /api/ratings` — 4 testy

Brak sesji (401), brak `movieId` (400), wywołanie `deleteMany` z prawidłowym `where`, odpowiedź `{ ok: true }`.

#### `GET /api/ratings` — 4 testy (+ 4 weryfikacje argumentów)

Brak sesji (401), wszystkie oceny użytkownika bez filtru, filtrowanie po roku (`?year=2024`), weryfikacja `include.movie.select`.

---

## Strategia mockowania

### Zewnętrzne API (fetch)

```typescript
beforeEach(() => { vi.stubGlobal("fetch", vi.fn()) })
afterEach(() => { vi.unstubAllGlobals() })
```

`vi.stubGlobal` podmienia globalny `fetch` w środowisku Node.js. `vi.unstubAllGlobals()` przywraca oryginał po każdym teście, zapewniając izolację.

### Moduły Node.js (Prisma, NextAuth, bcrypt)

```typescript
vi.mock("@/lib/prisma", () => ({
  prisma: {
    rating: { upsert: vi.fn(), deleteMany: vi.fn(), findMany: vi.fn() },
  },
}))
```

`vi.mock()` jest hoistowany przed importami — Prisma nigdy nie próbuje połączyć się z bazą danych podczas testów.

### Czyszczenie stanu między testami

```typescript
beforeEach(() => { vi.clearAllMocks() })
```

Czyści wywołania i implementacje mocków przed każdym testem, zapobiegając wyciekom stanu.

---

## Co nie jest testowane

| Obszar | Powód |
|---|---|
| Komponenty React | Wymagałyby jsdom + @testing-library/react; logika UI pokryta jest E2E |
| Strony Next.js (server components) | Integrują wiele warstw (DB + auth + UI); właściwy obszar dla testów E2E |
| Seed script | Jednorazowy skrypt operacyjny, nie logika domenowa |
| Auth JWT/session callbacks | Cienka warstwa przekazująca dane z tokenu do sesji |

---

## CI

Testy uruchamiane są automatycznie przez GitHub Actions przy każdym Pull Requeście i pushu na `main`. Konfiguracja: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

Branch `main` jest chroniony — merge jest niemożliwy, gdy testy nie przechodzą.
