'use client'

import { useMemo } from 'react'
import { useI18n } from '@/lib/i18n-context'

interface YearGridProps {
  checkedDays: Set<string>
  todayKey: string
}

function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function YearGrid({ checkedDays, todayKey }: YearGridProps) {
  const { t } = useI18n()

  const days = useMemo(() => {
    const result: { key: string; isToday: boolean; isChecked: boolean; isFuture: boolean }[] = []
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31)
    const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    for (let d = new Date(startOfYear); d <= endOfYear; d.setDate(d.getDate() + 1)) {
      const key = getDayKey(d)
      const dTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      result.push({
        key,
        isToday: key === todayKey,
        isChecked: checkedDays.has(key),
        isFuture: dTime > todayTime,
      })
    }
    return result
  }, [checkedDays, todayKey])

  return (
    <div className="w-full">
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(9px, 1fr))' }}
        role="grid"
        aria-label="Year check-in grid"
      >
        {days.map((day) => (
          <div
            key={day.key}
            role="gridcell"
            aria-label={day.key}
            aria-checked={day.isChecked}
            title={day.key}
            className="aspect-square rounded-[3px] transition-all duration-500"
            style={{
              backgroundColor: day.isToday
                ? 'var(--mark)'
                : day.isChecked
                  ? 'oklch(0.72 0.14 68 / 0.55)'
                  : day.isFuture
                    ? 'var(--muted)'
                    : 'oklch(0.72 0.14 68 / 0.18)',
              boxShadow: day.isToday
                ? '0 0 0 2px var(--background), 0 0 0 3px var(--mark)'
                : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
        <LegendItem color="oklch(0.72 0.14 68 / 0.18)" label={t.legendPastMissed} />
        <LegendItem color="oklch(0.72 0.14 68 / 0.55)" label={t.legendChecked} />
        <LegendItem color="var(--muted)" label={t.legendFuture} />
        <LegendItem color="var(--mark)" label={t.legendToday} />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-[3px] flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-muted-foreground font-sans">{label}</span>
    </div>
  )
}
