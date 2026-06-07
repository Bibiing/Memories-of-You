/**
 * 7-Day Gameplay Simulation
 *
 * Simulates a player going through an evening reflection over 7 days in the Denial chapter.
 * Validates that:
 *   1. Emotional state changes predictably based on question answers
 *   2. Expert System fires the correct rules when thresholds are reached
 *   3. No dead-end state is reachable from a fresh game start
 *   4. NPC intervention triggers at day 7 if still in the same chapter
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  evaluateNight,
  checkChapterTransition,
  checkNPCIntervention,
  getNextChapter,
} from '../engine'
import type { ExpertSystemContext } from '../types'
import type { RuminationMode } from '@/types/game'

interface SimEmotional {
  distress: number
  hope: number
  denial: number
  rumination: RuminationMode
  avoidanceCount: number
  aggressiveChoiceCount: number
  internalizedAngerCount: number
  consecutiveHardDenial: number
}

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

function applyWeights(
  state: SimEmotional,
  weights: {
    distress: number
    hope: number
    denial: number
    ruminationShift?: RuminationMode
    incrementsAvoidance?: boolean
    incrementsHardDenial?: boolean
    incrementsAggression?: boolean
    incrementsInternalized?: boolean
  }
): SimEmotional {
  return {
    distress: clamp(state.distress + weights.distress),
    hope: clamp(state.hope + weights.hope),
    denial: clamp(state.denial + weights.denial),
    rumination: weights.ruminationShift ?? state.rumination,
    avoidanceCount: state.avoidanceCount + (weights.incrementsAvoidance ? 1 : 0),
    aggressiveChoiceCount: state.aggressiveChoiceCount + (weights.incrementsAggression ? 1 : 0),
    internalizedAngerCount: state.internalizedAngerCount + (weights.incrementsInternalized ? 1 : 0),
    consecutiveHardDenial: state.consecutiveHardDenial + (weights.incrementsHardDenial ? 1 : 0),
  }
}

const INITIAL_STATE: SimEmotional = {
  distress: 20,
  hope: 80,
  denial: 0,
  rumination: 'neutral',
  avoidanceCount: 0,
  aggressiveChoiceCount: 0,
  internalizedAngerCount: 0,
  consecutiveHardDenial: 0,
}

describe('7-Day Denial Chapter Simulation — Hard Denial Pattern', () => {
  let state: SimEmotional

  beforeEach(() => {
    state = { ...INITIAL_STATE }
  })

  it('accumulates distress and denial over 7 days of avoidance pattern', () => {
    // Simulate a player who always avoids and denies reality
    const avoidanceAnswer = {
      distress: 4,
      hope: -3,
      denial: 5,
      incrementsAvoidance: true as const,
    }

    for (let day = 1; day <= 7; day++) {
      // Apply 4 avoidant answers per day session
      for (let q = 0; q < 4; q++) {
        state = applyWeights(state, avoidanceAnswer)
      }
    }

    expect(state.distress).toBeGreaterThan(20)
    expect(state.denial).toBeGreaterThan(20)
    expect(state.avoidanceCount).toBe(28)
    expect(state.hope).toBeLessThan(80)
  })

  it('triggers D-01 after sustained brooding + high distress', () => {
    // Simulate days building to distress 80+ with brooding
    state.distress = 78
    state.rumination = 'brooding'
    state = applyWeights(state, { distress: 5, hope: -2, denial: 3 })

    const ctx: ExpertSystemContext = {
      emotional: state,
      chapter: 'denial',
      day: 5,
      daysInChapter: 4,
    }

    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'chapter-transition' && o.nextChapter === 'anger')).toBe(
      true
    )
  })

  it('triggers D-02 when denial spikes to 80', () => {
    state.denial = 72
    state = applyWeights(state, {
      distress: 2,
      hope: 4,
      denial: 10,
      incrementsHardDenial: true,
    })

    const ctx: ExpertSystemContext = {
      emotional: state,
      chapter: 'denial',
      day: 3,
      daysInChapter: 2,
    }

    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'canon-event')).toBe(true)
  })

  it('triggers G-01 NPC intervention at day 7 in any chapter', () => {
    const ctx: ExpertSystemContext = {
      emotional: state,
      chapter: 'denial',
      day: 10,
      daysInChapter: 7,
    }

    expect(checkNPCIntervention(ctx)).toBe(true)

    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'npc-intervention')).toBe(true)
  })

  it('no dead-end: player can always progress from denial via D-01 (distress path)', () => {
    // Worst case: player only avoids (avoidanceCount rises, distress rises)
    // Game should eventually trigger chapter transition
    state.distress = 80
    state.rumination = 'brooding'

    const ctx: ExpertSystemContext = {
      emotional: state,
      chapter: 'denial',
      day: 8,
      daysInChapter: 7,
    }

    // Both G-01 and D-01 should fire
    expect(checkChapterTransition(ctx)).toBe(true)
    expect(checkNPCIntervention(ctx)).toBe(true)
  })
})

describe('7-Day Denial Chapter Simulation — Recovery Pattern', () => {
  let state: SimEmotional

  beforeEach(() => {
    state = { ...INITIAL_STATE }
  })

  it('reaches lower distress with reflection pattern', () => {
    const reflectionAnswer = {
      distress: -2,
      hope: 4,
      denial: -3,
      ruminationShift: 'reflection' as const,
    }

    for (let day = 1; day <= 7; day++) {
      for (let q = 0; q < 4; q++) {
        state = applyWeights(state, reflectionAnswer)
      }
    }

    expect(state.distress).toBeLessThan(INITIAL_STATE.distress)
    expect(state.hope).toBeGreaterThan(INITIAL_STATE.hope)
    expect(state.rumination).toBe('reflection')
  })

  it('D-02 triggers if hope inflates beyond 80 even in reflection mode', () => {
    // Edge case: reflection pattern can inadvertently spike hope
    state.hope = 76
    state = applyWeights(state, { distress: -1, hope: 5, denial: 0 })
    // hope is now 81

    const ctx: ExpertSystemContext = {
      emotional: state,
      chapter: 'denial',
      day: 4,
      daysInChapter: 3,
    }

    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.type === 'canon-event')).toBe(true)
  })
})

describe('Multi-Chapter progression simulation', () => {
  it('simulates prologue → denial → anger chapter chain', () => {
    // Prologue: start fresh
    let emotional: SimEmotional = { ...INITIAL_STATE }
    let chapter = 'denial'

    // Day 1 denial: distress spikes
    emotional = applyWeights(emotional, {
      distress: 20,
      hope: -10,
      denial: 15,
      ruminationShift: 'brooding',
    })

    // Day 2: more distress
    emotional = applyWeights(emotional, { distress: 20, hope: -5, denial: 10 })

    // Day 3: push over 80 threshold
    emotional = applyWeights(emotional, { distress: 25, hope: -5, denial: 5 })

    const ctx: ExpertSystemContext = {
      emotional,
      chapter: 'denial' as const,
      day: 3,
      daysInChapter: 2,
    }

    expect(checkChapterTransition(ctx)).toBe(true)
    const next = getNextChapter(ctx)
    expect(next).toBe('anger')
    chapter = next ?? chapter
    expect(chapter).toBe('anger')
  })

  it('ensures anger chapter can lead to either depression or bargaining', () => {
    // Path 1: High distress → depression (A-01)
    const highDistressCtx: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 90 },
      chapter: 'anger',
      day: 5,
      daysInChapter: 3,
    }
    expect(getNextChapter(highDistressCtx)).toBe('depression')

    // Path 2: Brooding + moderate distress → bargaining (A-02)
    const broodingCtx: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 65, rumination: 'brooding' },
      chapter: 'anger',
      day: 5,
      daysInChapter: 3,
    }
    expect(getNextChapter(broodingCtx)).toBe('bargaining')
  })

  it('simulates full grief path: denial → anger → bargaining → depression → acceptance', () => {
    const chapters: string[] = []

    // denial → anger (via D-01: distress 80+, brooding)
    const denialExit: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 82, rumination: 'brooding' },
      chapter: 'denial',
      day: 7,
      daysInChapter: 6,
    }
    chapters.push(getNextChapter(denialExit) ?? '')

    // anger → depression (via A-01: distress 90+)
    const angerExit: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 90 },
      chapter: 'anger',
      day: 12,
      daysInChapter: 5,
    }
    chapters.push(getNextChapter(angerExit) ?? '')

    // depression → acceptance (via DEP-02: distress < 50, hope > 40, daysInChapter ≥ 3)
    const depressionExit: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 40, hope: 50 },
      chapter: 'depression',
      day: 18,
      daysInChapter: 3,
    }
    chapters.push(getNextChapter(depressionExit) ?? '')

    // acceptance → epilogue (via ACC-01)
    const acceptanceExit: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 25, hope: 85, rumination: 'reflection' },
      chapter: 'acceptance',
      day: 24,
      daysInChapter: 5,
    }
    chapters.push(getNextChapter(acceptanceExit) ?? '')

    expect(chapters).toEqual(['anger', 'depression', 'acceptance', 'epilogue'])
  })
})

describe('Edge cases: extreme values', () => {
  it('state values are clamped at 100 after multiple positive deltas', () => {
    let state: SimEmotional = { ...INITIAL_STATE, distress: 95 }
    state = applyWeights(state, { distress: 20, hope: 0, denial: 0 })
    expect(state.distress).toBe(100)
  })

  it('state values do not go below 0', () => {
    let state: SimEmotional = { ...INITIAL_STATE, hope: 5 }
    state = applyWeights(state, { distress: 0, hope: -20, denial: 0 })
    expect(state.hope).toBe(0)
  })

  it('D-01 does not fire in wrong chapter (chapter isolation)', () => {
    const ctx: ExpertSystemContext = {
      emotional: { ...INITIAL_STATE, distress: 90, rumination: 'brooding' },
      chapter: 'bargaining',
      day: 5,
      daysInChapter: 4,
    }
    const outputs = evaluateNight(ctx)
    // D-01 is denial-only; should not fire in bargaining
    const denialRule = outputs.find(
      (o) => o.type === 'chapter-transition' && o.nextChapter === 'anger'
    )
    expect(denialRule).toBeUndefined()
  })

  it('multiple rules firing in the same night returns all applicable outputs', () => {
    // D-03 (denial>50), D-04 (brooding+denial>50), D-05 (hardDenial≥3) all fire together
    const ctx: ExpertSystemContext = {
      emotional: {
        ...INITIAL_STATE,
        denial: 60,
        rumination: 'brooding',
        consecutiveHardDenial: 3,
      },
      chapter: 'denial',
      day: 4,
      daysInChapter: 3,
    }
    const outputs = evaluateNight(ctx)
    expect(outputs.some((o) => o.visualEffect === 'hide-option-c')).toBe(true)
    expect(outputs.some((o) => o.visualEffect === 'speed-timer-1.5x')).toBe(true)
    expect(
      outputs.some((o) => o.type === 'narrative-response' && o.message?.includes('percaya'))
    ).toBe(true)
  })
})
