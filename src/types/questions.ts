import type { Chapter, RuminationMode } from './game'

export interface QuestionWeights {
  distress: number // delta: negative = reduce, positive = increase
  hope: number
  denial: number
  ruminationShift?: RuminationMode
  incrementsAvoidance?: boolean
  incrementsAggression?: boolean
  incrementsInternalized?: boolean
  incrementsHardDenial?: boolean
}

export interface QuestionOption {
  label: string
  weights: QuestionWeights
}

export interface ReflectionQuestion {
  id: string
  chapter: Chapter
  order: number
  text: string
  timedSeconds?: number // if present, triggers countdown UI
  options: QuestionOption[]
}

export interface QuestionBank {
  chapter: Chapter
  questions: ReflectionQuestion[]
}
