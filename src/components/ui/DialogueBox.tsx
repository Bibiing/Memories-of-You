import { useState, useEffect, useRef } from 'react'
import type { DialogueNode } from '@/types/dialogue'
import { SPEAKER_DISPLAY } from '@/types/dialogue'
import { ChoiceList } from './ChoiceList'
import { TimedChoiceList } from './TimedChoiceList'

const TYPEWRITER_MS = 28

interface Props {
  node: DialogueNode
  onAdvance: () => void
  onChoose: (index: number) => void
  onTimeout?: () => void
}

// Parent should pass key={node.id} so the component remounts on each new node.
// This avoids synchronous setState resets inside effects.
export function DialogueBox({ node, onAdvance, onChoose, onTimeout }: Props) {
  const [charCount, setCharCount] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Typewriter — uses setInterval callback (not synchronous in effect body)
  useEffect(() => {
    if (done) return
    intervalRef.current = setInterval(() => {
      setCharCount((prev) => {
        const next = prev + 1
        if (next >= node.text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDone(true)
        }
        return next
      })
    }, TYPEWRITER_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [done, node.text.length])

  const displayed = node.text.slice(0, charCount)

  const skipOrAdvance = () => {
    if (!done) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setCharCount(node.text.length)
      setDone(true)
      return
    }
    if (!node.choices) onAdvance()
  }

  const speakerName = SPEAKER_DISPLAY[node.speaker]
  const choices = node.choices ?? []
  const hasChoices = choices.length > 0
  const showChoices = done && hasChoices

  return (
    <div className="dialogue-overlay" aria-live="polite">
      <div
        className="dialogue-box"
        onClick={skipOrAdvance}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') skipOrAdvance()
        }}
      >
        {speakerName && <div className="dialogue-speaker">{speakerName}</div>}
        <div className="dialogue-text">{displayed}</div>
        {done && !hasChoices && (
          <span className="dialogue-advance-indicator" aria-hidden="true">
            ▶
          </span>
        )}
      </div>

      {showChoices && node.timedSeconds != null && onTimeout != null ? (
        <TimedChoiceList
          key={node.id}
          choices={choices}
          timedSeconds={node.timedSeconds}
          onChoose={onChoose}
          onTimeout={onTimeout}
        />
      ) : showChoices ? (
        <ChoiceList choices={choices} onChoose={onChoose} />
      ) : null}
    </div>
  )
}
