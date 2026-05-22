"use client"

const FF = "-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"

// Each logo is a self-contained <svg> — no arrays, no key warnings

function Netflix() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#141414"/>
      <rect x="8" y="4" width="4" height="16" fill="#E50914"/>
      <polygon points="8,4 12,4 32,20 28,20" fill="#E50914"/>
      <rect x="28" y="4" width="4" height="16" fill="#E50914"/>
    </svg>
  )
}

function Max() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#002BE7"/>
      <text x="20" y="16" textAnchor="middle" fill="white"
        fontSize="12" fontWeight="900" fontFamily={FF} letterSpacing="0.5">max</text>
    </svg>
  )
}

function DisneyPlus() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#0D1232"/>
      <text x="20" y="12" textAnchor="middle" fill="white"
        fontSize="8" fontWeight="700" fontFamily={FF} letterSpacing="1">DISNEY</text>
      <text x="20" y="21.5" textAnchor="middle" fill="#89CFF0"
        fontSize="9" fontWeight="900" fontFamily={FF}>+</text>
    </svg>
  )
}

function PrimeVideo() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#232F3E"/>
      <text x="20" y="12" textAnchor="middle" fill="white"
        fontSize="8.5" fontWeight="800" fontFamily={FF} letterSpacing="0.3">prime</text>
      <path d="M11,19 Q20,23 29,19" stroke="#00A8E0" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <polygon points="28,16.5 31.5,19 28,19.5" fill="#00A8E0"/>
    </svg>
  )
}

function AppleTv() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#000000"/>
      <text x="20" y="12" textAnchor="middle" fill="white"
        fontSize="7" fontWeight="400" fontFamily={FF} letterSpacing="0.5">Apple</text>
      <text x="20" y="21.5" textAnchor="middle" fill="white"
        fontSize="8.5" fontWeight="700" fontFamily={FF}>TV+</text>
    </svg>
  )
}

function YouTube() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#FF0000"/>
      <rect x="8" y="5" width="24" height="14" rx="3" fill="white"/>
      <polygon points="17,9 17,16 25,12.5" fill="#FF0000"/>
    </svg>
  )
}

function Amazon() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#131A22"/>
      <text x="20" y="13" textAnchor="middle" fill="white"
        fontSize="8" fontWeight="700" fontFamily={FF} letterSpacing="0.3">amazon</text>
      <path d="M11,18 Q20,22 29,18" stroke="#FF9900" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <polygon points="28,15.5 31.5,18 28,18.5" fill="#FF9900"/>
    </svg>
  )
}

function RakutenTv() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#BF0000"/>
      <text x="20" y="11.5" textAnchor="middle" fill="white"
        fontSize="7" fontWeight="700" fontFamily={FF} letterSpacing="0.5">RAKUTEN</text>
      <text x="20" y="21" textAnchor="middle" fill="white"
        fontSize="9" fontWeight="900" fontFamily={FF} letterSpacing="1">TV</text>
    </svg>
  )
}

function SkyShowtime() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B2244"/>
          <stop offset="100%" stopColor="#1A3A6E"/>
        </linearGradient>
      </defs>
      <rect width="40" height="24" rx="4" fill="url(#sky)"/>
      <text x="20" y="12" textAnchor="middle" fill="white"
        fontSize="9" fontWeight="900" fontFamily={FF} letterSpacing="1.5">SKY</text>
      <text x="20" y="21" textAnchor="middle" fill="#A0B8D8"
        fontSize="6.5" fontWeight="500" fontFamily={FF} letterSpacing="0.3">showtime</text>
    </svg>
  )
}

function Chili() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="chili" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8C00"/>
          <stop offset="100%" stopColor="#E63000"/>
        </linearGradient>
      </defs>
      <rect width="40" height="24" rx="4" fill="url(#chili)"/>
      <text x="20" y="16.5" textAnchor="middle" fill="white"
        fontSize="11" fontWeight="800" fontFamily={FF} letterSpacing="0.5">chili</text>
    </svg>
  )
}

function Mubi() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#1A1A2E"/>
      <text x="20" y="16.5" textAnchor="middle" fill="#E76B2E"
        fontSize="11" fontWeight="900" fontFamily={FF} letterSpacing="1">MUBI</text>
    </svg>
  )
}

function CanalPlus() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#000000"/>
      <text x="20" y="11.5" textAnchor="middle" fill="white"
        fontSize="7.5" fontWeight="600" fontFamily={FF} letterSpacing="0.5">CANAL</text>
      <text x="20" y="21.5" textAnchor="middle" fill="#FF0000"
        fontSize="10" fontWeight="900" fontFamily={FF}>+</text>
    </svg>
  )
}

function PlayerPl() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#E4000F"/>
      <polygon points="11,7 11,17 20,12" fill="white"/>
      <text x="29" y="16" textAnchor="middle" fill="white"
        fontSize="9" fontWeight="800" fontFamily={FF}>pl</text>
    </svg>
  )
}

function Hulu() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#1CE783"/>
      <text x="20" y="16.5" textAnchor="middle" fill="#1A1A1A"
        fontSize="11" fontWeight="800" fontFamily={FF}>hulu</text>
    </svg>
  )
}

function Peacock() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#000000"/>
      <text x="20" y="16" textAnchor="middle" fill="#E30074"
        fontSize="8.5" fontWeight="700" fontFamily={FF} letterSpacing="0.3">Peacock</text>
    </svg>
  )
}

function Polsat() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#E31E24"/>
      <text x="20" y="16" textAnchor="middle" fill="white"
        fontSize="9" fontWeight="700" fontFamily={FF}>Polsat</text>
    </svg>
  )
}

function Tvp() {
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#003087"/>
      <text x="20" y="16.5" textAnchor="middle" fill="white"
        fontSize="12" fontWeight="900" fontFamily={FF} letterSpacing="1">TVP</text>
    </svg>
  )
}

function Fallback({ name }: { name: string }) {
  const label = name.length > 6 ? name.slice(0, 5) + "…" : name
  return (
    <svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="24" rx="4" fill="#374151"/>
      <text x="20" y="15.5" textAnchor="middle" fill="white"
        fontSize="8" fontWeight="700" fontFamily={FF}>{label}</text>
    </svg>
  )
}

const MAP: Record<string, () => React.ReactElement> = {
  netflix: Netflix,
  max: Max,
  "hbo max": Max,
  "disney+": DisneyPlus,
  "prime video": PrimeVideo,
  "amazon prime video": PrimeVideo,
  amazon: Amazon,
  "apple tv+": AppleTv,
  appletv: AppleTv,
  "apple tv": AppleTv,
  youtube: YouTube,
  "rakuten tv": RakutenTv,
  skyshowtime: SkyShowtime,
  chili: Chili,
  mubi: Mubi,
  "canal+": CanalPlus,
  "player.pl": PlayerPl,
  hulu: Hulu,
  peacock: Peacock,
  polsat: Polsat,
  tvp: Tvp,
}

export default function PlatformLogo({ name }: { name: string }) {
  const Logo = MAP[name.toLowerCase().trim()] ?? (() => <Fallback name={name} />)
  return <Logo />
}
