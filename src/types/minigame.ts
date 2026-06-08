export interface MiniGameResult {
  success: boolean
  score?: number
  timeTaken?: number
}

export interface MiniGameProps<T = unknown> {
  config: T
  onComplete: (result: MiniGameResult) => void
  onAbandon: () => void
}

// ── Slider Puzzle ─────────────────────────────────────────────
export interface SliderPuzzleConfig {
  rows: number
  cols: number
  // 0 = empty, 1 = wall, 2 = player start, 3 = goal
  grid: number[][]
}

// ── Hidden Object ─────────────────────────────────────────────
export interface HiddenTarget {
  id: string
  x: number // percentage 0–100
  y: number
  radius: number
  label: string
}

export interface HiddenObjectConfig {
  timeLimit: number
  targets: HiddenTarget[]
}

// ── Word Puzzle ───────────────────────────────────────────────
export interface WordPuzzleConfig {
  target: string
  letters: string[]
  timeLimit: number
}

// ── Quick-Time Event ──────────────────────────────────────────
export interface QTETarget {
  id: string
  x: number
  y: number
  label: string
}

export interface QuickTimeEventConfig {
  duration: number // total seconds
  spawnInterval: number // seconds between new targets
  targets: QTETarget[]
}

// ── Hold to Delete ────────────────────────────────────────────
export interface HoldElement {
  id: string
  label: string
  color: string
}

export interface HoldToDeleteConfig {
  elements: HoldElement[]
  holdDuration: number // ms to hold
}

// ── Drag Drop Scheduler ───────────────────────────────────────
export interface SchedulerTask {
  id: string
  label: string
  duration: number // time slots it occupies
  color: string
}

export interface DragDropSchedulerConfig {
  tasks: SchedulerTask[]
  slots: string[] // slot labels e.g. ["08:00","09:00","10:00"]
  correctMapping: Record<string, string> // taskId → slotId
}

// ── Struggle Button ───────────────────────────────────────────
export interface StruggleButtonConfig {
  target: number // number of clicks to succeed
  label: string
  timeLimit: number
}

// ── Find the Difference ───────────────────────────────────────
export interface Difference {
  id: string
  x: number
  y: number
  radius: number
}

export interface FindTheDifferenceConfig {
  differences: Difference[]
  timeLimit: number
}

// ── Room Decoration ───────────────────────────────────────────
export interface DecoItem {
  id: string
  label: string
  color: string
}

export interface DecoSlot {
  id: string
  label: string
  x: number
  y: number
  accepts: string // item id
}

export interface RoomDecorationConfig {
  items: DecoItem[]
  slots: DecoSlot[]
}

// ── Planting Game ─────────────────────────────────────────────
export interface PlantStep {
  id: string
  label: string
  icon: string
}

export interface PlantingGameConfig {
  steps: PlantStep[]
  correctOrder: string[] // step ids in correct sequence
}

// ── Breathing Rhythm ──────────────────────────────────────────
export interface BreathingRhythmConfig {
  inhaleSeconds: number
  holdSeconds: number
  exhaleSeconds: number
  cycles: number
}

// ── Mini-Game Type Map ─────────────────────────────────────────
export type MiniGameType =
  | 'slider-puzzle'
  | 'hidden-object'
  | 'word-puzzle'
  | 'quick-time-event'
  | 'hold-to-delete'
  | 'drag-drop-scheduler'
  | 'struggle-button'
  | 'find-the-difference'
  | 'room-decoration'
  | 'planting-game'
  | 'breathing-rhythm'
