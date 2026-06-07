import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createRunner,
  currentNode,
  advance,
  choose,
} from '../runner'
import type { DialogueScript } from '@/types/dialogue'

// Mock the emotional store so applyNodeWeights doesn't fail
vi.mock('@stores/emotionalStore', () => ({
  useEmotionalStore: {
    getState: () => ({
      adjustDistress: vi.fn(),
      adjustHope: vi.fn(),
      adjustDenial: vi.fn(),
    }),
  },
}))

const LINEAR_SCRIPT: DialogueScript = {
  id: 'test_linear',
  chapter: 'prologue',
  startNode: 'n1',
  nodes: [
    { id: 'n1', speaker: 'MC', text: 'Node 1', next: 'n2' },
    { id: 'n2', speaker: 'Dia', text: 'Node 2', next: 'n3' },
    { id: 'n3', speaker: 'Cactus', text: 'Node 3', next: null },
  ],
}

const BRANCHING_SCRIPT: DialogueScript = {
  id: 'test_branch',
  chapter: 'denial',
  startNode: 'b1',
  nodes: [
    {
      id: 'b1',
      speaker: 'MC',
      text: 'Choose',
      choices: [
        { label: 'Option A', next: 'b2a', weights: { hope: 5 } },
        { label: 'Option B', next: 'b2b', weights: { distress: 3 } },
      ],
    },
    { id: 'b2a', speaker: 'Dia', text: 'Path A', next: null },
    { id: 'b2b', speaker: 'Cactus', text: 'Path B', next: null },
  ],
}

const DEAD_END_SCRIPT: DialogueScript = {
  id: 'test_dead',
  chapter: 'prologue',
  startNode: 'only',
  nodes: [{ id: 'only', speaker: 'System', text: 'Alone', next: null }],
}

describe('createRunner', () => {
  it('starts at startNode', () => {
    const state = createRunner(LINEAR_SCRIPT)
    expect(state.currentId).toBe('n1')
    expect(state.isFinished).toBe(false)
  })

  it('builds nodeMap from script nodes', () => {
    const state = createRunner(LINEAR_SCRIPT)
    expect(state.nodeMap.size).toBe(3)
    expect(state.nodeMap.has('n1')).toBe(true)
  })
})

describe('currentNode', () => {
  it('returns node at currentId', () => {
    const state = createRunner(LINEAR_SCRIPT)
    expect(currentNode(state)?.id).toBe('n1')
    expect(currentNode(state)?.text).toBe('Node 1')
  })

  it('returns null when isFinished', () => {
    const state = { ...createRunner(LINEAR_SCRIPT), currentId: null, isFinished: true }
    expect(currentNode(state)).toBeNull()
  })
})

describe('advance — linear script', () => {
  it('moves to next node', () => {
    let state = createRunner(LINEAR_SCRIPT)
    state = advance(state)
    expect(currentNode(state)?.id).toBe('n2')
    expect(state.isFinished).toBe(false)
  })

  it('finishes when next is null', () => {
    let state = createRunner(DEAD_END_SCRIPT)
    state = advance(state)
    expect(state.isFinished).toBe(true)
    expect(currentNode(state)).toBeNull()
  })

  it('can advance through all nodes', () => {
    let state = createRunner(LINEAR_SCRIPT)
    state = advance(state) // n1 → n2
    state = advance(state) // n2 → n3
    expect(currentNode(state)?.id).toBe('n3')
    state = advance(state) // n3 → finished
    expect(state.isFinished).toBe(true)
  })

  it('does not advance if node has choices', () => {
    let state = createRunner(BRANCHING_SCRIPT)
    const before = state
    state = advance(state) // should stay at b1
    expect(currentNode(state)?.id).toBe('b1')
    expect(state).toStrictEqual(before)
  })

  it('is immutable — original state unchanged', () => {
    const original = createRunner(LINEAR_SCRIPT)
    const next = advance(original)
    expect(original.currentId).toBe('n1')
    expect(next.currentId).toBe('n2')
  })
})

describe('choose — branching script', () => {
  let state: ReturnType<typeof createRunner>
  beforeEach(() => { state = createRunner(BRANCHING_SCRIPT) })

  it('choose(0) takes Path A', () => {
    const next = choose(state, 0)
    expect(currentNode(next)?.id).toBe('b2a')
    expect(next.isFinished).toBe(false)
  })

  it('choose(1) takes Path B', () => {
    const next = choose(state, 1)
    expect(currentNode(next)?.id).toBe('b2b')
  })

  it('advance after choosing path A finishes dialogue', () => {
    let s = choose(state, 0) // → b2a
    s = advance(s)           // b2a.next = null → finished
    expect(s.isFinished).toBe(true)
  })

  it('invalid index returns same state', () => {
    const next = choose(state, 99)
    expect(next).toStrictEqual(state)
  })

  it('choose on non-choice node returns same state', () => {
    const linear = createRunner(LINEAR_SCRIPT)
    const next = choose(linear, 0)
    expect(next).toStrictEqual(linear)
  })

  it('finishes when choice.next is null', () => {
    const script: DialogueScript = {
      id: 'end_choice',
      chapter: 'prologue',
      startNode: 's1',
      nodes: [
        {
          id: 's1',
          speaker: 'MC',
          text: 'End?',
          choices: [{ label: 'Yes', next: null }],
        },
      ],
    }
    const s = choose(createRunner(script), 0)
    expect(s.isFinished).toBe(true)
  })
})

describe('unknown node handling', () => {
  it('finishes if next points to non-existent node', () => {
    const script: DialogueScript = {
      id: 'broken',
      chapter: 'prologue',
      startNode: 'x1',
      nodes: [{ id: 'x1', speaker: 'System', text: 'X', next: 'DOES_NOT_EXIST' }],
    }
    const s = advance(createRunner(script))
    expect(s.isFinished).toBe(true)
  })
})
