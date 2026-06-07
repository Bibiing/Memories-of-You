import type { SystemOutput, StatAdjustment } from './types'
import { useEmotionalStore } from '@stores/emotionalStore'
import { useGameStateStore } from '@stores/gameStateStore'

export function applyOutput(output: SystemOutput): void {
  const emotional = useEmotionalStore.getState()
  const gameState = useGameStateStore.getState()

  if (output.statAdjustment) {
    applyStatAdjustment(output.statAdjustment, emotional)
  }

  if (output.type === 'chapter-transition' && output.nextChapter) {
    gameState.setChapter(output.nextChapter)
  }
}

export function applyOutputs(outputs: SystemOutput[]): void {
  for (const output of outputs) {
    applyOutput(output)
  }
}

function applyStatAdjustment(
  adj: StatAdjustment,
  store: ReturnType<typeof useEmotionalStore.getState>
): void {
  if (adj.distress !== undefined) store.adjustDistress(adj.distress)
  if (adj.hope !== undefined) store.adjustHope(adj.hope)
  if (adj.denial !== undefined) store.adjustDenial(adj.denial)
  if (adj.avoidanceCount !== undefined) store.incrementAvoidance()
  if (adj.aggressiveChoiceCount !== undefined) store.incrementAggressiveChoice()
  if (adj.internalizedAngerCount !== undefined) store.incrementInternalizedAnger()
  if (adj.consecutiveHardDenial !== undefined) {
    if (adj.consecutiveHardDenial === -999) store.resetConsecutiveHardDenial()
    else store.incrementConsecutiveHardDenial()
  }
}
