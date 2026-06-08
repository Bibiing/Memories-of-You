import { useState, useRef } from 'react'
import type { MiniGameProps, DragDropSchedulerConfig } from '@/types/minigame'

export function DragDropScheduler({
  config,
  onComplete,
  onAbandon,
}: MiniGameProps<DragDropSchedulerConfig>) {
  const { tasks, slots, correctMapping } = config
  // mapping: slotId → taskId | null
  const [placed, setPlaced] = useState<Record<string, string | null>>(
    () => Object.fromEntries(slots.map((s) => [s, null])),
  )
  const [unplaced, setUnplaced] = useState(tasks.map((t) => t.id))
  const dragTaskId = useRef<string | null>(null)

  const taskMap = Object.fromEntries(tasks.map((t) => [t.id, t]))

  const handleDragStart = (taskId: string) => {
    dragTaskId.current = taskId
  }

  const handleDrop = (slotId: string) => {
    const id = dragTaskId.current
    if (!id) return
    dragTaskId.current = null

    // Remove from old slot if placed there
    setPlaced((prev) => {
      const next = { ...prev }
      // Evict previous occupant of this slot
      const evicted = next[slotId]
      next[slotId] = id
      // Free from old slot
      for (const s of slots) {
        if (s !== slotId && next[s] === id) next[s] = null
      }
      // Return evicted to unplaced
      if (evicted && evicted !== id) {
        setUnplaced((p) => (p.includes(evicted) ? p : [...p, evicted]))
      }
      return next
    })
    setUnplaced((prev) => prev.filter((t) => t !== id))
  }

  const handleSubmit = () => {
    let correct = 0
    for (const [taskId, slotId] of Object.entries(correctMapping)) {
      if (placed[slotId] === taskId) correct++
    }
    const success = correct === Object.keys(correctMapping).length
    onComplete({ success, score: correct })
  }

  const allPlaced = unplaced.length === 0

  return (
    <div className="minigame-root minigame-scheduler">
      <div className="mg-header">
        <span className="mg-title">Atur Jadwal</span>
      </div>

      <p className="mg-instruction">Seret tugas ke slot waktu yang sesuai.</p>

      <div className="scheduler-layout">
        <div className="scheduler-tasks">
          <p className="scheduler-section-label">Tugas</p>
          {unplaced.map((id) => {
            const task = taskMap[id]
            return (
              <div
                key={id}
                className="scheduler-task"
                style={{ borderColor: task?.color ?? '#888' }}
                draggable
                onDragStart={() => { handleDragStart(id) }}
                aria-label={task?.label}
              >
                {task?.label}
              </div>
            )
          })}
        </div>

        <div className="scheduler-slots">
          <p className="scheduler-section-label">Waktu</p>
          {slots.map((slot) => {
            const placedId = placed[slot]
            const task = placedId ? taskMap[placedId] : null
            return (
              <div
                key={slot}
                className={`scheduler-slot${task ? ' scheduler-slot--filled' : ''}`}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={() => { handleDrop(slot) }}
                aria-label={`Slot ${slot}`}
              >
                <span className="scheduler-slot-label">{slot}</span>
                {task && (
                  <span
                    className="scheduler-placed-task"
                    style={{ background: task.color + '44', borderColor: task.color }}
                  >
                    {task.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button
        className="mg-submit-btn"
        onClick={handleSubmit}
        disabled={!allPlaced}
      >
        Periksa
      </button>
      <button className="mg-abandon-btn" onClick={onAbandon}>Lewati</button>
    </div>
  )
}
