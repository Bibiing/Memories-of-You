import type { ExpertRule } from '@systems/expertSystem/types'

// ─── DENIAL RULES ──────────────────────────────────────────────────────────

const denialRules: ExpertRule[] = [
  {
    id: 'D-01',
    chapter: 'denial',
    description: 'Cognitive Depletion → Transition to Anger',
    priority: 90,
    condition: ({ emotional }) => emotional.distress >= 80 && emotional.rumination === 'brooding',
    action: () => ({
      type: 'chapter-transition',
      nextChapter: 'anger',
      message: 'Reality Crash triggered. Transitioning to Anger.',
      priority: 90,
    }),
  },
  {
    id: 'D-02',
    chapter: 'denial',
    description: 'CBT Exposure — False Hope triggers canon event',
    priority: 85,
    condition: ({ emotional }) => emotional.hope >= 80 || emotional.denial >= 80,
    action: () => ({
      type: 'canon-event',
      canonEventId: 'canon_denial_reality_crash',
      statAdjustment: { distress: 100 },
      visualEffect: 'shock-wave',
      message: 'Harapan semu runtuh. Realita menghantam.',
      priority: 85,
    }),
  },
  {
    id: 'D-03',
    chapter: 'denial',
    description: 'Cognitive Blindness — hide option C',
    priority: 70,
    condition: ({ emotional }) => emotional.denial > 50,
    action: () => ({
      type: 'visual-effect',
      visualEffect: 'hide-option-c',
      priority: 70,
    }),
  },
  {
    id: 'D-04',
    chapter: 'denial',
    description: 'Hyperarousal — speed up question timer',
    priority: 65,
    condition: ({ emotional }) => emotional.rumination === 'brooding' && emotional.denial > 50,
    action: () => ({
      type: 'visual-effect',
      visualEffect: 'speed-timer-1.5x',
      priority: 65,
    }),
  },
  {
    id: 'D-05',
    chapter: 'denial',
    description: 'Emotional Performance Detection',
    priority: 60,
    condition: ({ emotional }) => emotional.consecutiveHardDenial >= 3,
    action: () => ({
      type: 'narrative-response',
      message: 'Kamu percaya itu? Benar-benar percaya?',
      priority: 60,
    }),
  },
]

// ─── ANGER RULES ───────────────────────────────────────────────────────────

const angerRules: ExpertRule[] = [
  {
    id: 'A-01',
    chapter: 'anger',
    description: 'Allostatic Overload → Depression',
    priority: 95,
    condition: ({ emotional }) => emotional.distress >= 85,
    action: () => ({
      type: 'chapter-transition',
      nextChapter: 'depression',
      message: 'Allostatic Overload. Tubuh memaksa shutdown.',
      priority: 95,
    }),
  },
  {
    id: 'A-02',
    chapter: 'anger',
    description: 'Obsessive Rumination → Bargaining',
    priority: 85,
    condition: ({ emotional }) => emotional.rumination === 'brooding' && emotional.distress < 80,
    action: () => ({
      type: 'chapter-transition',
      nextChapter: 'bargaining',
      message: 'Marah yang obsesif, bukan eksplosif. Otak beralih ke kalkulasi.',
      priority: 85,
    }),
  },
  {
    id: 'A-03',
    chapter: 'anger',
    description: 'Boomerang Effect — aggression backfires',
    priority: 75,
    condition: ({ emotional }) => emotional.aggressiveChoiceCount >= 3,
    action: () => ({
      type: 'stat-adjustment',
      statAdjustment: { distress: 20 }, // +20 spike after temp relief
      message:
        'Melampiaskan amarah terasa lega sesaat. Tapi jalur kemarahan di otakmu semakin kuat.',
      visualEffect: 'distress-spike',
      priority: 75,
    }),
  },
  {
    id: 'A-04',
    chapter: 'anger',
    description: 'Internalized Anger → Depression Prevention Intervention',
    priority: 70,
    condition: ({ emotional }) => emotional.internalizedAngerCount >= 3,
    action: () => ({
      type: 'bonus-question',
      message:
        'Kamu menghukum dirimu sendiri terus. Pertanyaan penting: apakah kamu baik-baik saja?',
      priority: 70,
    }),
  },
  {
    id: 'A-05',
    chapter: 'anger',
    description: 'Defending ex behavior — still in Denial',
    priority: 60,
    condition: ({ emotional }) => emotional.consecutiveHardDenial > 2,
    action: () => ({
      type: 'narrative-response',
      statAdjustment: { hope: 10, distress: -5 },
      message: 'Kamu masih membela mantanmu.',
      priority: 60,
    }),
  },
]

