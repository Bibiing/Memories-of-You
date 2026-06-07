import type { QuestionBank } from '@/types/questions'
import prologueData from './prologue.json'
import denialData from './denial.json'
import angerData from './anger.json'
import bargainingData from './bargaining.json'
import depressionData from './depression.json'
import acceptanceData from './acceptance.json'
import type { Chapter } from '@/types/game'

export const questionBanks: Record<Chapter, QuestionBank | null> = {
  prologue: prologueData as QuestionBank,
  denial: denialData as QuestionBank,
  anger: angerData as QuestionBank,
  bargaining: bargainingData as QuestionBank,
  depression: depressionData as QuestionBank,
  acceptance: acceptanceData as QuestionBank,
  epilogue: null,
}

export function getQuestionsForChapter(chapter: Chapter): QuestionBank | null {
  return questionBanks[chapter]
}
