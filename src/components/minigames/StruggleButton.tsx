import { useState, useEffect, useRef } from 'react'
import type { MiniGameProps, StruggleButtonConfig } from '@/types/minigame'

export function StruggleButton({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<StruggleButtonConfig>) {
  const { target, label, timeLimit } = config
  const [count, setCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [done, setDone] = useState(false)
  const doneRef = useRef(false)

  // Countdown — state update inside setInterval callback
  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = parseFloat((prev - 0.1).toFixed(1))
        if (next <= 0) {
          clearInterval(interval)
          if (!doneRef.current) {
            doneRef.current = true
            setDone(true)
          }
          return 0
        }
        return next
      })
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [done])

  useEffect(() => {
    if (done) {
      onComplete({ success: count >= target, score: count })
    }
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePress = () => {
    if (done) return
    const newCount = count + 1
    setCount(newCount)
    if (newCount >= target && !doneRef.current) {
      doneRef.current = true
      setDone(true)
    }
  }

  const progress = Math.min(count / target, 1)

  return (
    <div className="minigame-root minigame-struggle">
      <div className="mg-header">
        <span className="mg-title">{label}</span>
        <span className="mg-counter">{String(Math.ceil(timeLeft))}s</span>
      </div>

      <div className="struggle-stage">
        <div className="struggle-progress-bar">
          <div
            className="struggle-progress-fill"
            style={{ width: (progress * 100).toFixed(1) + '%' }}
          />
        </div>
        <p className="struggle-count">
          {String(count)} / {String(target)}
        </p>

        <button className="struggle-btn" onClick={handlePress} disabled={done} aria-label="Tekan">
          TEKAN
        </button>
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>
        Lewati
      </button>
    </div>
  )
}
