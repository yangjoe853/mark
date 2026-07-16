'use client'

interface Stat {
  label: string
  value: string | number
  sub?: string
}

interface StatsBarProps {
  stats: Stat[]
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      className="w-full grid grid-cols-2 gap-3 fade-up"
      style={{ animationDelay: '0.2s' }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center py-4 px-3 rounded-xl gap-0.5"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 4px oklch(0.22 0.01 60 / 0.04)',
          }}
        >
          <span
            className="font-sans font-bold text-2xl leading-none"
            style={{ color: 'var(--mark)' }}
          >
            {stat.value}
          </span>
          {stat.sub && (
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5 leading-none">
              {stat.sub}
            </span>
          )}
          <span className="text-xs text-muted-foreground font-sans mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
