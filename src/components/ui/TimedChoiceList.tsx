import { useEffect, useRef, useState } from 'react'
import type { DialogueChoice } from '@/types/dialogue'
import { ChoiceList } from './ChoiceList'

interface Props {
  choices: DialogueChoice[]
  timedSeconds: number
  onChoose: (index: number) => void
  onTimeout: () => void
}

// Assumes the parent mounts a fresh instance per node (key={node.id}).
// remaining starts at timedSeconds and only decrements — no in-effect setState reset needed.
export function TimedChoiceList({ choices, timedSeconds, onChoose, onTimeout }: Props) {
  const [remaining, setRemaining] = useState(timedSeconds)
  const onTimeoutRef = useRef(onTimeout)

  // Keep ref current without causing re-renders
  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval)
          onTimeoutRef.current()
          return 0
        }
        return +(prev - 0.1).toFixed(2)
      })
    }, 100)
    return () => { clearInterval(interval) }
  }, []) // mount-once; parent remounts this component for each new timed node

  const pct = Math.round((remaining / timedSeconds) * 100)

  return (
    <div className="timed-choice-root">
      <div className="timed-bar-wrap" aria-hidden="true">
        <div className="timed-bar-fill" style={{ width: `${String(pct)}%` }} />
      </div>
      <ChoiceList choices={choices} onChoose={onChoose} />
    </div>
  )
}
