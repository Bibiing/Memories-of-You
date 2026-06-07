import type { DialogueScript } from '@/types/dialogue'
import type { Chapter } from '@/types/game'

import prologueKamarData from './prologue_kamar.json'
import eveningPrologueData from './evening_prologue.json'
import eveningDenialData from './evening_denial.json'
import eveningAngerData from './evening_anger.json'
import eveningBargainingData from './evening_bargaining.json'
import eveningDepressionData from './evening_depression.json'
import eveningAcceptanceData from './evening_acceptance.json'

export const DIALOGUE_SCRIPTS: Record<string, DialogueScript> = {
  prologue_kamar: prologueKamarData as DialogueScript,
  evening_prologue: eveningPrologueData as DialogueScript,
  evening_denial: eveningDenialData as DialogueScript,
  evening_anger: eveningAngerData as DialogueScript,
  evening_bargaining: eveningBargainingData as DialogueScript,
  evening_depression: eveningDepressionData as DialogueScript,
  evening_acceptance: eveningAcceptanceData as DialogueScript,
}

export function getEveningScript(chapter: Chapter): DialogueScript | null {
  const key = `evening_${chapter}`
  return DIALOGUE_SCRIPTS[key] ?? null
}

export function getDialogueScript(id: string): DialogueScript | null {
  return DIALOGUE_SCRIPTS[id] ?? null
}
