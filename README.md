# Oskarowy Czelendż 🏆

Aplikacja webowa do śledzenia i oceniania filmów nominowanych do Oscara w kategorii Najlepszy Film — od pierwszej ceremonii w 1929 roku do dziś. Użytkownicy rejestrują się, wystawiają oceny w skali 1–10 i rywalizują w rankingu.

## Demo

> Wdróż własną instancję korzystając z instrukcji poniżej.

---

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Baza danych | PostgreSQL (Neon) via Prisma v7 |
| Auth | NextAuth v5 (Credentials + JWT) |
| Plakaty filmowe | TMDB API |
| Dostępność streamingowa | Watchmode API |
| Testy | Vitest 4 |
| CI | GitHub Actions |

---

## Architektura

```
app/
  page.tsx              # Strona główna / landing
  login/                # Logowanie
  register/             # Rejestracja
  dashboard/            # Panel główny (lista lat)
  movies/[year]/        # Filmy z danej ceremonii
  ranking/              # Ranking użytkowników i filmów
  api/
    auth/register/      # POST  — rejestracja użytkownika
    auth/[...nextauth]/ # NextAuth handler
    ratings/            # GET / POST / DELETE — oceny filmów

components/
  navbar.tsx            # Nawigacja
  year-card.tsx         # Kafelek roku na dashboardzie
  movie-card.tsx        # Karta nominowanego filmu
  rating-widget.tsx     # Widget gwiazdkowy 1–10
  streaming-badges.tsx  # Odznaki platform streamingowych
  platform-logo.tsx     # SVG logo każdej platformy
  progress-stats.tsx    # Statystyki postępu użytkownika

lib/
  oscar-data.ts         # Dane o nominacjach 1929–2026 (statyczne)
  prisma.ts             # Singleton klienta Prisma
  tmdb.ts               # Pobieranie metadanych filmów z TMDB
  watchmode.ts          # Pobieranie źródeł streamingowych
  utils.ts              # Pomocnicze funkcje (cn, formatScore, …)

prisma/
  schema.prisma         # Schemat bazy danych
  seed.ts               # Seed: pobiera dane z TMDB i wypełnia DB
```

### Schemat bazy danych

```
User
  id, firstName, lastName, email, password (bcrypt), createdAt

Movie
  id, tmdbId, title, director, ceremonyYear, releaseYear
  posterPath, overview, isWinner
  streamingData (JSON cache), streamingCachedAt

Rating
  id, score (1–10), userId → User, movieId → Movie
  createdAt, updatedAt
  @@unique([userId, movieId])
```

---

## Uruchomienie lokalne

### Wymagania

