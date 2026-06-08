import { useEffect, useRef } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { useDialogueStore } from '@stores/dialogueStore'
import { evaluateNight, getNextChapter } from '@systems/expertSystem/engine'
import { applyOutputs } from '@systems/expertSystem/applyOutput'
import { autoSave } from '@systems/saveSystem/autoSave'
import { getEveningScript } from '@data/dialogues/index'
import { currentNode } from '@systems/dialogueEngine/runner'
import { DialogueBox } from '@components/ui/DialogueBox'
import type { ExpertSystemContext } from '@systems/expertSystem/types'
import type { Chapter } from '@/types/game'

interface Props {
  onComplete: () => void
}

async function processNight(chapter: Chapter, onComplete: () => void): Promise<void> {
  const emotional = useEmotionalStore.getState()
  const gameState = useGameStateStore.getState()

  const ctx: ExpertSystemContext = {
    chapter: gameState.currentChapter,
    emotional,
    day: gameState.currentDay,
    daysInChapter: gameState.daysInCurrentChapter,
  }

  const outputs = evaluateNight(ctx)
  applyOutputs(outputs)

  const nextChapter = getNextChapter(ctx)
  if (nextChapter) {
    useGameStateStore.getState().setChapter(nextChapter as Chapter)
  } else {
    useGameStateStore.getState().incrementDay()
    useGameStateStore.getState().incrementDaysInChapter()
  }

  try {
    await autoSave()
  } catch {
    // Non-fatal — continue even if save fails
  }

  // Suppress unused variable warning — chapter is used for context
  void chapter

  onComplete()
}

export function EveningReflection({ onComplete }: Props) {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const currentDay = useGameStateStore((s) => s.currentDay)
  const daysInChapter = useGameStateStore((s) => s.daysInCurrentChapter)

  const isActive = useDialogueStore((s) => s.isActive)
  const runnerState = useDialogueStore((s) => s.runnerState)
  const startDialogue = useDialogueStore((s) => s.startDialogue)
  const advance = useDialogueStore((s) => s.advance)
  const choose = useDialogueStore((s) => s.choose)

  const startedRef = useRef(false)
  const completedRef = useRef(false)

  // Start the evening dialogue once
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    const script = getEveningScript(chapter)
    if (!script) {
      onComplete()
      return
    }
    startDialogue(script)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // When dialogue finishes → run expert system → advance
  useEffect(() => {
    if (completedRef.current) return
    if (!startedRef.current) return
    if (isActive) return // still running
    if (runnerState !== null) return // still has state (initial render)

    completedRef.current = true
    void processNight(chapter, onComplete)
  })

  const node = runnerState ? currentNode(runnerState) : null

  return (
    <div className="evening-overlay">
      <span className="evening-day-label">
        Malam · Hari {currentDay} · {chapter.charAt(0).toUpperCase() + chapter.slice(1)} Hari ke-
        {daysInChapter + 1}
      </span>
      {node && <DialogueBox key={node.id} node={node} onAdvance={advance} onChoose={choose} />}
    </div>
  )
}
