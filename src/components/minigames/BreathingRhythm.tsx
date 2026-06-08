import { useState, useEffect } from 'react'
import type { MiniGameProps, BreathingRhythmConfig } from '@/types/minigame'

type Phase = 'inhale' | 'hold' | 'exhale'

const PHASE_LABEL: Record<Phase, string> = {
  inhale: 'Tarik Napas',
  hold: 'Tahan',
  exhale: 'Hembuskan',
}

const PHASE_ORDER: Phase[] = ['inhale', 'hold', 'exhale']

export function BreathingRhythm({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<BreathingRhythmConfig>) {
  const { inhaleSeconds, holdSeconds, exhaleSeconds, cycles } = config
  const durations: Record<Phase, number> = {
    inhale: inhaleSeconds * 1000,
    hold: holdSeconds * 1000,
    exhale: exhaleSeconds * 1000,
  }

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [finished, setFinished] = useState(false)

  const phase = PHASE_ORDER[phaseIdx % PHASE_ORDER.length] ?? 'inhale'
  const duration = durations[phase]

  // Advance timer — Date.now() called inside setInterval callback (not during render)
  useEffect(() => {
    if (finished) return
    const start = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const prog = Math.min(elapsed / duration, 1)
      setProgress(prog)

      if (elapsed >= duration) {
        clearInterval(interval)
        const nextIdx = phaseIdx + 1
        const cycleComplete = nextIdx % PHASE_ORDER.length === 0
        const nextCycle = cycleComplete ? cycleCount + 1 : cycleCount

        if (cycleComplete && nextCycle >= cycles) {
          setFinished(true)
          return
        }
        if (cycleComplete) setCycleCount(nextCycle)
        setPhaseIdx(nextIdx)
      }
    }, 50)

    return () => {
      clearInterval(interval)
    }
  }, [phaseIdx, finished]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!finished) return
    const t = setTimeout(() => {
      onComplete({ success: true })
    }, 800)
    return () => {
      clearTimeout(t)
    }
  }, [finished, onComplete])

  const scale =
    phase === 'inhale' ? 0.5 + progress * 0.5 : phase === 'exhale' ? 1 - progress * 0.5 : 1

  return (
    <div className="minigame-root minigame-breathing">
      <div className="mg-header">
        <span className="mg-title">Latihan Pernapasan</span>
        <span className="mg-counter">
          {String(Math.min(cycleCount + 1, cycles))} / {String(cycles)} siklus
        </span>
      </div>

      <div className="breathing-stage">
        <div
          className="breathing-circle"
          style={{ transform: 'scale(' + scale.toFixed(4) + ')' }}
          aria-label={PHASE_LABEL[phase]}
        />
        <span className="breathing-phase-label">
          {finished ? 'Bagus sekali' : PHASE_LABEL[phase]}
        </span>
        <div className="breathing-timer-bar">
          <div
            className="breathing-timer-fill"
            style={{ width: (progress * 100).toFixed(1) + '%' }}
          />
        </div>
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>
        Lewati
      </button>
    </div>
  )
}
