import type { DialogueNode, DialogueScript } from '@/types/dialogue'
import { useEmotionalStore } from '@stores/emotionalStore'

export interface RunnerState {
  readonly nodeMap: ReadonlyMap<string, DialogueNode>
  readonly currentId: string | null
  readonly isFinished: boolean
}

export function createRunner(script: DialogueScript): RunnerState {
  return {
    nodeMap: new Map(script.nodes.map((n) => [n.id, n])),
    currentId: script.startNode,
    isFinished: false,
  }
}

export function currentNode(state: RunnerState): DialogueNode | null {
  if (!state.currentId) return null
  return state.nodeMap.get(state.currentId) ?? null
}

// Advance to next node on a linear (no-choice) node.
// Returns the same state if the current node has choices (caller must use choose()).
export function advance(state: RunnerState): RunnerState {
  const node = currentNode(state)
  if (!node) return { ...state, isFinished: true }
  if (node.choices && node.choices.length > 0) return state
  return moveTo(state, node.next)
}

// Select a choice by index. Applies emotional weights and returns new state.
export function choose(state: RunnerState, index: number): RunnerState {
  const node = currentNode(state)
  if (!node?.choices) return state
  const choice = node.choices[index]
  if (!choice) return state

  if (choice.weights) {
    applyWeights(choice.weights)
  }

  return moveTo(state, choice.next)
}

// Apply weights from a node (called externally when a linear node is displayed).
export function applyNodeWeights(node: DialogueNode): void {
  if (node.weights) {
    applyWeights(node.weights)
  }
}

function applyWeights(w: { distress?: number; hope?: number; denial?: number }): void {
  const store = useEmotionalStore.getState()
  if (w.distress !== undefined) store.adjustDistress(w.distress)
  if (w.hope !== undefined) store.adjustHope(w.hope)
  if (w.denial !== undefined) store.adjustDenial(w.denial)
}

function moveTo(state: RunnerState, nextId: string | null | undefined): RunnerState {
  if (nextId == null) return { ...state, currentId: null, isFinished: true }
  if (!state.nodeMap.has(nextId)) return { ...state, currentId: null, isFinished: true }
  return { ...state, currentId: nextId }
}