// ─── BARGAINING RULES ──────────────────────────────────────────────────────

const bargainingRules: ExpertRule[] = [
  {
    id: 'B-01',
    chapter: 'bargaining',
    description: 'Avoidance Loop — stuck detection',
    priority: 80,
    condition: ({ emotional }) => emotional.avoidanceCount > 4,
    action: () => ({
      type: 'narrative-response',
      message: 'Pikiran yang sama lagi. Dan lagi. Kapan kamu akan lelah?',
      visualEffect: 'repetitive-glitch',
      priority: 80,
    }),
  },
  {
    id: 'B-02',
    chapter: 'bargaining',
    description: 'Bargaining → Acceptance (hope restored)',
    priority: 75,
    condition: ({ emotional }) => emotional.hope > 60 && emotional.rumination === 'reflection',
    action: () => ({
      type: 'chapter-transition',
      nextChapter: 'depression', // grief is non-linear; go through depression first
      message: 'Perenungan sehat mengarah ke kesadaran.',
      priority: 75,
    }),
  },
]

// ─── DEPRESSION RULES ──────────────────────────────────────────────────────

const depressionRules: ExpertRule[] = [
  {
    id: 'DEP-01',
    chapter: 'depression',
    description: 'Deep avoidance → forced introspection',
    priority: 80,
    condition: ({ emotional }) => emotional.distress >= 90 && emotional.avoidanceCount > 4,
    action: () => ({
      type: 'narrative-response',
      message:
        'Kamu tidak bisa terus menghindar dari dirimu sendiri. Malam ini, tidak ada pelarian.',
      priority: 80,
    }),
  },
  {
    id: 'DEP-02',
    chapter: 'depression',
    description: 'Gradual recovery → Acceptance',
    priority: 75,
    condition: ({ emotional, daysInChapter }) =>
      emotional.distress < 50 && emotional.hope > 40 && daysInChapter >= 3,
    action: () => ({
      type: 'chapter-transition',
      nextChapter: 'acceptance',
      message: 'Kegelapan mulai sedikit terangkat.',
      priority: 75,
    }),
  },
]

// ─── ACCEPTANCE RULES ──────────────────────────────────────────────────────

const acceptanceRules: ExpertRule[] = [
  {
    id: 'ACC-01',
    chapter: 'acceptance',
    description: 'True Acceptance criteria → Unlock Epilogue',
    priority: 95,
    condition: ({ emotional }) =>
      emotional.hope > 80 && emotional.rumination !== 'brooding' && emotional.distress < 40,
    action: () => ({
      type: 'chapter-transition',
      nextChapter: 'epilogue',
      message: 'True Acceptance. Sudah waktunya melangkah.',
      priority: 95,
    }),
  },
]

// ─── GLOBAL RULES ──────────────────────────────────────────────────────────

const globalRules: ExpertRule[] = [
  {
    id: 'G-01',
    chapter: 'any',
    description: 'NPC Intervention if stuck > 7 days',
    priority: 50,
    condition: ({ daysInChapter }) => daysInChapter >= 7,
    action: () => ({
      type: 'npc-intervention',
      message: 'Temanmu memperhatikan kamu terlihat berbeda belakangan ini. Mereka ingin ngobrol.',
      priority: 50,
    }),
  },
]

export const ruleBase: ExpertRule[] = [
  ...denialRules,
  ...angerRules,
  ...bargainingRules,
  ...depressionRules,
  ...acceptanceRules,
  ...globalRules,
]
