/**
 * src/scenes/PrologueScene.tsx
 *
 * Orkestrator Prologue — "Memories of You"
 *
 * ARSITEKTUR:
 * - Di-render oleh SceneManager saat scene === 'prologue' (full takeover)
 * - SceneBackground + CactusRenderer tetap di SceneManager; sync via setChapter()
 * - Dialogue dimulai lewat getDialogueScript() + startDialogue() — konsisten dengan index.ts
 * - EveningReflection menangani expert system + auto-save sendiri (tidak perlu duplikasi)
 * - MiniGameType kebab-case sesuai minigame.ts
 *
 * STEP FLOW:
 * TAMAN_DIALOGUE → MAP_PUZZLE → PASAR_DIALOGUE → CACTUS_HUNT →
 * PICK_CACTUS_DIALOGUE → KAMAR_DIALOGUE → WATER_CACTUS → TIMELAPSE →
 * ROOFTOP_CHAT_NOTIFICATION → ROOFTOP_DIALOGUE →
 * EVENING_REFLECTION → TITLE_CARD → setScene('gameplay') + setChapter('denial')
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useDialogueStore } from '@stores/dialogueStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { EveningReflection } from '@components/scenes/EveningReflection'
import { DialogueBox } from '@components/ui/DialogueBox'
import { MiniGameHost } from '@components/minigames/MiniGameHost'
import { TitleCard } from '@components/effects/TitleCard'
import { currentNode } from '@systems/dialogueEngine/runner'
import { getDialogueScript } from '@data/dialogues/index'

import {
  prologueMapPuzzleConfig,
  prologueCactusHuntConfig,
  prologueWaterCactusConfig,
} from '@data/missions/prologue_minigames'

import type { EmotionalState } from '@stores/emotionalStore'

import styles from './PrologueScene.module.css'

// ─── Types ─────────────────────────────────────────────────────────────────────

type PrologueStep =
  | 'TAMAN_DIALOGUE'
  | 'MAP_PUZZLE'
  | 'PASAR_DIALOGUE'
  | 'CACTUS_HUNT'
  | 'PICK_CACTUS_DIALOGUE'
  | 'KAMAR_DIALOGUE'
  | 'WATER_CACTUS'
  | 'TIMELAPSE'
  | 'ROOFTOP_CHAT_NOTIFICATION'
  | 'ROOFTOP_DIALOGUE'
  | 'EVENING_REFLECTION'
  | 'TITLE_CARD'

// Step yang butuh dialogue — dengan script ID-nya
const DIALOGUE_SCRIPT_ID: Partial<Record<PrologueStep, string>> = {
  TAMAN_DIALOGUE: 'prologue_step1_taman',
  PASAR_DIALOGUE: 'prologue_step3_pasar',
  PICK_CACTUS_DIALOGUE: 'prologue_step5_pilih_kaktus',
  KAMAR_DIALOGUE: 'prologue_step6_kamar',
  ROOFTOP_DIALOGUE: 'prologue_step9_rooftop',
}

const DIALOGUE_STEPS = new Set<PrologueStep>(Object.keys(DIALOGUE_SCRIPT_ID) as PrologueStep[])

// Step berikutnya setelah dialogue selesai
const DIALOGUE_NEXT: Partial<Record<PrologueStep, PrologueStep>> = {
  TAMAN_DIALOGUE: 'MAP_PUZZLE',
  PASAR_DIALOGUE: 'CACTUS_HUNT',
  PICK_CACTUS_DIALOGUE: 'KAMAR_DIALOGUE',
  KAMAR_DIALOGUE: 'WATER_CACTUS',
  ROOFTOP_DIALOGUE: 'EVENING_REFLECTION',
}

// ─── Emotional init ─────────────────────────────────────────────────────────────

const PROLOGUE_INIT: EmotionalState = {
  distress: 20,
  hope: 80,
  denial: 0,
  rumination: 'neutral',
  avoidanceCount: 0,
  internalizedAngerCount: 0,
  aggressiveChoiceCount: 0,
  consecutiveHardDenial: 0,
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function PrologueScene() {
  const [step, setStep] = useState<PrologueStep>('TAMAN_DIALOGUE')
  const [fading, setFading] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const stepRef = useRef(step)

  const setChapter = useGameStateStore((s) => s.setChapter)
  const setScene = useGameStateStore((s) => s.setScene)
  const startDialogue = useDialogueStore((s) => s.startDialogue)
  const isDialogueActive = useDialogueStore((s) => s.isActive)
  const runnerState = useDialogueStore((s) => s.runnerState)
  const advance = useDialogueStore((s) => s.advance)
  const choose = useDialogueStore((s) => s.choose)
  const hydrate = useEmotionalStore((s) => s.hydrate)

  const wasActiveRef = useRef(false)

  // ── Mulai script dialogue untuk step tertentu ─────────────────────────────────

  const startScriptForStep = useCallback(
    (s: PrologueStep) => {
      const scriptId = DIALOGUE_SCRIPT_ID[s]
      if (!scriptId) return
      const script = getDialogueScript(scriptId)
      if (script) startDialogue(script)
    },
    [startDialogue]
  )

  // ── Init on mount ─────────────────────────────────────────────────────────────

  useEffect(() => {
    setChapter('prologue')
    hydrate(PROLOGUE_INIT)
    startScriptForStep('TAMAN_DIALOGUE')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync step ke ref ──────────────────────────────────────────────────────────

  useEffect(() => {
    stepRef.current = step
  }, [step])

  // ── Transition helper ─────────────────────────────────────────────────────────

  const transitionTo = useCallback(
    (nextStep: PrologueStep, delay = 450) => {
      setFading(true)
      setTimeout(() => {
        setStep(nextStep)
        setFading(false)
        startScriptForStep(nextStep)
      }, delay)
    },
    [startScriptForStep]
  )

  // ── Deteksi dialogue selesai ──────────────────────────────────────────────────

  useEffect(() => {
    if (isDialogueActive) {
      wasActiveRef.current = true
      return
    }
    if (!wasActiveRef.current) return
    wasActiveRef.current = false

    const current = stepRef.current
    if (!DIALOGUE_STEPS.has(current)) return
    const next = DIALOGUE_NEXT[current]
    if (next) transitionTo(next)
  }, [isDialogueActive, transitionTo])

  // ── Mini-game complete ────────────────────────────────────────────────────────

  const handleMiniGameComplete = useCallback(() => {
    switch (stepRef.current) {
      case 'MAP_PUZZLE':
        transitionTo('PASAR_DIALOGUE')
        break
      case 'CACTUS_HUNT':
        transitionTo('PICK_CACTUS_DIALOGUE')
        break
      case 'WATER_CACTUS':
        transitionTo('TIMELAPSE', 300)
        break
      default:
        break
    }
  }, [transitionTo])

  const handleMiniGameAbandon = useCallback(() => {
    handleMiniGameComplete()
  }, [handleMiniGameComplete])

  // ── Timelapse selesai ─────────────────────────────────────────────────────────

  const handleTimelapseEnd = useCallback(() => {
    transitionTo('ROOFTOP_CHAT_NOTIFICATION', 500)
  }, [transitionTo])

  // ── Chat notification ─────────────────────────────────────────────────────────

  const handleChatNotifAck = useCallback(() => {
    transitionTo('ROOFTOP_DIALOGUE', 400)
  }, [transitionTo])

  // ── Evening reflection selesai ────────────────────────────────────────────────
  // EveningReflection sudah menangani evaluateNight + autoSave + incrementDay sendiri.
  // Kita hanya perlu tampilkan title card lalu masuk Chapter 1.

  const handleEveningComplete = useCallback(() => {
    setShowTitle(true)
    transitionTo('TITLE_CARD', 600)
  }, [transitionTo])

  // ── Title card selesai ────────────────────────────────────────────────────────

  const handleTitleCardComplete = useCallback(() => {
    setShowTitle(false)
    setChapter('denial')
    setScene('gameplay')
  }, [setChapter, setScene])

  // ── Dialogue node ─────────────────────────────────────────────────────────────

  const dialogueNode = runnerState ? currentNode(runnerState) : null

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={`${styles.prologueScene ?? ''} ${fading ? (styles.fading ?? '') : ''}`}
      data-step={step}
    >
      {/* Mini-games */}
      {step === 'MAP_PUZZLE' && (
        <div className={styles.minigameOverlay}>
          <MiniGameHost
            type="slider-puzzle"
            config={prologueMapPuzzleConfig}
            onComplete={handleMiniGameComplete}
            onAbandon={handleMiniGameAbandon}
          />
        </div>
      )}

      {step === 'CACTUS_HUNT' && (
        <div className={styles.minigameOverlay}>
          <MiniGameHost
            type="hidden-object"
            config={prologueCactusHuntConfig}
            onComplete={handleMiniGameComplete}
            onAbandon={handleMiniGameAbandon}
          />
        </div>
      )}

      {step === 'WATER_CACTUS' && (
        <div className={styles.minigameOverlay}>
          <MiniGameHost
            type="planting-game"
            config={prologueWaterCactusConfig}
            onComplete={handleMiniGameComplete}
            onAbandon={handleMiniGameAbandon}
          />
        </div>
      )}

      {/* Timelapse */}
      {step === 'TIMELAPSE' && <PrologueTimelapse onComplete={handleTimelapseEnd} />}

      {/* Chat notification */}
      {step === 'ROOFTOP_CHAT_NOTIFICATION' && (
        <PrologueChatNotification onAcknowledge={handleChatNotifAck} />
      )}

      {/* Evening reflection — biarkan EveningReflection handle semuanya */}
      {step === 'EVENING_REFLECTION' && <EveningReflection onComplete={handleEveningComplete} />}

      {/* Title card */}
      {step === 'TITLE_CARD' && showTitle && (
        <TitleCard title="Memories of You" onComplete={handleTitleCardComplete} />
      )}

      {/* Dialogue overlay */}
      {isDialogueActive && dialogueNode && (
        <div className={styles.dialogueOverlay}>
          <DialogueBox node={dialogueNode} onAdvance={advance} onChoose={choose} />
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface TimelapseProps {
  onComplete: () => void
}

function PrologueTimelapse({ onComplete }: TimelapseProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 4000)
    return () => {
      clearTimeout(t)
    }
  }, [onComplete])

  return (
    <div className={styles.timelapse} aria-label="Timelapse: hari-hari berlalu">
      <div className={styles.timelapseSun} />
      <div className={styles.timelapseClouds} />
      <div className={styles.timelapseOverlay}>
        <span className={styles.timelapseText}>Hari-hari berlalu...</span>
      </div>
    </div>
  )
}

interface ChatNotifProps {
  onAcknowledge: () => void
}

function PrologueChatNotification({ onAcknowledge }: ChatNotifProps) {
  return (
    <div
      className={styles.chatNotifWrapper}
      onClick={onAcknowledge}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onAcknowledge()
      }}
      aria-label="Buka chat dari Dia"
    >
      <div className={styles.chatNotifBubble}>
        <span className={styles.notifSender}>Dia</span>
        <span className={styles.notifPreview}>Hei. Lagi sibuk gak?</span>
        <span className={styles.notifTap}>Ketuk untuk membuka</span>
      </div>
    </div>
  )
}
