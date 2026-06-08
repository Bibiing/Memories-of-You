import { useState, useRef, useCallback, useEffect } from 'react'
import type { MiniGameProps, HoldToDeleteConfig } from '@/types/minigame'

export function HoldToDelete({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<HoldToDeleteConfig>) {
  const { elements, holdDuration } = config
  const [remaining,    setRemaining]    = useState(elements.map((e) => e.id))
  const [holding,      setHolding]      = useState<string | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const allDoneRef = useRef(false)

  useEffect(() => {
    if (remaining.length === 0 && !allDoneRef.current) {
      allDoneRef.current = true
      onComplete({ success: true })
    }
  }, [remaining.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const stopHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setHolding(null)
    setHoldProgress(0)
  }, [])

  const startHold = useCallback((id: string) => {
    if (holding !== null) return
    setHolding(id)
    setHoldProgress(0)
    const start = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const prog = Math.min(elapsed / holdDuration, 1)
      setHoldProgress(prog)

      if (elapsed >= holdDuration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = null
        setHolding(null)
        setHoldProgress(0)
        setRemaining((prev) => prev.filter((r) => r !== id))
      }
    }, 50)
  }, [holding, holdDuration])

  const displayElements = elements.filter((e) => remaining.includes(e.id))

  return (
    <div className="minigame-root minigame-hold-delete">
      <div className="mg-header">
        <span className="mg-title">Hapus Kenangan</span>
        <span className="mg-counter">{String(displayElements.length)} tersisa</span>
      </div>

      <p className="mg-instruction">Tahan elemen untuk menghapusnya.</p>

      <div className="hold-elements">
        {displayElements.map((el) => {
          const isHeld = holding === el.id
          return (
            <div
              key={el.id}
              className={'hold-element' + (isHeld ? ' hold-element--active' : '')}
              style={{ borderColor: el.color }}
              onPointerDown={() => { startHold(el.id) }}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              role="button"
              aria-label={'Tahan untuk hapus: ' + el.label}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') startHold(el.id) }}
              onKeyUp={stopHold}
            >
              <span className="hold-element-label">{el.label}</span>
              {isHeld && (
                <div className="hold-progress-bar">
                  <div
                    className="hold-progress-fill"
                    style={{ width: (holdProgress * 100).toFixed(1) + '%', background: el.color }}
                  />
                </div>
              )}
            </div>
          )
        })}

        {displayElements.length === 0 && (
          <p className="mg-complete-msg">Semua terhapus.</p>
        )}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>Lewati</button>
    </div>
  )
}
