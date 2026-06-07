import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { useInventoryStore } from '@stores/inventoryStore'
import { saveGame, loadGame, generateSlotId } from './saveManager'
import type { SaveData } from './saveSchema'

export async function autoSave(): Promise<string> {
  const gameState = useGameStateStore.getState()
  const emotional = useEmotionalStore.getState()
  const inventory = useInventoryStore.getState()

  const slotId = gameState.saveSlotId ?? generateSlotId()

  const saveData: SaveData = {
    id: slotId,
    timestamp: new Date(),
    playerName: gameState.playerName,
    chapter: gameState.currentChapter,
    day: gameState.currentDay,
    emotional: {
      distress: emotional.distress,
      hope: emotional.hope,
      denial: emotional.denial,
      rumination: emotional.rumination,
      avoidanceCount: emotional.avoidanceCount,
      aggressiveChoiceCount: emotional.aggressiveChoiceCount,
      internalizedAngerCount: emotional.internalizedAngerCount,
      consecutiveHardDenial: emotional.consecutiveHardDenial,
    },
    inventory: {
      flashbackUnlocked: inventory.flashbackUnlocked,
      actionHistory: inventory.actionHistory,
      inventory: inventory.inventory,
    },
  }

  await saveGame(saveData)
  useGameStateStore.getState().setSaveSlotId(slotId)
  return slotId
}

export async function loadAndVerify(slotId: string): Promise<boolean> {
  const saveData = await loadGame(slotId)
  if (!saveData) return false

  useGameStateStore.getState().hydrate({
    playerName: saveData.playerName,
    currentChapter: saveData.chapter,
    currentDay: saveData.day,
    saveSlotId: slotId,
  })

  useEmotionalStore.getState().hydrate(saveData.emotional)
  useInventoryStore.getState().hydrate(saveData.inventory)

  return true
}
