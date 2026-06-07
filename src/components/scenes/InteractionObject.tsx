import { useState } from 'react'
import type { InteractionTrigger } from '@/types/dialogue'

interface Props {
  trigger: InteractionTrigger
  onActivate: (trigger: InteractionTrigger) => void
}

export function InteractionObject({ trigger, onActivate }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="interaction-object"
      style={{
        left: `${String(trigger.position.x)}%`,
        top: `${String(trigger.position.y)}%`,
        transform: 'translate(-50%, -50%)',
      }}
      role="button"
      tabIndex={0}
      aria-label={trigger.label}
      onClick={(e) => {
        e.stopPropagation()
        onActivate(trigger)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onActivate(trigger)
      }}
      onMouseEnter={() => { setHovered(true) }}
      onMouseLeave={() => { setHovered(false) }}
    >
      <div className={`interaction-pulse ${hovered ? 'interaction-pulse--hover' : ''}`} />
      <span className="interaction-label" aria-hidden="true">
        {trigger.label}
      </span>
    </div>
  )
}
