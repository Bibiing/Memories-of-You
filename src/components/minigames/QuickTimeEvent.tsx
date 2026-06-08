import { useState, useEffect, useRef } from 'react'
import type { MiniGameProps, QuickTimeEventConfig } from '@/types/minigame'

interface ActiveTarget {
  id: string
  x: number
  y: number
  label: string
}

export function QuickTimeEvent({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<QuickTimeEventConfig>) {
  const { duration, spawnInterval, targets } = config
  const [timeLeft,      setTimeLeft]      = useState(duration)
  const [score,         setScore]         = useState(0)
  const [activeTargets, setActiveTargets] = useState<ActiveTarget[]>([])
  const [hit,           setHit]           = useState<string | null>(null)
  const [expired,       setExpired]       = useState(false)
  const queueRef = useRef([...targets])
  const scoreRef = useRef(0)

  // Countdown
  useEffect(() => {
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
  }, [expired])

  useEffect(() => {
    if (expired) onComplete({ success: true, score: scoreRef.current })
  }, [expired]) // eslint-disable-line react-hooks/exhaustive-deps

  // Spawn targets — setInterval callback, Date.now() not used here
  useEffect(() => {
    if (expired) return
    const spawner = setInterval(() => {
      if (queueRef.current.length === 0) return
      const next = queueRef.current.shift()
      if (!next) return
      const spawnedId = next.id
      setActiveTargets((prev) => [...prev, { id: next.id, x: next.x, y: next.y, label: next.label }])

      setTimeout(() => {
        setActiveTargets((prev) => prev.filter((t) => t.id !== spawnedId))
      }, 2500)
    }, spawnInterval * 1000)

    return () => { clearInterval(spawner) }
  }, [expired, spawnInterval])

  const hitTarget = (id: string) => {
    setHit(id)
    scoreRef.current += 1
    setScore((s) => s + 1)
    setActiveTargets((prev) => prev.filter((t) => t.id !== id))
    setTimeout(() => { setHit(null) }, 200)
  }

  const timerPct = (timeLeft / duration) * 100

  return (
    <div className="minigame-root minigame-qte">
      <div className="mg-header">
        <span className="mg-title">Rage Room</span>
        <span className="mg-counter">{String(score)} hit · {String(Math.ceil(timeLeft))}s</span>
      </div>

      <div className="qte-timer-bar">
        <div className="qte-timer-fill" style={{ width: timerPct.toFixed(1) + '%' }} />
      </div>

      <div className="qte-stage" aria-label="Klik target yang muncul">
        {activeTargets.map((t) => (
          <button
            key={t.id}
            className={'qte-target' + (hit === t.id ? ' qte-target--hit' : '')}
            style={{ left: t.x.toFixed(1) + '%', top: t.y.toFixed(1) + '%' }}
            onClick={() => { hitTarget(t.id) }}
            aria-label={t.label}
          >
            <span className="qte-target-label">{t.label}</span>
          </button>
        ))}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>Selesai</button>
    </div>
  )
}
