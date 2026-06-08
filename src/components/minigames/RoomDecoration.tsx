import { useState, useRef } from 'react'
import type { MiniGameProps, RoomDecorationConfig } from '@/types/minigame'

export function RoomDecoration({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<RoomDecorationConfig>) {
  const { items, slots } = config
  const [placed,   setPlaced]   = useState<Record<string, string | null>>(
    () => Object.fromEntries(slots.map((s) => [s.id, null])),
  )
  const [unplaced, setUnplaced] = useState(items.map((i) => i.id))
  const dragId = useRef<string | null>(null)

  const itemMap = Object.fromEntries(items.map((i) => [i.id, i]))
  const slotMap = Object.fromEntries(slots.map((s) => [s.id, s]))

  const handleDrop = (slotId: string) => {
    const id = dragId.current
    if (!id) return
    dragId.current = null

    const slot = slotMap[slotId]
    if (slot?.accepts !== id) return

    const nextPlaced = { ...placed, [slotId]: id }
    setPlaced(nextPlaced)
    setUnplaced((prev) => prev.filter((i) => i !== id))

    const allCorrect = slots.every((s) => nextPlaced[s.id] === s.accepts)
    if (allCorrect) onComplete({ success: true, score: 100 })
  }

  return (
    <div className="minigame-root minigame-room-deco">
      <div className="mg-header">
        <span className="mg-title">Dekorasi Kamar</span>
        <span className="mg-counter">
          {String(slots.length - unplaced.length)}/{String(slots.length)}
        </span>
      </div>

      <p className="mg-instruction">Letakkan dekorasi di posisi yang tepat.</p>

      <div className="room-stage">
        {slots.map((slot) => {
          const filled = placed[slot.id]
          const item = filled ? itemMap[filled] : null
          return (
            <div
              key={slot.id}
              className={'room-slot' + (item ? ' room-slot--filled' : '')}
              style={{ left: slot.x.toFixed(1) + '%', top: slot.y.toFixed(1) + '%' }}
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={() => { handleDrop(slot.id) }}
              aria-label={'Slot: ' + slot.label}
            >
              {item
                ? <span className="room-slot-item" style={{ color: item.color }}>{item.label}</span>
                : <span className="room-slot-empty">{slot.label}</span>
              }
            </div>
          )
        })}
      </div>

      <div className="room-items">
        {unplaced.map((id) => {
          const item = itemMap[id]
          return (
            <div
              key={id}
              className="room-item"
              style={{ borderColor: item?.color ?? '#888' }}
              draggable
              onDragStart={() => { dragId.current = id }}
              aria-label={item?.label}
            >
              {item?.label}
            </div>
          )
        })}
      </div>

      <button className="mg-abandon-btn" onClick={onAbandon}>Lewati</button>
    </div>
  )
}
