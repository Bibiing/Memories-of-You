import type { Chapter, FlashbackId, Location } from './game'

export type SpeakerType = 'MC' | 'Dia' | 'NPC_hangout' | 'NPC_curhat' | 'Cactus' | 'System'

export const SPEAKER_DISPLAY: Record<SpeakerType, string> = {
  MC: 'Aku',
  Dia: 'Dia',
  NPC_hangout: '???',
  NPC_curhat: '???',
  Cactus: 'Kaktus',
  System: '',
}

export interface DialogueWeights {
  distress?: number
  hope?: number
  denial?: number
}

export interface DialogueCondition {
  stat: 'distress' | 'hope' | 'denial'
  op: '>' | '<' | '>=' | '<='
  value: number
}

export interface DialogueChoice {
  label: string
  next: string | null
  weights?: DialogueWeights
  condition?: DialogueCondition
}

export interface DialogueNode {
  id: string
  speaker: SpeakerType
  text: string
  // next: string = continue; null = end dialogue; omit = wait for choice
  next?: string | null
  choices?: DialogueChoice[]
  timedSeconds?: number
  weights?: DialogueWeights
  flashback?: FlashbackId
  sfx?: string
}

export interface DialogueScript {
  id: string
  chapter: Chapter
  startNode: string
  nodes: DialogueNode[]
}

// Trigger placed in a scene
export type TriggerActionType =
  | { type: 'flashback'; flashbackId: FlashbackId }
  | { type: 'dialogue'; scriptId: string }
  | { type: 'mission'; missionId: string }

export interface InteractionTrigger {
  id: string
  location: Location
  label: string
  position: { x: number; y: number } // % of scene dimensions
  chapter?: Chapter // undefined = available in all chapters
  action: TriggerActionType
  oneTime?: boolean // disappears after first use
}
