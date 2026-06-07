import { useEffect, useState } from 'react'
import { useInventoryStore } from '@stores/inventoryStore'
import { getFlashbackMeta } from '@data/flashbacks/index'
import {
  createRunner,
  currentNode,
  advance,
  choose,
  type RunnerState,
} from '@systems/dialogueEngine/runner'
import { DialogueBox } from '@components/ui/DialogueBox'
import type { FlashbackId } from '@/types/game'

interface Props {
  flashbackId: FlashbackId
  onClose: () => void
}

export function FlashbackPlayer({ flashbackId, onClose }: Props) {
  const meta = getFlashbackMeta(flashbackId)

  const [runner, setRunner] = useState<RunnerState>(() => createRunner(meta.script))

  // Unlock in inventory once mounted
  useEffect(() => {
    useInventoryStore.getState().unlockFlashback(flashbackId)
  }, [flashbackId])

  const node = currentNode(runner)

  // When runner finishes (no node), close the overlay
  useEffect(() => {
    if (!node) onClose()
  }, [node, onClose])

  if (!node) return null

  return (
    <div className="flashback-overlay" onClick={(e) => { e.stopPropagation() }}>
      <div className="flashback-inner">
        <div className="flashback-header">
          <span className="flashback-label">Kenangan</span>
          <span className="flashback-title">{meta.title}</span>
        </div>

        <DialogueBox
          key={node.id}
          node={node}
          onAdvance={() => { setRunner((s) => advance(s)) }}
          onChoose={(i) => { setRunner((s) => choose(s, i)) }}
        />
      </div>
    </div>
  )
}
