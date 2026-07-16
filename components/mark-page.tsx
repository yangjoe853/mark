'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { MarkButton } from './mark-button'
import { YearGrid } from './year-grid'
import { StatsBar } from './stats-bar'
import { useI18n } from '@/lib/i18n-context'
import { type Locale, LOCALES, LOCALE_LABELS } from '@/lib/i18n'

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
    if (diff === 1) { cur++; max = Math.max(max, cur) } else { cur = 1 }
  }
  return max
}

export function MarkPage() {
  const { t, locale, setLocale } = useI18n()
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
  const yearProgress = Math.round((dayOfYear / totalDays) * 100)

  // Locale-aware date display
  const weekday = locale === 'zh'
    ? today.toLocaleDateString('zh-CN', { weekday: 'long' })
    : today.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = locale === 'zh'
    ? today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    : today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const stats = [
    { label: t.statTotal, value: checkedDays.size },
    { label: t.statLongest, value: longest },
    { label: t.statDayOfYear, value: `${dayOfYear}${t.statDayUnit}` },
    { label: t.statRemaining, value: totalDays - dayOfYear },
  ]

  // Card description lines
  const descLines = t.cardDesc.split('\n')

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Header ── */}
      <header className="fade-up border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-base font-medium tracking-[0.2em] uppercase"
              style={{ color: 'var(--mark)' }}
            >
              {t.brand}
            </span>
            <span className="hidden sm:block text-sm text-muted-foreground font-sans">
              {weekday}，{dateStr}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Year progress */}
            <div className="hidden md:flex items-center gap-2.5" title={t.yearProgressLabel(yearProgress)}>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ width: 80, background: 'var(--muted)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${yearProgress}%`, background: 'var(--mark)' }}
                />
              </div>
              <span className="font-mono text-sm text-muted-foreground">{yearProgress}%</span>
            </div>

            {/* Locale switcher */}
            <div
              className="flex items-center rounded-full overflow-hidden"
              style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}
            >
              {LOCALES.map((l: Locale) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className="px-3 py-1 text-xs font-mono transition-all duration-200"
                  style={{
                    background: locale === l ? 'var(--mark)' : 'transparent',
                    color: locale === l ? 'white' : 'var(--muted-foreground)',
                    fontWeight: locale === l ? '600' : '400',
                  }}
                  aria-pressed={locale === l}
                  aria-label={`Switch to ${LOCALE_LABELS[l]}`}
                >
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>

            {/* Status badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-sans"
              style={{
                background: isMarkedToday ? 'var(--mark-dim)' : 'var(--muted)',
                color: isMarkedToday ? 'var(--mark-hover)' : 'var(--muted-foreground)',
                border: `1px solid ${isMarkedToday ? 'var(--mark)' : 'var(--border)'}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: isMarkedToday ? 'var(--mark)' : 'var(--border)' }}
              />
              <span className="hidden sm:inline">
                {isMarkedToday ? t.todayMarked : t.notMarked}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* ── Left: Mark action ── */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 fade-up" style={{ animationDelay: '0.05s' }}>
            <div
              className="rounded-xl p-8 flex flex-col items-center gap-8"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 8px oklch(0.22 0.01 60 / 0.06)',
              }}
            >
              {mounted ? (
                <MarkButton isMarked={isMarkedToday} onMark={handleMark} streakCount={streak} />
              ) : (
                <div
                  className="w-36 h-36 rounded-full"
                  style={{ border: '2px solid var(--border)' }}
                />
              )}

              {/* Card description — the deep copy */}
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {descLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < descLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            {/* Stats cards */}
            <div className="mt-4 fade-up" style={{ animationDelay: '0.15s' }}>
              {mounted && <StatsBar stats={stats} />}
            </div>
          </div>

          {/* ── Right: Year grid ── */}
          <div className="flex-1 w-full md:min-w-0 fade-up" style={{ animationDelay: '0.2s' }}>
            <div
              className="rounded-xl p-7 md:p-9"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 8px oklch(0.22 0.01 60 / 0.06)',
              }}
            >
              {/* Grid header */}
              <div className="flex items-end justify-between mb-7">
                <div>
                  <h2
                    className="text-2xl font-semibold font-sans tracking-tight"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {t.gridYear(today.getFullYear())}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {t.gridSub}
                  </p>
                </div>
                <span
                  className="font-mono text-base font-medium"
                  style={{ color: 'var(--mark)' }}
                >
                  {t.gridCount(checkedDays.size, totalDays)}
                </span>
              </div>

              {mounted && <YearGrid checkedDays={checkedDays} todayKey={todayKey} />}

              {/* Month strip */}
              <div className="mt-6">
                <MonthStrip months={t.months} />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-5">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <span className="text-sm text-muted-foreground italic">
            {t.footerTagline}
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {t.brand} · {today.getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}

function MonthStrip({ months }: { months: string[] }) {
  const currentMonth = new Date().getMonth()
  return (
    <div className="grid grid-cols-12 gap-1">
      {months.map((m, i) => (
        <div key={m} className="flex flex-col items-center gap-1.5">
          <div
            className="w-full h-[2px] rounded-full"
            style={{
              background: i <= currentMonth ? 'var(--mark)' : 'var(--border)',
              opacity: i <= currentMonth ? (i === currentMonth ? 1 : 0.45) : 1,
            }}
          />
          <span
            className="font-mono text-[9px] tracking-wide"
            style={{
              color: i === currentMonth
                ? 'var(--mark-hover)'
                : i < currentMonth
                  ? 'var(--muted-foreground)'
                  : 'var(--border)',
            }}
          >
            {m}
          </span>
        </div>
      ))}
    </div>
  )
}
