import PlatformLogo from "./platform-logo"

type Source = { name: string; web_url: string }

type Props = { sources: Source[] }

export default function StreamingBadges({ sources }: Props) {
  if (!sources.length) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <a
          key={s.name}
          href={s.web_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-sm transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-1 focus:ring-white/40"
          title={s.name}
          aria-label={s.name}
          style={{ width: 40, height: 24 }}
        >
          <PlatformLogo name={s.name} />
        </a>
      ))}
    </div>
  )
}
