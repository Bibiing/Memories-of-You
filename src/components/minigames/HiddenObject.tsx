import { useState, useEffect, useRef } from 'react'
import type { MiniGameProps, HiddenObjectConfig } from '@/types/minigame'

export function HiddenObject({ config, onComplete, onAbandon }: MiniGameProps<HiddenObjectConfig>) {
  const { targets, timeLimit } = config
  const [found, setFound] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [lastClick, setLastClick] = useState<{ x: number; y: number; k: number } | null>(null)
  const [expired, setExpired] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const clickKey = useRef(0)

  useEffect(() => {
    if (found.size === targets.length) {
      onComplete({ success: true, score: found.size })
      return
    }
    if (expired) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = parseFloat((prev - 0.1).toFixed(1))
        if (next <= 0) {
          clearInterval(interval)
          setExpired(true)
          return 0
        }
        return next
      })
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [found, expired, targets.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (expired) onComplete({ success: false, score: found.size })
  }, [expired]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    clickKey.current += 1
    setLastClick({ x, y, k: clickKey.current })

    for (const t of targets) {
      if (found.has(t.id)) continue
      const dx = x - t.x
      const dy = y - t.y
      if (Math.sqrt(dx * dx + dy * dy) <= t.radius) {
        setFound((prev) => new Set([...prev, t.id]))
        return
      }
    }
  }

  const timerPct = (timeLeft / timeLimit) * 100

  return (
    <div className="minigame-root minigame-hidden-object">
      <div className="mg-header">
        <span className="mg-title">Cari Objek</span>
        <span className="mg-counter">
          {String(found.size)}/{String(targets.length)} · {String(Math.ceil(timeLeft))}s
        </span>
      </div>

      <div className="ho-timer-bar">
        <div className="ho-timer-fill" style={{ width: timerPct.toFixed(1) + '%' }} />
      </div>

      <div
        ref={stageRef}
        className="ho-stage"
        onClick={handleClick}
        role="application"
        aria-label="Klik untuk menemukan objek tersembunyi"
      >
        <div className="ho-scene-placeholder" />

        {targets.map((t) =>
          found.has(t.id) ? (
            <div
              key={t.id}
              className="ho-target ho-target--found"
              style={{ left: t.x.toFixed(1) + '%', top: t.y.toFixed(1) + '%' }}
              aria-label={t.label + ' ditemukan'}
            >
              ✓
            </div>
          ) : null
        )}

        {lastClick && (
          <div
            key={lastClick.k}
            className="ho-click-ripple"
            style={{ left: lastClick.x.toFixed(1) + '%', top: lastClick.y.toFixed(1) + '%' }}
          />
        )}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>
        Lewati
      </button>
    </div>
  )
}