- Node.js 20+
- Konto [Neon](https://neon.tech) (PostgreSQL)
- Klucz API [TMDB](https://www.themoviedb.org/settings/api)
- Klucz API [Watchmode](https://api.watchmode.com/)

### Instalacja

```bash
git clone https://github.com/sobonkarol/oskarowy-czelendz
cd oskarowy-czelendz
npm install
```

### Zmienne środowiskowe

Utwórz plik `.env` w katalogu głównym:

```env
# Baza danych (Neon PostgreSQL)
# DATABASE_URL — pooled connection string z Neon Dashboard (zakładka "Connection pooling")
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
# DIRECT_URL — bezpośredni connection string (bez -pooler) — używany przez Prisma CLI
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# NextAuth — wygeneruj: openssl rand -base64 32
AUTH_SECRET="twój-sekretny-klucz"

# TMDB
TMDB_API_KEY="twój-klucz-tmdb"

# Watchmode
WATCHMODE_API_KEY="twój-klucz-watchmode"
```

### Inicjalizacja bazy danych

```bash
# Zastosuj schemat
npm run db:push

# Wypełnij danymi filmów (pobiera z TMDB — może potrwać kilka minut)
npm run seed
```

### Uruchomienie

```bash
npm run dev
# http://localhost:3000
```

---

## Wdrożenie na Vercel

### Jeden klik

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sobonkarol/oskarowy-czelendz)

### Ręcznie

1. Importuj repozytorium w [Vercel Dashboard](https://vercel.com/new)
2. Dodaj zmienne środowiskowe (sekcja **Environment Variables**):

| Zmienna | Wymagana | Opis |
|---|---|---|
| `DATABASE_URL` | tak | Pooled connection string z Neon (zakładka "Connection pooling" w Dashboard) |
| `DIRECT_URL` | tak | Bezpośredni connection string z Neon (bez `-pooler`) — dla migracji |
| `AUTH_SECRET` | tak | Losowy sekret dla NextAuth (min. 32 znaki) |
| `TMDB_API_KEY` | tak | Klucz API z themoviedb.org |
| `WATCHMODE_API_KEY` | tak | Klucz API z api.watchmode.com |

3. Kliknij **Deploy** — Vercel uruchomi `npm install` (automatycznie odpala `prisma generate` via `postinstall`), a następnie `next build`.

4. Po pierwszym wdrożeniu wykonaj seed bazy danych (jednorazowo):

```bash
DATABASE_URL="twój-connection-string" npm run seed
```

### Uwagi

- **Prisma client** generowany jest automatycznie przy każdym `npm install` dzięki `"postinstall": "prisma generate"`. Folder `app/generated/prisma/` jest gitignorowany — nie należy go commitować.
- **Streaming cache** — dostępność platform cache'owana jest w bazie przez 7 dni, by nie przekraczać limitów bezpłatnego planu Watchmode (tylko region PL).
- **TMDB cache** — odpowiedzi TMDB cache'owane przez Next.js przez 24 h (`revalidate: 86400`).
- **Sesje** — strategia JWT; brak sesji w bazie danych.
- **Connection pooling** — `DATABASE_URL` musi wskazywać na pooled endpoint Neon (hostname z `-pooler`). `DIRECT_URL` bez poolera jest wymagany dla `prisma db push` i migracji.

### Keep-alive (eliminacja cold startów Neon)

Na darmowym planie Neon baza zasypia po ~5 minutach bezczynności. Aby temu zapobiec, skonfiguruj darmowy cron na [cron-job.org](https://cron-job.org):

1. Zarejestruj się na cron-job.org (darmowe)
2. Utwórz nowy job: `GET https://twoja-domena.vercel.app/api/ping`
3. Ustaw interwał: **co 4 minuty**

Endpoint `/api/ping` wykonuje `SELECT 1` — utrzymuje połączenie aktywne bez żadnych kosztów.

---

## Skrypty npm

```bash
npm run dev           # Serwer developerski (http://localhost:3000)
npm run build         # Build produkcyjny
npm run start         # Serwer produkcyjny
npm run seed          # Wypełnij bazę danych filmami z TMDB
npm run db:push       # Zastosuj schemat Prisma do bazy
npm run db:studio     # Otwórz Prisma Studio (GUI bazy danych)
npm test              # Uruchom testy jednostkowe (jednorazowo)
npm run test:watch    # Testy w trybie watch (podczas developmentu)
npm run test:coverage # Testy z raportem pokrycia kodu
```

---

## Funkcjonalności

- **98 ceremonii Oscarów** — pełna lista nominacji Best Picture od 1929 do 2026
- **Ocenianie filmów** — skala 1–10, możliwość edycji i usunięcia oceny
- **Plakaty filmów** — pobierane z TMDB (500 px)
- **Platformy streamingowe** — aktualne dane z Watchmode dla regionu PL (Netflix, MAX, Disney+, Canal+, Player.pl i inne)
- **Dashboard** — postęp oceniania z podziałem na lata, pasek postępu, oznaczenie ukończonych lat
- **Ranking** — top 50 użytkowników wg liczby ocen, top 50 filmów wg średniej oceny społeczności
- **Rejestracja i logowanie** — konto chronione hasłem (bcrypt, 12 rund), sesja JWT
- **Responsywny interfejs** — mobile-first, glass morphism, złota kolorystyka oscarowa

---

## CI / CD

Każdy Pull Request uruchamia automatyczny pipeline w GitHub Actions (`.github/workflows/ci.yml`):

1. Checkout kodu
2. Setup Node.js 20
3. `npm ci`
4. `npm test` — 101 testów jednostkowych musi przejść

Branch `main` jest chroniony: merge jest zablokowany dopóki job **Unit Tests** nie zakończy się zielonym statusem.

Szczegółowa dokumentacja testów: [docs/TESTS.md](docs/TESTS.md)

---

## Licencja

MIT
