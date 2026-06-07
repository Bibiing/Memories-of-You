import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStateStore } from '@stores/gameStateStore'
import type { Chapter, CactusState } from '@/types/game'
import { CHAPTER_CACTUS_STATE } from '@/types/game'

// Unit tests for scene-routing logic and chapter→cactus mapping.
// Component rendering tests are deferred to E2E (no jsdom in this suite).

describe('Chapter → CactusState mapping', () => {
  const expected: Record<Chapter, CactusState> = {
    prologue: 'healthy',
    denial: 'sick',
    anger: 'very-sick',
    bargaining: 'dead-trying',
    depression: 'dead',
    acceptance: 'empty-pot',
    epilogue: 'sprouting',
  }

  for (const [chapter, cactusState] of Object.entries(expected) as [Chapter, CactusState][]) {
    it(`${chapter} → ${cactusState}`, () => {
      expect(CHAPTER_CACTUS_STATE[chapter]).toBe(cactusState)
    })
  }
})

describe('GameStateStore scene routing', () => {
  beforeEach(() => {
    useGameStateStore.setState({ currentScene: 'main-menu' })
  })

  it('starts on main-menu', () => {
    expect(useGameStateStore.getState().currentScene).toBe('main-menu')
  })

  it('setScene updates currentScene', () => {
    useGameStateStore.getState().setScene('gameplay')
    expect(useGameStateStore.getState().currentScene).toBe('gameplay')
  })

  it('all scene values are settable', () => {
    const scenes = [
      'main-menu', 'name-input', 'load-screen', 'gameplay',
      'evening-reflection', 'flashback', 'chapter-transition', 'credits',
    ] as const
    for (const scene of scenes) {
      useGameStateStore.getState().setScene(scene)
      expect(useGameStateStore.getState().currentScene).toBe(scene)
    }
  })
})
