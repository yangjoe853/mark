'use client'

import { useMemo } from 'react'

interface YearGridProps {
  checkedDays: Set<string>
  todayKey: string
}

function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function YearGrid({ checkedDays, todayKey }: YearGridProps) {
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
        aria-label="全年打卡网格"
      >
        {days.map((day) => (
          <div
            key={day.key}
            role="gridcell"
            aria-label={day.key}
            aria-checked={day.isChecked}
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
        <LegendItem color="oklch(0.72 0.14 68 / 0.18)" label="已过 · 未打" />
        <LegendItem color="oklch(0.72 0.14 68 / 0.55)" label="已打卡" />
        <LegendItem color="var(--muted)" label="未到" />
        <LegendItem color="var(--mark)" label="今天" />
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
      <span className="text-xs text-muted-foreground font-sans">
        {label}
      </span>
    </div>
  )
}
