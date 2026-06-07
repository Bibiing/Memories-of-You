import { create } from 'zustand'
import type { RuminationMode } from '@/types/game'

export interface EmotionalState {
  distress: number // 0–100
  hope: number // 0–100
  denial: number // 0–100
  rumination: RuminationMode

  // Counters tracked per chapter session
  avoidanceCount: number
  aggressiveChoiceCount: number
  internalizedAngerCount: number
  consecutiveHardDenial: number
}

interface EmotionalActions {
  setDistress: (value: number) => void
  setHope: (value: number) => void
  setDenial: (value: number) => void
  setRumination: (mode: RuminationMode) => void

  adjustDistress: (delta: number) => void
  adjustHope: (delta: number) => void
  adjustDenial: (delta: number) => void

  incrementAvoidance: () => void
  incrementAggressiveChoice: () => void
  incrementInternalizedAnger: () => void
  incrementConsecutiveHardDenial: () => void
  resetConsecutiveHardDenial: () => void
  resetSessionCounters: () => void

  hydrate: (state: EmotionalState) => void
}

const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, value))

const initialState: EmotionalState = {
  distress: 20,
  hope: 80,
  denial: 0,
  rumination: 'neutral',
  avoidanceCount: 0,
  aggressiveChoiceCount: 0,
  internalizedAngerCount: 0,
  consecutiveHardDenial: 0,
}

export const useEmotionalStore = create<EmotionalState & EmotionalActions>((set) => ({
  ...initialState,

  setDistress: (value) => {
    set({ distress: clamp(value) })
  },
  setHope: (value) => {
    set({ hope: clamp(value) })
  },
  setDenial: (value) => {
    set({ denial: clamp(value) })
  },
  setRumination: (mode) => {
    set({ rumination: mode })
  },

  adjustDistress: (delta) => {
    set((s) => ({ distress: clamp(s.distress + delta) }))
  },
  adjustHope: (delta) => {
    set((s) => ({ hope: clamp(s.hope + delta) }))
  },
  adjustDenial: (delta) => {
    set((s) => ({ denial: clamp(s.denial + delta) }))
  },

  incrementAvoidance: () => {
    set((s) => ({ avoidanceCount: s.avoidanceCount + 1 }))
  },
  incrementAggressiveChoice: () => {
    set((s) => ({ aggressiveChoiceCount: s.aggressiveChoiceCount + 1 }))
  },
  incrementInternalizedAnger: () => {
    set((s) => ({ internalizedAngerCount: s.internalizedAngerCount + 1 }))
  },
  incrementConsecutiveHardDenial: () => {
    set((s) => ({ consecutiveHardDenial: s.consecutiveHardDenial + 1 }))
  },
  resetConsecutiveHardDenial: () => {
    set({ consecutiveHardDenial: 0 })
  },

  resetSessionCounters: () => {
    set({
      avoidanceCount: 0,
      aggressiveChoiceCount: 0,
      internalizedAngerCount: 0,
      consecutiveHardDenial: 0,
    })
  },

  hydrate: (state) => {
    set(state)
  },
}))
