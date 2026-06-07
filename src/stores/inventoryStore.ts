import { create } from 'zustand'
import type { FlashbackId } from '@/types/game'

export interface InventoryState {
  flashbackUnlocked: FlashbackId[]
  actionHistory: string[] // mission IDs completed across all chapters
  inventory: string[] // collected item IDs (gifts, keepsakes)
}

interface InventoryActions {
  unlockFlashback: (id: FlashbackId) => void
  isFlashbackUnlocked: (id: FlashbackId) => boolean
  addToHistory: (missionId: string) => void
  hasCompletedMission: (missionId: string) => boolean
  addItem: (itemId: string) => void
  removeItem: (itemId: string) => void
  hasItem: (itemId: string) => boolean
  hydrate: (state: InventoryState) => void
}

const initialState: InventoryState = {
  flashbackUnlocked: [],
  actionHistory: [],
  inventory: [],
}

export const useInventoryStore = create<InventoryState & InventoryActions>((set, get) => ({
  ...initialState,

  unlockFlashback: (id) => {
    set((s) => ({
      flashbackUnlocked: s.flashbackUnlocked.includes(id)
        ? s.flashbackUnlocked
        : [...s.flashbackUnlocked, id],
    }))
  },

  isFlashbackUnlocked: (id) => get().flashbackUnlocked.includes(id),

  addToHistory: (missionId) => {
    set((s) => ({
      actionHistory: s.actionHistory.includes(missionId)
        ? s.actionHistory
        : [...s.actionHistory, missionId],
    }))
  },

  hasCompletedMission: (missionId) => get().actionHistory.includes(missionId),

  addItem: (itemId) => {
    set((s) => ({
      inventory: s.inventory.includes(itemId) ? s.inventory : [...s.inventory, itemId],
    }))
  },

  removeItem: (itemId) => {
    set((s) => ({ inventory: s.inventory.filter((i) => i !== itemId) }))
  },

  hasItem: (itemId) => get().inventory.includes(itemId),

  hydrate: (state) => {
    set(state)
  },
}))
