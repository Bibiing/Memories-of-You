import { create } from 'zustand'
import type { DialogueNode, DialogueScript } from '@/types/dialogue'
import type { FlashbackId } from '@/types/game'
import {
  createRunner,
  currentNode,
  advance as runnerAdvance,
  choose as runnerChoose,
  applyNodeWeights,
  type RunnerState,
} from '@systems/dialogueEngine/runner'

interface DialogueStoreState {
  isActive: boolean
  scriptId: string | null
  runnerState: RunnerState | null
  // When a node triggers a flashback, its ID is stored here
  pendingFlashback: FlashbackId | null
  // Flashback overlay
  isFlashbackActive: boolean
  flashbackId: FlashbackId | null
  flashbackRunnerState: RunnerState | null
}

interface DialogueStoreActions {
  startDialogue: (script: DialogueScript) => void
  advance: () => void
  choose: (index: number) => void
  endDialogue: () => void

  startFlashback: (id: FlashbackId, script: DialogueScript) => void
  advanceFlashback: () => void
  endFlashback: () => void

  clearPendingFlashback: () => void
}

const emptyState: DialogueStoreState = {
  isActive: false,
  scriptId: null,
  runnerState: null,
  pendingFlashback: null,
  isFlashbackActive: false,
  flashbackId: null,
  flashbackRunnerState: null,
}

export const useDialogueStore = create<DialogueStoreState & DialogueStoreActions>((set, get) => ({
  ...emptyState,

  startDialogue(script) {
    const runnerState = createRunner(script)
    const node = currentNode(runnerState)
    if (node) applyNodeWeights(node)
    set({ isActive: true, scriptId: script.id, runnerState, pendingFlashback: null })
  },

  advance() {
    const { runnerState } = get()
    if (!runnerState) return
    const node = currentNode(runnerState)
    if (node?.flashback) {
      set({ pendingFlashback: node.flashback })
    }
    const next = runnerAdvance(runnerState)
    if (next.isFinished) {
      set({ isActive: false, scriptId: null, runnerState: null })
      return
    }
    const nextNode = currentNode(next)
    if (nextNode) applyNodeWeights(nextNode)
    set({ runnerState: next })
  },

  choose(index) {
    const { runnerState } = get()
    if (!runnerState) return
    const next = runnerChoose(runnerState, index)
    if (next.isFinished) {
      set({ isActive: false, scriptId: null, runnerState: null })
      return
    }
    const nextNode = currentNode(next)
    if (nextNode) applyNodeWeights(nextNode)
    set({ runnerState: next })
  },

  endDialogue() {
    set({ isActive: false, scriptId: null, runnerState: null })
  },

  startFlashback(id, script) {
    const runnerState = createRunner(script)
    const node = currentNode(runnerState)
    if (node) applyNodeWeights(node)
    set({ isFlashbackActive: true, flashbackId: id, flashbackRunnerState: runnerState })
  },

  advanceFlashback() {
    const { flashbackRunnerState } = get()
    if (!flashbackRunnerState) return
    const next = runnerAdvance(flashbackRunnerState)
    if (next.isFinished) {
      set({ isFlashbackActive: false, flashbackId: null, flashbackRunnerState: null })
      return
    }
    const nextNode = currentNode(next)
    if (nextNode) applyNodeWeights(nextNode)
    set({ flashbackRunnerState: next })
  },

  endFlashback() {
    set({ isFlashbackActive: false, flashbackId: null, flashbackRunnerState: null })
  },

  clearPendingFlashback() {
    set({ pendingFlashback: null })
  },
}))

// Selector helpers
export function getDialogueNode(): DialogueNode | null {
  const { runnerState } = useDialogueStore.getState()
  if (!runnerState) return null
  return currentNode(runnerState)
}

export function getFlashbackNode(): DialogueNode | null {
  const { flashbackRunnerState } = useDialogueStore.getState()
  if (!flashbackRunnerState) return null
  return currentNode(flashbackRunnerState)
}
