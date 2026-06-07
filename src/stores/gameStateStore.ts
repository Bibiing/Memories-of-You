import { create } from 'zustand'
import type { Chapter, GameScene, Location } from '@/types/game'

export interface GameState {
  // Identity
  playerName: string
  saveSlotId: string | null

  // Progress
  currentChapter: Chapter
  currentDay: number
  currentScene: GameScene
  currentLocation: Location

  // Flags
  isNewGame: boolean
  isGameCompleted: boolean
  hasSeenContentWarning: boolean

  // Available locations change per chapter
  availableLocations: Location[]

  // Chapter-specific days count (for NPC intervention trigger)
  daysInCurrentChapter: number

  // Missions completed today
  completedMissionsToday: string[]
}

interface GameStateActions {
  setPlayerName: (name: string) => void
  setSaveSlotId: (id: string) => void
  setChapter: (chapter: Chapter) => void
  setDay: (day: number) => void
  incrementDay: () => void
  setScene: (scene: GameScene) => void
  setLocation: (location: Location) => void
  setAvailableLocations: (locations: Location[]) => void
  markMissionCompleted: (missionId: string) => void
  clearDailyMissions: () => void
  incrementDaysInChapter: () => void
  resetDaysInChapter: () => void
  setGameCompleted: () => void
  setContentWarningSeen: () => void
  hydrate: (state: Partial<GameState>) => void
  reset: () => void
}

const CHAPTER_LOCATIONS: Record<Chapter, Location[]> = {
  prologue: ['kamar', 'taman', 'rooftop'],
  denial: ['kamar', 'kelas', 'lab', 'taman', 'pusat-perbelanjaan'],
  anger: ['kamar', 'lab', 'jalanan-kota'],
  bargaining: ['kamar', 'taman', 'pusat-perbelanjaan', 'bioskop', 'kelas', 'lab'],
  depression: ['kamar', 'lab', 'taman', 'kamar-mandi'],
  acceptance: ['kamar', 'kelas', 'lab', 'taman', 'jalanan-kota', 'pusat-perbelanjaan'],
  epilogue: ['kamar', 'venue-pameran'],
}

const initialState: GameState = {
  playerName: '',
  saveSlotId: null,
  currentChapter: 'prologue',
  currentDay: 1,
  currentScene: 'main-menu',
  currentLocation: 'kamar',
  isNewGame: true,
  isGameCompleted: false,
  hasSeenContentWarning: false,
  availableLocations: CHAPTER_LOCATIONS.prologue,
  daysInCurrentChapter: 0,
  completedMissionsToday: [],
}

export const useGameStateStore = create<GameState & GameStateActions>((set) => ({
  ...initialState,

  setPlayerName: (name) => {
    set({ playerName: name })
  },
  setSaveSlotId: (id) => {
    set({ saveSlotId: id })
  },

  setChapter: (chapter) => {
    set({
      currentChapter: chapter,
      availableLocations: CHAPTER_LOCATIONS[chapter],
      daysInCurrentChapter: 0,
      currentDay: 1,
      completedMissionsToday: [],
    })
  },

  setDay: (day) => {
    set({ currentDay: day })
  },
  incrementDay: () => {
    set((s) => ({
      currentDay: s.currentDay + 1,
      completedMissionsToday: [],
    }))
  },

  setScene: (scene) => {
    set({ currentScene: scene })
  },
  setLocation: (location) => {
    set({ currentLocation: location })
  },
  setAvailableLocations: (locations) => {
    set({ availableLocations: locations })
  },

  markMissionCompleted: (missionId) => {
    set((s) => ({
      completedMissionsToday: [...s.completedMissionsToday, missionId],
    }))
  },

  clearDailyMissions: () => {
    set({ completedMissionsToday: [] })
  },

  incrementDaysInChapter: () => {
    set((s) => ({ daysInCurrentChapter: s.daysInCurrentChapter + 1 }))
  },

  resetDaysInChapter: () => {
    set({ daysInCurrentChapter: 0 })
  },

  setGameCompleted: () => {
    set({ isGameCompleted: true })
  },
  setContentWarningSeen: () => {
    set({ hasSeenContentWarning: true })
  },

  hydrate: (state) => {
    set(state)
  },
  reset: () => {
    set(initialState)
  },
}))

export { CHAPTER_LOCATIONS }
