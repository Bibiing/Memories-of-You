import type { DialogueScript } from '@/types/dialogue'
import type { Chapter } from '@/types/game'

// ── Prologue ──────────────────────────────────────────────────────────────────
import prologueKamarData        from './prologue_kamar.json'
import prologueTamanData        from './prologue/prologue_step1_taman.json'
import prologuePasarData        from './prologue/prologue_step3_pasar.json'
import prologuePilihKaktusData  from './prologue/prologue_step5_pilih_kaktus.json'
import prologueKamarStep6Data   from './prologue/prologue_step6_kamar.json'
import prologueRooftopData      from './prologue/prologue_step9_rooftop.json'

// ── Evening reflections ───────────────────────────────────────────────────────
import eveningPrologueData      from './evening_prologue.json'
import eveningDenialData        from './evening_denial.json'
import eveningAngerData         from './evening_anger.json'
import eveningBargainingData    from './evening_bargaining.json'
import eveningDepressionData    from './evening_depression.json'
import eveningAcceptanceData    from './evening_acceptance.json'

// ── Denial daily dialogues ────────────────────────────────────────────────────
import denialDay1Data           from './denial/denial_day1.json'
import denialDay2Data           from './denial/denial_day2.json'
import denialDay3CanonData      from './denial/denial_day3_canon.json'

// ── Anger daily dialogues ─────────────────────────────────────────────────────
import angerDay1Data            from './anger/anger_day1.json'
import angerDay2Data            from './anger/anger_day2.json'
import angerDay3CanonData       from './anger/anger_day3_canon.json'

export const DIALOGUE_SCRIPTS: Record<string, DialogueScript> = {
  // Prologue
  prologue_kamar:               prologueKamarData        as DialogueScript,
  prologue_step1_taman:         prologueTamanData        as DialogueScript,
  prologue_step3_pasar:         prologuePasarData        as DialogueScript,
  prologue_step5_pilih_kaktus:  prologuePilihKaktusData  as DialogueScript,
  prologue_step6_kamar:         prologueKamarStep6Data   as DialogueScript,
  prologue_step9_rooftop:       prologueRooftopData      as DialogueScript,

  // Evening reflections
  evening_prologue:             eveningPrologueData      as DialogueScript,
  evening_denial:               eveningDenialData        as DialogueScript,
  evening_anger:                eveningAngerData         as DialogueScript,
  evening_bargaining:           eveningBargainingData    as DialogueScript,
  evening_depression:           eveningDepressionData    as DialogueScript,
  evening_acceptance:           eveningAcceptanceData    as DialogueScript,

  // Denial
  denial_day1:                  denialDay1Data           as DialogueScript,
  denial_day2:                  denialDay2Data           as DialogueScript,
  denial_day3_canon:            denialDay3CanonData      as DialogueScript,

  // Anger
  anger_day1:                   angerDay1Data            as DialogueScript,
  anger_day2:                   angerDay2Data            as DialogueScript,
  anger_day3_canon:             angerDay3CanonData       as DialogueScript,
}

export function getEveningScript(chapter: Chapter): DialogueScript | null {
  const key = `evening_${chapter}`
  return DIALOGUE_SCRIPTS[key] ?? null
}

export function getDialogueScript(id: string): DialogueScript | null {
  return DIALOGUE_SCRIPTS[id] ?? null
}
