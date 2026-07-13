'use client'

import { useState, useRef, useCallback } from 'react'

interface MarkButtonProps {
  isMarked: boolean
  onMark: () => void
  streakCount: number
}

interface InkDrop {
  id: number
  x: number
  y: number
}

export function MarkButton({ isMarked, onMark, streakCount }: MarkButtonProps) {
  const [inkDrops, setInkDrops] = useState<InkDrop[]>([])
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropIdRef = useRef(0)

  const handleClick = useCallback(() => {
    if (isMarked) return

    const btn = buttonRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2

    const newDrop: InkDrop = {
      id: dropIdRef.current++,
      x: cx,
      y: cy,
    }

    setInkDrops((prev) => [...prev, newDrop])
    setTimeout(() => {
      setInkDrops((prev) => prev.filter((d) => d.id !== newDrop.id))
    }, 1300)

    onMark()
  }, [isMarked, onMark])

  return (
    <div className="flex flex-col items-center gap-8 fade-up" style={{ animationDelay: '0.1s' }}>
      {/* Streak display */}
      <div className="text-center">
        <div
          key={streakCount}
          className="number-tick font-mono text-6xl md:text-8xl font-medium tracking-tight"
          style={{ color: 'oklch(0.88 0.02 85)' }}
        >
          {streakCount}
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mt-1">
          {streakCount === 1 ? 'day streak' : 'day streak'}
        </div>
      </div>

      {/* Main mark button */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings on mark */}
        {inkDrops.map((drop) => (
          <span
            key={drop.id}
            className="absolute rounded-full pointer-events-none pulse-ring"
            style={{
              width: 180,
              height: 180,
              border: '1px solid oklch(0.88 0.02 85 / 0.5)',
              left: drop.x - 90,
              top: drop.y - 90,
            }}
          />
        ))}
        {inkDrops.map((drop) => (
          <span
            key={`r2-${drop.id}`}
            className="absolute rounded-full pointer-events-none pulse-ring"
            style={{
              width: 240,
              height: 240,
              border: '1px solid oklch(0.88 0.02 85 / 0.3)',
              left: drop.x - 120,
              top: drop.y - 120,
              animationDelay: '0.12s',
            }}
          />
        ))}

        <button
          ref={buttonRef}
          onClick={handleClick}
          onPointerDown={() => setIsPressed(true)}
          onPointerUp={() => setIsPressed(false)}
          onPointerLeave={() => setIsPressed(false)}
          disabled={isMarked}
          aria-label={isMarked ? 'Already marked today' : 'Mark today'}
          className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden transition-all duration-300 group"
          style={{
            background: isMarked
              ? 'oklch(0.88 0.02 85)'
              : 'transparent',
            border: `1.5px solid ${isMarked ? 'oklch(0.88 0.02 85)' : 'oklch(0.35 0 0)'}`,
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
            cursor: isMarked ? 'default' : 'pointer',
          }}
        >
          {/* Ink fill animation */}
          {inkDrops.map((drop) => (
            <span
              key={`ink-${drop.id}`}
              className="absolute rounded-full ink-spread pointer-events-none"
              style={{
                width: 320,
                height: 320,
                background: 'oklch(0.88 0.02 85)',
                left: drop.x - 160,
                top: drop.y - 160,
              }}
            />
          ))}

          {/* Center content */}
          <span className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            {isMarked ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(0.09 0 0)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-150"
                style={{ background: 'oklch(0.4 0 0)' }}
              />
            )}
          </span>
        </button>
      </div>

      {/* Status label */}
      <div
        className="font-mono text-[11px] tracking-[0.25em] uppercase transition-all duration-500"
        style={{
          color: isMarked ? 'oklch(0.88 0.02 85)' : 'oklch(0.38 0 0)',
        }}
      >
        {isMarked ? 'marked' : 'press to mark'}
      </div>
    </div>
  )
}
