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
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(10px, 1fr))',
        }}
        role="grid"
        aria-label="Year progress grid"
      >
        {days.map((day) => (
          <div
            key={day.key}
            role="gridcell"
            aria-label={day.key}
            aria-checked={day.isChecked}
            className="aspect-square rounded-[2px] transition-all duration-500"
            style={{
              backgroundColor: day.isToday
                ? 'oklch(0.88 0.02 85)'
                : day.isChecked
                  ? 'oklch(0.88 0.02 85 / 0.7)'
                  : day.isFuture
                    ? 'oklch(0.16 0 0)'
                    : 'oklch(0.26 0 0)',
              boxShadow: day.isToday ? '0 0 6px oklch(0.88 0.02 85 / 0.5)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <LegendItem color="oklch(0.26 0 0)" label="Missed" />
        <LegendItem color="oklch(0.88 0.02 85 / 0.7)" label="Marked" />
        <LegendItem color="oklch(0.16 0 0)" label="Ahead" />
        <LegendItem color="oklch(0.88 0.02 85)" label="Today" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  )
}
