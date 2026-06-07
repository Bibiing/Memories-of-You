import type { EmotionalState } from '@stores/emotionalStore'
import type { Chapter } from '@/types/game'

export interface ExpertSystemContext {
  emotional: EmotionalState
  chapter: Chapter
  day: number
  daysInChapter: number
}

export type SystemOutputType =
  | 'narrative-response' // Text response shown to player
  | 'chapter-transition' // Move to next chapter
  | 'canon-event' // Trigger a canon event
  | 'npc-intervention' // Trigger NPC dialogue
  | 'stat-adjustment' // Modify emotional variables
  | 'visual-effect' // Trigger a specific visual effect
  | 'bonus-question' // Add extra question to evening reflection

export interface StatAdjustment {
  distress?: number
  hope?: number
  denial?: number
  avoidanceCount?: 1
  aggressiveChoiceCount?: 1
  internalizedAngerCount?: 1
  consecutiveHardDenial?: 1 | -999 // -999 = reset
}

export interface SystemOutput {
  type: SystemOutputType
  message?: string
  nextChapter?: Chapter
  canonEventId?: string
  statAdjustment?: StatAdjustment
  visualEffect?: string
  priority: number
}

export interface ExpertRule {
  id: string
  chapter: Chapter | 'any'
  description: string
  condition: (ctx: ExpertSystemContext) => boolean
  action: (ctx: ExpertSystemContext) => SystemOutput
  priority: number // Higher = evaluated first
}
