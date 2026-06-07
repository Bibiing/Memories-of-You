import { describe, it, expect, beforeEach } from 'vitest'
import { autoSave, loadAndVerify } from '../autoSave'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { useInventoryStore } from '@stores/inventoryStore'
import { db } from '../saveSchema'

// Reset all store and DB state before each test
beforeEach(async () => {
  useGameStateStore.getState().reset()
  useEmotionalStore.getState().hydrate({
    distress: 20,
    hope: 80,
    denial: 0,
    rumination: 'neutral',
    avoidanceCount: 0,
    aggressiveChoiceCount: 0,
    internalizedAngerCount: 0,
    consecutiveHardDenial: 0,
  })
  useInventoryStore.getState().hydrate({
    flashbackUnlocked: [],
    actionHistory: [],
    inventory: [],
  })
  await db.saves.clear()
  await db.settings.clear()
})

describe('autoSave()', () => {
  it('returns a slot ID string', async () => {
    useGameStateStore.getState().setPlayerName('Reyhan')
    const slotId = await autoSave()
    expect(typeof slotId).toBe('string')
    expect(slotId.startsWith('slot_')).toBe(true)
  })

  it('persists the save to IndexedDB', async () => {
    useGameStateStore.getState().setPlayerName('Anya')
    const slotId = await autoSave()

    const record = await db.saves.get(slotId)
    expect(record).toBeDefined()
    expect(record?.playerName).toBe('Anya')
  })

  it('stores encrypted data and IV in the record', async () => {
    useGameStateStore.getState().setPlayerName('Kaito')
    const slotId = await autoSave()

    const record = await db.saves.get(slotId)
    expect(record?.iv).toBeTruthy()
    expect(record?.encryptedData).toBeTruthy()
    expect(record?.integrityHash).toBeTruthy()
  })

  it('stores playerName and chapter as plain metadata', async () => {
    useGameStateStore.getState().setPlayerName('Sakura')
    useGameStateStore.getState().setChapter('denial')
    const slotId = await autoSave()

    const record = await db.saves.get(slotId)
    expect(record?.playerName).toBe('Sakura')
    expect(record?.chapter).toBe('denial')
  })

  it('reuses an existing slot ID if one is already set', async () => {
    useGameStateStore.getState().setPlayerName('Player')
    const slotId1 = await autoSave()

    // Save again — should overwrite same slot
    const slotId2 = await autoSave()
    expect(slotId1).toBe(slotId2)

    // Only one record in DB
    const count = await db.saves.count()
    expect(count).toBe(1)
  })

  it('stores the correct day value', async () => {
    useGameStateStore.getState().setPlayerName('Player')
    useGameStateStore.getState().setDay(5)
    const slotId = await autoSave()

    const record = await db.saves.get(slotId)
    expect(record?.day).toBe(5)
  })
})

describe('loadAndVerify()', () => {
  it('returns true and hydrates stores on success', async () => {
    useGameStateStore.getState().setPlayerName('Nara')
    useGameStateStore.getState().setChapter('anger')
    useGameStateStore.getState().setDay(3)
    useEmotionalStore.getState().adjustDistress(40) // distress: 20+40 = 60

    const slotId = await autoSave()

    // Reset everything
    useGameStateStore.getState().reset()
    useEmotionalStore.getState().hydrate({
      distress: 0,
      hope: 0,
      denial: 0,
      rumination: 'neutral',
      avoidanceCount: 0,
      aggressiveChoiceCount: 0,
      internalizedAngerCount: 0,
      consecutiveHardDenial: 0,
    })

    const success = await loadAndVerify(slotId)
    expect(success).toBe(true)

    const gameState = useGameStateStore.getState()
    expect(gameState.playerName).toBe('Nara')
    expect(gameState.currentChapter).toBe('anger')
    expect(gameState.currentDay).toBe(3)

    const emotional = useEmotionalStore.getState()
    expect(emotional.distress).toBe(60)
  })

  it('returns false for a non-existent slot ID', async () => {
    const success = await loadAndVerify('slot_nonexistent_999')
    expect(success).toBe(false)
  })

  it('preserves inventory state across save/load', async () => {
    useGameStateStore.getState().setPlayerName('Player')
    useInventoryStore.getState().unlockFlashback('fb_telponan')
    useInventoryStore.getState().unlockFlashback('fb_makan')
    useInventoryStore.getState().addItem('keepsake_photo')

    const slotId = await autoSave()

    useInventoryStore
      .getState()
      .hydrate({ flashbackUnlocked: [], actionHistory: [], inventory: [] })

    await loadAndVerify(slotId)
    const inventory = useInventoryStore.getState()
    expect(inventory.flashbackUnlocked).toContain('fb_telponan')
    expect(inventory.flashbackUnlocked).toContain('fb_makan')
    expect(inventory.inventory).toContain('keepsake_photo')
  })

  it('preserves emotional counters across save/load', async () => {
    useGameStateStore.getState().setPlayerName('Player')
    useEmotionalStore.getState().incrementAvoidance()
    useEmotionalStore.getState().incrementAvoidance()
    useEmotionalStore.getState().incrementAggressiveChoice()
    useEmotionalStore.getState().incrementConsecutiveHardDenial()

    const slotId = await autoSave()

    useEmotionalStore.getState().hydrate({
      distress: 0,
      hope: 0,
      denial: 0,
      rumination: 'neutral',
      avoidanceCount: 0,
      aggressiveChoiceCount: 0,
      internalizedAngerCount: 0,
      consecutiveHardDenial: 0,
    })

    await loadAndVerify(slotId)
    const emotional = useEmotionalStore.getState()
    expect(emotional.avoidanceCount).toBe(2)
    expect(emotional.aggressiveChoiceCount).toBe(1)
    expect(emotional.consecutiveHardDenial).toBe(1)
  })

  it('preserves rumination mode across save/load', async () => {
    useGameStateStore.getState().setPlayerName('Player')
    useEmotionalStore.getState().setRumination('brooding')

    const slotId = await autoSave()

    useEmotionalStore.getState().setRumination('neutral')
    await loadAndVerify(slotId)

    expect(useEmotionalStore.getState().rumination).toBe('brooding')
  })
})

describe('Full save/load cycle data integrity', () => {
  it('round-trips all emotional variables with exact values', async () => {
    useGameStateStore.getState().setPlayerName('Integrity Test')

    useEmotionalStore.getState().hydrate({
      distress: 67,
      hope: 43,
      denial: 28,
      rumination: 'reflection',
      avoidanceCount: 3,
      aggressiveChoiceCount: 2,
      internalizedAngerCount: 1,
      consecutiveHardDenial: 4,
    })

    const slotId = await autoSave()

    useEmotionalStore.getState().hydrate({
      distress: 0,
      hope: 0,
      denial: 0,
      rumination: 'neutral',
      avoidanceCount: 0,
      aggressiveChoiceCount: 0,
      internalizedAngerCount: 0,
      consecutiveHardDenial: 0,
    })

    await loadAndVerify(slotId)

    const emotional = useEmotionalStore.getState()
    expect(emotional.distress).toBe(67)
    expect(emotional.hope).toBe(43)
    expect(emotional.denial).toBe(28)
    expect(emotional.rumination).toBe('reflection')
    expect(emotional.avoidanceCount).toBe(3)
    expect(emotional.aggressiveChoiceCount).toBe(2)
    expect(emotional.internalizedAngerCount).toBe(1)
    expect(emotional.consecutiveHardDenial).toBe(4)
  })
})
