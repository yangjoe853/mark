'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { AmbientCanvas } from './ambient-canvas'
import { MarkButton } from './mark-button'
import { YearGrid } from './year-grid'
import { StatsBar } from './stats-bar'

const STORAGE_KEY = 'mark_checked_days'

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadCheckedDays(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function saveCheckedDays(days: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...days]))
}

function calcStreak(days: Set<string>, todayKey: string): number {
  let streak = 0
  const d = new Date(todayKey)
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

function calcLongestStreak(days: Set<string>): number {
  if (days.size === 0) return 0
  const sorted = [...days].sort()
  let max = 1, cur = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    if (diff === 1) {
      cur++
      max = Math.max(max, cur)
    } else {
      cur = 1
    }
  }
  return max
}

export function MarkPage() {
  const todayKey = getTodayKey()
  const [checkedDays, setCheckedDays] = useState<Set<string>>(() => new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCheckedDays(loadCheckedDays())
    setMounted(true)
  }, [])

  const isMarkedToday = checkedDays.has(todayKey)
  const streak = useMemo(() => calcStreak(checkedDays, todayKey), [checkedDays, todayKey])
  const longest = useMemo(() => calcLongestStreak(checkedDays), [checkedDays])

  const handleMark = useCallback(() => {
    setCheckedDays((prev) => {
      const next = new Set(prev)
      next.add(todayKey)
      saveCheckedDays(next)
      return next
    })
  }, [todayKey])

  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const totalDays = today.getFullYear() % 4 === 0 ? 366 : 365

  const stats = [
    { label: 'total', value: checkedDays.size },
    { label: 'longest', value: longest },
    { label: 'day', value: dayOfYear },
    { label: 'remain', value: totalDays - dayOfYear },
  ]

  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AmbientCanvas />

      {/* ── Global header ── */}
      <header
        className="relative z-10 flex items-center justify-between px-8 md:px-12 lg:px-16 pt-8 pb-6 fade-up"
        style={{ borderBottom: '1px solid oklch(0.18 0 0)' }}
      >
        <div className="flex items-center gap-4">
          <h1
            className="font-mono text-[11px] tracking-[0.35em] uppercase"
            style={{ color: 'oklch(0.88 0.02 85)' }}
          >
            MARK
          </h1>
          <span
            className="hidden sm:block font-mono text-[10px] tracking-[0.15em] text-muted-foreground"
            style={{ borderLeft: '1px solid oklch(0.22 0 0)', paddingLeft: '1rem' }}
          >
            {weekday}, {dateStr}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Year progress pill */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className="h-[3px] rounded-full overflow-hidden"
              style={{ width: 120, background: 'oklch(0.18 0 0)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(dayOfYear / totalDays) * 100}%`,
                  background: 'oklch(0.88 0.02 85 / 0.5)',
                }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              {Math.round((dayOfYear / totalDays) * 100)}%
            </span>
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ border: '1px solid oklch(0.22 0 0)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full transition-all duration-400"
              style={{
                background: isMarkedToday ? 'oklch(0.88 0.02 85)' : 'oklch(0.35 0 0)',
                boxShadow: isMarkedToday ? '0 0 4px oklch(0.88 0.02 85 / 0.6)' : 'none',
              }}
            />
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              {isMarkedToday ? 'done' : 'pending'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row">

        {/* ── Left panel: mark action ── */}
        <div
          className="flex flex-col items-center justify-center px-8 md:px-12 lg:px-16 py-12 lg:py-0 lg:min-h-0 lg:flex-1"
          style={{ borderRight: 'none' }}
        >
          <div className="w-full max-w-xs lg:max-w-sm flex flex-col items-center gap-10">
            {mounted ? (
              <MarkButton
                isMarked={isMarkedToday}
                onMark={handleMark}
                streakCount={streak}
              />
            ) : (
              <div
                className="w-44 h-44 rounded-full"
                style={{ border: '1.5px solid oklch(0.22 0 0)' }}
              />
            )}

            <footer className="w-full text-center fade-up" style={{ animationDelay: '0.4s' }}>
              <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase">
                One mark &middot; Every day &middot; This year
              </p>
            </footer>
          </div>
        </div>

        {/* ── Right panel: data ── */}
        <div
          className="flex flex-col gap-0 lg:w-[480px] xl:w-[560px] lg:border-l"
          style={{ borderColor: 'oklch(0.18 0 0)' }}
        >
          {/* Stats row */}
          <div style={{ borderBottom: '1px solid oklch(0.18 0 0)' }}>
            {mounted && <StatsBar stats={stats} />}
          </div>

          {/* Year grid */}
          <div className="flex-1 px-8 md:px-10 py-8 fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p
                  className="font-mono text-[11px] tracking-[0.28em] uppercase mb-0.5"
                  style={{ color: 'oklch(0.88 0.02 85)' }}
                >
                  {new Date().getFullYear()}
                </p>
                <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  Year in marks
                </p>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                {checkedDays.size} / {totalDays}
              </span>
            </div>
            {mounted && <YearGrid checkedDays={checkedDays} todayKey={todayKey} />}
          </div>

          {/* Month labels strip */}
          <div
            className="px-8 md:px-10 pb-8 fade-up"
            style={{ animationDelay: '0.35s' }}
          >
            <MonthStrip />
          </div>
        </div>
      </main>
    </div>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MonthStrip() {
  const currentMonth = new Date().getMonth()
  return (
    <div className="grid grid-cols-12 gap-1">
      {MONTHS.map((m, i) => (
        <div key={m} className="flex flex-col items-center gap-1">
          <div
            className="w-full h-[1px]"
            style={{
              background: i <= currentMonth
                ? 'oklch(0.88 0.02 85 / 0.3)'
                : 'oklch(0.2 0 0)',
            }}
          />
          <span
            className="font-mono text-[8px] tracking-wider uppercase"
            style={{
              color: i === currentMonth
                ? 'oklch(0.88 0.02 85)'
                : 'oklch(0.32 0 0)',
            }}
          >
            {m}
          </span>
        </div>
      ))}
    </div>
  )
}
