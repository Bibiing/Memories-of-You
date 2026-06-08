import { useState, useEffect } from 'react'
import type { MiniGameProps, WordPuzzleConfig } from '@/types/minigame'

export function WordPuzzle({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<WordPuzzleConfig>) {
  const { target, letters, timeLimit } = config
  const [assembled, setAssembled] = useState<string[]>([])
  const [available, setAvailable] = useState<{ ch: string; idx: number }[]>(
    () => letters.map((ch, idx) => ({ ch, idx })),
  )
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [shake,    setShake]    = useState(false)
  const [expired,  setExpired]  = useState(false)

  // Countdown timer — state update inside callback only
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
    if (expired) onComplete({ success: false })
  }, [expired]) // eslint-disable-line react-hooks/exhaustive-deps

  const pickLetter = (idx: number, ch: string) => {
    if (expired) return
    const next = [...assembled, ch]
    setAssembled(next)
    setAvailable((prev) => prev.filter((l) => l.idx !== idx))

    const word = next.join('').toLowerCase()
    if (word === target.toLowerCase()) {
      onComplete({ success: true, score: Math.ceil(timeLeft) })
    } else if (next.length >= target.length) {
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setAssembled([])
        setAvailable(letters.map((c, i) => ({ ch: c, idx: i })))
      }, 500)
    }
  }

  const removeLast = () => {
    if (assembled.length === 0) return
    const last = assembled[assembled.length - 1]
    if (last === undefined) return
    const removedIdx = letters.findIndex(
      (ch, i) => ch === last && !available.some((a) => a.idx === i),
    )
    setAssembled((prev) => prev.slice(0, -1))
    if (removedIdx !== -1) {
      setAvailable((prev) => [...prev, { ch: last, idx: removedIdx }])
    }
  }

  const timerPct = (timeLeft / timeLimit) * 100

  return (
    <div className="minigame-root minigame-word-puzzle">
      <div className="mg-header">
        <span className="mg-title">Susun Kata</span>
        <span className="mg-counter">{String(Math.ceil(timeLeft))}s</span>
      </div>

      <div className="wp-timer-bar">
        <div className="wp-timer-fill" style={{ width: timerPct.toFixed(1) + '%' }} />
      </div>

      <div className={'wp-assembled' + (shake ? ' wp-assembled--shake' : '')} aria-live="polite">
        {assembled.length === 0
          ? <span className="wp-placeholder">_ _ _</span>
          : assembled.map((ch, i) => (
            <span key={i} className="wp-letter wp-letter--placed">{ch}</span>
          ))
        }
      </div>

      <button className="wp-backspace" onClick={removeLast} disabled={assembled.length === 0}>
        ⌫
      </button>

      <div className="wp-bank">
        {available.map(({ ch, idx }) => (
          <button
            key={idx}
            className="wp-letter wp-letter--bank"
            onClick={() => { pickLetter(idx, ch) }}
          >
            {ch}
          </button>
        ))}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>Lewati</button>
    </div>
  )
}
