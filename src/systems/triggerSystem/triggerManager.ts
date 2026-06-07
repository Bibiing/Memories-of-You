import type { InteractionTrigger } from '@/types/dialogue'
import type { Location, Chapter } from '@/types/game'
import { ALL_TRIGGERS } from './triggerData'
import { useInventoryStore } from '@stores/inventoryStore'

// Returns triggers visible in the given location + chapter combo.
// One-time triggers that have been used are filtered out.
export function getTriggersForLocation(
  location: Location,
  chapter: Chapter
): InteractionTrigger[] {
  const used = useInventoryStore.getState().actionHistory

  return ALL_TRIGGERS.filter((t) => {
    if (t.location !== location) return false
    if (t.chapter !== undefined && t.chapter !== chapter) return false
    if (t.oneTime && used.includes(t.id)) return false
    return true
  })
}

// Mark a one-time trigger as used so it won't appear again.
export function consumeTrigger(triggerId: string): void {
  const trigger = ALL_TRIGGERS.find((t) => t.id === triggerId)
  if (trigger?.oneTime) {
    useInventoryStore.getState().addToHistory(triggerId)
  }
}

export function getTriggerById(id: string): InteractionTrigger | undefined {
  return ALL_TRIGGERS.find((t) => t.id === id)
}
