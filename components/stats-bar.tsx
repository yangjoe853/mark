'use client'

interface Stat {
  label: string
  value: string | number
}

interface StatsBarProps {
  stats: Stat[]
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      className="w-full grid fade-up"
      style={{
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        animationDelay: '0.2s',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex flex-col items-center py-4 gap-1"
          style={{
            borderLeft: i > 0 ? '1px solid oklch(0.22 0 0)' : 'none',
          }}
        >
          <span
            className="font-mono text-xl md:text-2xl font-medium tracking-tight"
            style={{ color: 'oklch(0.88 0.02 85)' }}
          >
            {stat.value}
          </span>
          <span className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
