import { useState, useEffect } from 'react'
import type { MiniGameProps, FindTheDifferenceConfig } from '@/types/minigame'

export function FindTheDifference({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<FindTheDifferenceConfig>) {
  const { differences, timeLimit } = config
  const [found,    setFound]    = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [expired,  setExpired]  = useState(false)

  useEffect(() => {
    if (found.size === differences.length) {
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
    return () => { clearInterval(interval) }
  }, [found, expired, differences.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (expired) onComplete({ success: false, score: found.size })
  }, [expired]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    for (const d of differences) {
      if (found.has(d.id)) continue
      const dx = x - d.x
      const dy = y - d.y
      if (Math.sqrt(dx * dx + dy * dy) <= d.radius) {
        setFound((prev) => new Set([...prev, d.id]))
        return
      }
    }
  }

  const timerPct = (timeLeft / timeLimit) * 100

  return (
    <div className="minigame-root minigame-ftd">
      <div className="mg-header">
        <span className="mg-title">Cari Perbedaan</span>
        <span className="mg-counter">
          {String(found.size)}/{String(differences.length)} · {String(Math.ceil(timeLeft))}s
        </span>
      </div>

      <div className="ftd-timer-bar">
        <div className="ftd-timer-fill" style={{ width: timerPct.toFixed(1) + '%' }} />
      </div>

      <div className="ftd-panels">
        {(['a', 'b'] as const).map((side) => (
          <div
            key={side}
            className="ftd-panel"
            onClick={handleClick}
            role="application"
            aria-label={side === 'a' ? 'Gambar kiri' : 'Gambar kanan'}
          >
            <div className="ftd-scene-placeholder" />
            {differences
              .filter((d) => found.has(d.id))
              .map((d) => (
                <div
                  key={d.id}
                  className="ftd-found-marker"
                  style={{ left: d.x.toFixed(1) + '%', top: d.y.toFixed(1) + '%' }}
                />
              ))
            }
          </div>
        ))}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>Lewati</button>
    </div>
  )
}
