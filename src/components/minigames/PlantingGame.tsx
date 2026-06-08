import { useState } from 'react'
import type { MiniGameProps, PlantingGameConfig } from '@/types/minigame'

export function PlantingGame({ config, onComplete, onAbandon }: MiniGameProps<PlantingGameConfig>) {
  const { steps, correctOrder } = config
  const [completed, setCompleted] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)

  const nextExpected = correctOrder[completed.length]

  const handleStep = (id: string) => {
    if (id !== nextExpected) {
      setWrong(id)
      setTimeout(() => {
        setWrong(null)
      }, 600)
      return
    }
    const next = [...completed, id]
    setCompleted(next)
    if (next.length === correctOrder.length) {
      onComplete({ success: true, score: 100 })
    }
  }

  const stepMap = Object.fromEntries(steps.map((s) => [s.id, s]))

  return (
    <div className="minigame-root minigame-planting">
      <div className="mg-header">
        <span className="mg-title">Rawat Kaktus</span>
        <span className="mg-counter">
          {completed.length}/{correctOrder.length}
        </span>
      </div>

      <p className="mg-instruction">Lakukan langkah perawatan dalam urutan yang benar.</p>

      <div className="planting-sequence">
        {correctOrder.map((id, i) => {
          const done = completed.includes(id)
          const step = stepMap[id]
          return (
            <div key={id} className={`planting-step${done ? ' planting-step--done' : ''}`}>
              <span className="planting-step-num">{i + 1}</span>
              <span className="planting-step-icon">{step?.icon ?? '?'}</span>
              <span className="planting-step-label">{done ? step?.label : '???'}</span>
              {done && <span className="planting-step-check">✓</span>}
            </div>
          )
        })}
      </div>

      <div className="planting-actions">
        {steps.map((step) => {
          const isDone = completed.includes(step.id)
          const isWrong = wrong === step.id
          return (
            <button
              key={step.id}
              className={[
                'planting-action-btn',
                isDone ? 'planting-action-btn--done' : '',
                isWrong ? 'planting-action-btn--wrong' : '',
              ].join(' ')}
              disabled={isDone}
              onClick={() => {
                handleStep(step.id)
              }}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </button>
          )
        })}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>
        Lewati
      </button>
    </div>
  )
}
