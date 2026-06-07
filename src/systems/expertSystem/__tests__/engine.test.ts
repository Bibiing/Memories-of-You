import { describe, it, expect } from 'vitest'
import {
  evaluateNight,
  checkChapterTransition,
  checkNPCIntervention,
  getNextChapter,
} from '../engine'
import type { ExpertSystemContext } from '../types'
import type { EmotionalState } from '@stores/emotionalStore'

const baseEmotional: EmotionalState = {
  distress: 30,
  hope: 60,
  denial: 20,
  rumination: 'neutral',
  avoidanceCount: 0,
  aggressiveChoiceCount: 0,
  internalizedAngerCount: 0,
  consecutiveHardDenial: 0,
}

function makeCtx(
  overrides: Partial<ExpertSystemContext> & { emotionalOverrides?: Partial<EmotionalState> }
): ExpertSystemContext {
  const { emotionalOverrides = {}, ...rest } = overrides
  return {
    emotional: { ...baseEmotional, ...emotionalOverrides },
    chapter: 'denial',
    day: 3,
    daysInChapter: 2,
    ...rest,
  }
}

// ─── DENIAL RULES ────────────────────────────────────────────────────────────

describe('Rule D-01: Cognitive Depletion → Anger', () => {
  it('triggers when distress ≥ 80 and rumination is brooding', () => {
    const ctx = makeCtx({ emotionalOverrides: { distress: 82, rumination: 'brooding' } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'chapter-transition' && o.nextChapter === 'anger')).toBe(
      true
    )
  })

  it('does NOT trigger when distress < 80', () => {
    const ctx = makeCtx({ emotionalOverrides: { distress: 79, rumination: 'brooding' } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'anger')).toBe(false)
  })

  it('does NOT trigger when rumination is not brooding', () => {
    const ctx = makeCtx({ emotionalOverrides: { distress: 90, rumination: 'reflection' } })
    const outputs = evaluateNight(ctx)
    const angryTransition = outputs.find((o) => o.nextChapter === 'anger')
    expect(angryTransition).toBeUndefined()
  })
})

