import { useEffect, useRef, useState } from 'react'
import type { GameScene, FlashbackId } from '@/types/game'
import type { InteractionTrigger } from '@/types/dialogue'
import { useGameStateStore } from '@stores/gameStateStore'
import { useDialogueStore } from '@stores/dialogueStore'
import { getDialogueScript } from '@data/dialogues/index'
import { getTriggersForLocation, consumeTrigger } from '@systems/triggerSystem/triggerManager'
import { SceneBackground } from './SceneBackground'
import { CactusRenderer } from '@components/cactus/CactusRenderer'
import { InteractionObject } from './InteractionObject'
import { EveningReflection } from './EveningReflection'
import { DialogueBox } from '@components/ui/DialogueBox'
import { FlashbackPlayer } from '@components/flashback/FlashbackPlayer'
import { SmartphoneFrame } from '@components/smartphone/SmartphoneFrame'
import { currentNode } from '@systems/dialogueEngine/runner'

// ── Placeholder scene views ────────────────────────────────────────────────
function MainMenuView() {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const setScene = useGameStateStore((s) => s.setScene)
  return (
    <div className="scene-content scene-content--centered">
      <h1 className="title-game">Memories of You</h1>
      <p className="scene-subtitle">Chapter: {chapter}</p>
      <div className="phase-checklist">
        <span>✓ Phase 0 — Core Architecture</span>
        <span>✓ Phase 1 — Systems &amp; Data</span>
        <span>✓ Phase 2 — Visual Engine</span>
        <span>✓ Phase 3 — Dialogue &amp; Narrative Engine</span>
        <span>✓ Phase 4 — Smartphone UI</span>
        <span>✓ Phase 5 — Mini-Game Systems</span>
      </div>
      <button
        className="choice-btn"
        style={{ marginTop: '1.5rem', width: 'auto', padding: '0.75rem 2rem' }}
        onClick={() => { setScene('gameplay') }}
      >
        Mulai Game ▶
      </button>
    </div>
  )
}

function GameplayView() {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const location = useGameStateStore((s) => s.currentLocation)
  const setScene = useGameStateStore((s) => s.setScene)
  const startDialogue = useDialogueStore((s) => s.startDialogue)

  // Active flashback state
  const [activeFlashback, setActiveFlashback] = useState<FlashbackId | null>(null)

  const triggers = getTriggersForLocation(location, chapter)

  const handleTrigger = (trigger: InteractionTrigger) => {
    consumeTrigger(trigger.id)
    const { action } = trigger
    if (action.type === 'flashback') {
      setActiveFlashback(action.flashbackId)
    } else if (action.type === 'dialogue') {
      const script = getDialogueScript(action.scriptId)
      if (script) startDialogue(script)
    }
  }

  return (
    <>
      {triggers.map((t) => (
        <InteractionObject key={t.id} trigger={t} onActivate={handleTrigger} />
      ))}

      {activeFlashback && (
        <FlashbackPlayer
          flashbackId={activeFlashback}
          onClose={() => { setActiveFlashback(null) }}
        />
      )}

      <div
        className="scene-content scene-content--centered"
        style={{ pointerEvents: 'none', opacity: 0.4 }}
      >
        <p style={{ color: 'var(--color-text)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {location} · {chapter}
        </p>
        <button
          className="choice-btn"
          style={{ pointerEvents: 'auto', opacity: 1, marginTop: '0.5rem', fontSize: '0.75rem' }}
          onClick={() => { setScene('evening-reflection') }}
        >
          Akhiri Hari →
        </button>
      </div>
    </>
  )
}

function GenericView({ scene }: { scene: GameScene }) {
  return (
    <div className="scene-content scene-content--centered">
      <p style={{ color: 'var(--color-text)', opacity: 0.5, fontFamily: 'monospace' }}>
        Scene: {scene}
      </p>
    </div>
  )
}

function resolveView(scene: GameScene) {
  switch (scene) {
    case 'main-menu': return <MainMenuView />
    case 'gameplay': return <GameplayView />
    default: return <GenericView scene={scene} />
  }
}

// ── SceneManager ───────────────────────────────────────────────────────────
export function SceneManager() {
  const scene = useGameStateStore((s) => s.currentScene)
  const setScene = useGameStateStore((s) => s.setScene)
  const location = useGameStateStore((s) => s.currentLocation)
  const chapter = useGameStateStore((s) => s.currentChapter)

  // Dialogue overlay
  const isDialogueActive = useDialogueStore((s) => s.isActive)
  const runnerState = useDialogueStore((s) => s.runnerState)
  const advance = useDialogueStore((s) => s.advance)
  const choose = useDialogueStore((s) => s.choose)

  // Fade transition
  const [visibleScene, setVisibleScene] = useState(scene)
  const [fading, setFading] = useState(false)
  const pendingScene = useRef(scene)

  // Smartphone state
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [phoneFlashback, setPhoneFlashback] = useState<FlashbackId | null>(null)

  useEffect(() => {
    if (scene === visibleScene) return
    pendingScene.current = scene
    const fadeIn = setTimeout(() => { setFading(true) }, 0)
    const swap = setTimeout(() => {
      setVisibleScene(pendingScene.current)
      setFading(false)
    }, 320)
    return () => { clearTimeout(fadeIn); clearTimeout(swap) }
  }, [scene, visibleScene])

  const dialogueNode = runnerState ? currentNode(runnerState) : null
  const isGameplay = visibleScene === 'gameplay'

  return (
    <div className={`scene-manager ${fading ? 'scene-fading' : ''}`}>
      <SceneBackground location={location} chapter={chapter} />
      <CactusRenderer chapter={chapter} />

      <div className="scene-overlay">
        {visibleScene === 'evening-reflection' ? (
          <EveningReflection onComplete={() => { setScene('gameplay') }} />
        ) : (
          resolveView(visibleScene)
        )}
      </div>

      {/* Smartphone toggle — only in gameplay */}
      {isGameplay && !phoneOpen && !phoneFlashback && (
        <button
          className="smartphone-btn-open"
          onClick={() => { setPhoneOpen(true) }}
          aria-label="Buka smartphone"
        >
          📱
        </button>
      )}

      {/* Smartphone frame */}
      {phoneOpen && (
        <SmartphoneFrame
          onClose={() => { setPhoneOpen(false) }}
          onOpenFlashback={(id) => {
            setPhoneFlashback(id)
            setPhoneOpen(false)
          }}
        />
      )}

      {/* Flashback triggered from gallery */}
      {phoneFlashback && (
        <FlashbackPlayer
          flashbackId={phoneFlashback}
          onClose={() => {
            setPhoneFlashback(null)
            setPhoneOpen(true)
          }}
        />
      )}

      {/* Dialogue overlay — rendered above scene content */}
      {isDialogueActive && dialogueNode && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 25 }}>
          <DialogueBox node={dialogueNode} onAdvance={advance} onChoose={choose} />
        </div>
      )}
    </div>
  )
}
