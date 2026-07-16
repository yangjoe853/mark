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
    <div className="flex flex-col items-center gap-6 fade-up w-full" style={{ animationDelay: '0.1s' }}>

      {/* Streak number */}
      <div className="text-center">
        <div
          key={streakCount}
          className="number-tick font-sans font-bold leading-none"
          style={{
            fontSize: '5rem',
            color: isMarked ? 'var(--mark)' : 'var(--foreground)',
            transition: 'color 0.4s ease',
          }}
        >
          {streakCount}
        </div>
        <div className="text-base text-muted-foreground mt-2 font-sans">
          天连续打卡
        </div>
      </div>

      {/* Button */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        {inkDrops.map((drop) => (
          <span
            key={drop.id}
            className="absolute rounded-full pointer-events-none pulse-ring"
            style={{
              width: 168,
              height: 168,
              border: '2px solid var(--mark)',
              opacity: 0.4,
              left: drop.x - 84,
              top: drop.y - 84,
            }}
          />
        ))}
        {inkDrops.map((drop) => (
          <span
            key={`r2-${drop.id}`}
            className="absolute rounded-full pointer-events-none pulse-ring"
            style={{
              width: 220,
              height: 220,
              border: '1.5px solid var(--mark)',
              opacity: 0.2,
              left: drop.x - 110,
              top: drop.y - 110,
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
          aria-label={isMarked ? '今日已打卡' : '点击打卡'}
          className="relative w-36 h-36 rounded-full overflow-hidden transition-all duration-300 group"
          style={{
            background: isMarked
              ? 'var(--mark)'
              : 'var(--background)',
            border: `2px solid ${isMarked ? 'var(--mark)' : 'var(--border)'}`,
            transform: isPressed ? 'scale(0.94)' : 'scale(1)',
            cursor: isMarked ? 'default' : 'pointer',
            boxShadow: isMarked
              ? '0 4px 20px var(--mark-dim)'
              : '0 2px 10px oklch(0.22 0.01 60 / 0.08)',
          }}
        >
          {/* Ink fill */}
          {inkDrops.map((drop) => (
            <span
              key={`ink-${drop.id}`}
              className="absolute rounded-full ink-spread pointer-events-none"
              style={{
                width: 320,
                height: 320,
                background: 'var(--mark)',
                left: drop.x - 160,
                top: drop.y - 160,
              }}
            />
          ))}

          {/* Hover bg */}
          {!isMarked && (
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'var(--mark-dim)' }}
            />
          )}

          {/* Icon */}
          <span className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            {isMarked ? (
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <span
                className="text-3xl font-sans font-light transition-transform duration-300 group-hover:scale-110"
                style={{ color: 'var(--muted-foreground)' }}
              >
                +
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Label */}
      <div
        className="text-sm font-sans transition-all duration-500"
        style={{
          color: isMarked ? 'var(--mark-hover)' : 'var(--muted-foreground)',
        }}
      >
        {isMarked ? '今天已完成，明天继续' : '点击打今天的卡'}
      </div>
    </div>
  )
}