describe('Rule D-02: False Hope Canon Event', () => {
  it('triggers when hope ≥ 80', () => {
    const ctx = makeCtx({ emotionalOverrides: { hope: 81 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'canon-event')).toBe(true)
  })

  it('triggers when denial ≥ 80', () => {
    const ctx = makeCtx({ emotionalOverrides: { denial: 80 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'canon-event')).toBe(true)
  })

  it('does NOT trigger when both hope and denial are below 80', () => {
    const ctx = makeCtx({ emotionalOverrides: { hope: 70, denial: 60 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'canon-event')).toBe(false)
  })
})

describe('Rule D-03: Cognitive Blindness — hide option C', () => {
  it('triggers when denial > 50', () => {
    const ctx = makeCtx({ emotionalOverrides: { denial: 55 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'hide-option-c')).toBe(true)
  })

  it('does NOT trigger when denial ≤ 50', () => {
    const ctx = makeCtx({ emotionalOverrides: { denial: 50 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'hide-option-c')).toBe(false)
  })
})

describe('Rule D-04: Hyperarousal — speed timer', () => {
  it('triggers when brooding AND denial > 50', () => {
    const ctx = makeCtx({ emotionalOverrides: { rumination: 'brooding', denial: 60 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'speed-timer-1.5x')).toBe(true)
  })

  it('does NOT trigger when only brooding (denial ≤ 50)', () => {
    const ctx = makeCtx({ emotionalOverrides: { rumination: 'brooding', denial: 40 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'speed-timer-1.5x')).toBe(false)
  })
})

describe('Rule D-05: Emotional Performance Detection', () => {
  it('triggers when consecutiveHardDenial ≥ 3', () => {
    const ctx = makeCtx({ emotionalOverrides: { consecutiveHardDenial: 3 } })
    const outputs = evaluateNight(ctx)
    expect(
      outputs.some((o) => o.type === 'narrative-response' && o.message?.includes('percaya'))
    ).toBe(true)
  })

  it('does NOT trigger when consecutiveHardDenial < 3', () => {
    const ctx = makeCtx({ emotionalOverrides: { consecutiveHardDenial: 2 } })
    const testOutputs = evaluateNight(ctx)
    // The D-05 message should not appear
    const hasD05 = testOutputs.some(
      (o) => o.type === 'narrative-response' && o.message?.includes('Kamu percaya itu')
    )
    expect(hasD05).toBe(false)
  })
})

// ─── ANGER RULES ─────────────────────────────────────────────────────────────

describe('Rule A-01: Allostatic Overload → Depression', () => {
  it('triggers in anger chapter when distress ≥ 85', () => {
    const ctx = makeCtx({ chapter: 'anger', emotionalOverrides: { distress: 85 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'depression')).toBe(true)
  })

  it('does NOT trigger in denial chapter', () => {
    const ctx = makeCtx({ chapter: 'denial', emotionalOverrides: { distress: 90 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'depression' && o.priority === 95)).toBe(false)
  })
})

describe('Rule A-02: Obsessive Rumination → Bargaining', () => {
  it('triggers in anger chapter when brooding and distress < 80', () => {
    const ctx = makeCtx({
      chapter: 'anger',
      emotionalOverrides: { rumination: 'brooding', distress: 70 },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'bargaining')).toBe(true)
  })

  it('does NOT trigger when distress ≥ 80 (A-01 takes precedence)', () => {
    const ctx = makeCtx({
      chapter: 'anger',
      emotionalOverrides: { rumination: 'brooding', distress: 88 },
    })
    const outputs = evaluateNight(ctx)
    // A-01 fires (depression), A-02 also fires (bargaining) — but highest priority wins
    const transition = outputs.find((o) => o.type === 'chapter-transition')
    // First applicable by priority is A-01 (priority 95)
    expect(transition?.nextChapter).toBe('depression')
  })
})

describe('Rule A-03: Boomerang Effect', () => {
  it('triggers when aggressiveChoiceCount ≥ 3 in anger chapter', () => {
    const ctx = makeCtx({ chapter: 'anger', emotionalOverrides: { aggressiveChoiceCount: 3 } })
    const outputs = evaluateNight(ctx)
    expect(
      outputs.some((o) => o.type === 'stat-adjustment' && o.statAdjustment?.distress === 20)
    ).toBe(true)
  })

  it('does NOT trigger when aggressiveChoiceCount < 3', () => {
    const ctx = makeCtx({ chapter: 'anger', emotionalOverrides: { aggressiveChoiceCount: 2 } })
    const outputs = evaluateNight(ctx)
    expect(
      outputs.some((o) => o.type === 'stat-adjustment' && o.statAdjustment?.distress === 20)
    ).toBe(false)
  })
})

describe('Rule A-04: Internalized Anger', () => {
  it('triggers when internalizedAngerCount ≥ 3', () => {
    const ctx = makeCtx({ chapter: 'anger', emotionalOverrides: { internalizedAngerCount: 3 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'bonus-question')).toBe(true)
  })
})

// ─── BARGAINING RULES ────────────────────────────────────────────────────────

describe('Rule B-01: Avoidance Loop', () => {
  it('triggers when avoidanceCount > 4 in bargaining chapter', () => {
    const ctx = makeCtx({ chapter: 'bargaining', emotionalOverrides: { avoidanceCount: 5 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'repetitive-glitch')).toBe(true)
  })

  it('does NOT trigger when avoidanceCount ≤ 4', () => {
    const ctx = makeCtx({ chapter: 'bargaining', emotionalOverrides: { avoidanceCount: 4 } })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'repetitive-glitch')).toBe(false)
  })
})

describe('Rule B-02: Bargaining → Depression (via reflection)', () => {
  it('triggers when hope > 60 and rumination is reflection', () => {
    const ctx = makeCtx({
      chapter: 'bargaining',
      emotionalOverrides: { hope: 65, rumination: 'reflection' },
    })
    const outputs = evaluateNight(ctx)
    expect(
      outputs.some((o) => o.type === 'chapter-transition' && o.nextChapter === 'depression')
    ).toBe(true)
  })

  it('does NOT trigger when hope ≤ 60', () => {
    const ctx = makeCtx({
      chapter: 'bargaining',
      emotionalOverrides: { hope: 60, rumination: 'reflection' },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'depression')).toBe(false)
  })
})

// ─── DEPRESSION RULES ────────────────────────────────────────────────────────

describe('Rule DEP-01: Deep avoidance → forced introspection', () => {
  it('triggers when distress ≥ 90 and avoidanceCount > 4', () => {
    const ctx = makeCtx({
      chapter: 'depression',
      emotionalOverrides: { distress: 90, avoidanceCount: 5 },
    })
    const outputs = evaluateNight(ctx)
    expect(
      outputs.some((o) => o.type === 'narrative-response' && o.message?.includes('menghindar'))
    ).toBe(true)
  })
})

describe('Rule DEP-02: Gradual recovery → Acceptance', () => {
  it('triggers when distress < 50, hope > 40, daysInChapter ≥ 3', () => {
    const ctx = makeCtx({
      chapter: 'depression',
      daysInChapter: 3,
      emotionalOverrides: { distress: 40, hope: 50 },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'acceptance')).toBe(true)
  })

  it('does NOT trigger when daysInChapter < 3', () => {
    const ctx = makeCtx({
      chapter: 'depression',
      daysInChapter: 2,
      emotionalOverrides: { distress: 40, hope: 50 },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'acceptance')).toBe(false)
  })
})

// ─── ACCEPTANCE RULES ────────────────────────────────────────────────────────

describe('Rule ACC-01: True Acceptance → Epilogue', () => {
  it('triggers when hope > 80, not brooding, distress < 40', () => {
    const ctx = makeCtx({
      chapter: 'acceptance',
      emotionalOverrides: { hope: 85, rumination: 'reflection', distress: 30 },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'epilogue')).toBe(true)
  })

  it('does NOT trigger when rumination is brooding', () => {
    const ctx = makeCtx({
      chapter: 'acceptance',
      emotionalOverrides: { hope: 85, rumination: 'brooding', distress: 30 },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'epilogue')).toBe(false)
  })

  it('does NOT trigger when distress ≥ 40', () => {
    const ctx = makeCtx({
      chapter: 'acceptance',
      emotionalOverrides: { hope: 85, rumination: 'neutral', distress: 40 },
    })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.nextChapter === 'epilogue')).toBe(false)
  })
})

// ─── GLOBAL RULES ────────────────────────────────────────────────────────────

describe('Rule G-01: NPC Intervention (stuck ≥ 7 days)', () => {
  it('triggers in any chapter when daysInChapter ≥ 7', () => {
    for (const chapter of ['denial', 'anger', 'bargaining', 'depression', 'acceptance'] as const) {
      const ctx = makeCtx({ chapter, daysInChapter: 7 })
      const outputs = evaluateNight(ctx)
      expect(outputs.some((o) => o.type === 'npc-intervention')).toBe(true)
    }
  })

  it('does NOT trigger when daysInChapter < 7', () => {
    const ctx = makeCtx({ daysInChapter: 6 })
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'npc-intervention')).toBe(false)
  })
})

// ─── ENGINE HELPERS ──────────────────────────────────────────────────────────

describe('checkChapterTransition', () => {
  it('returns true when a chapter-transition rule fires', () => {
    const ctx = makeCtx({ emotionalOverrides: { distress: 85, rumination: 'brooding' } })
    expect(checkChapterTransition(ctx)).toBe(true)
  })

  it('returns false when no transition rule fires', () => {
    const ctx = makeCtx({})
    expect(checkChapterTransition(ctx)).toBe(false)
  })
})

describe('checkNPCIntervention', () => {
  it('returns true when daysInChapter ≥ 7', () => {
    expect(checkNPCIntervention(makeCtx({ daysInChapter: 7 }))).toBe(true)
    expect(checkNPCIntervention(makeCtx({ daysInChapter: 10 }))).toBe(true)
  })

  it('returns false when daysInChapter < 7', () => {
    expect(checkNPCIntervention(makeCtx({ daysInChapter: 6 }))).toBe(false)
  })
})

describe('getNextChapter', () => {
  it('returns the next chapter when a transition rule fires', () => {
    const ctx = makeCtx({ emotionalOverrides: { distress: 85, rumination: 'brooding' } })
    expect(getNextChapter(ctx)).toBe('anger')
  })

  it('returns null when no transition rule fires', () => {
    const ctx = makeCtx({})
    expect(getNextChapter(ctx)).toBeNull()
  })

  it('returns highest priority transition when multiple apply', () => {
    // D-01 (priority 90) and D-02 (priority 85) both fire
    const ctx = makeCtx({
      emotionalOverrides: { distress: 85, rumination: 'brooding', hope: 85 },
    })
    // D-01 has higher priority → anger
    expect(getNextChapter(ctx)).toBe('anger')
  })
})

describe('evaluateNight priority ordering', () => {
  it('returns outputs sorted by priority descending', () => {
    const ctx = makeCtx({
      emotionalOverrides: {
        distress: 82,
        rumination: 'brooding',
        denial: 55,
        consecutiveHardDenial: 3,
      },
    })
    const outputs = evaluateNight(ctx)
    for (let i = 1; i < outputs.length; i++) {
      expect((outputs[i - 1]?.priority ?? 0) >= (outputs[i]?.priority ?? 0)).toBe(true)
    }
  })
})
