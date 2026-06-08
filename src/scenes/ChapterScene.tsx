/**
 * src/scenes/ChapterScene.tsx
 *
 * Orkestrator gameplay harian untuk Chapter Denial dan Anger.
 * Digunakan kembali untuk semua chapter berbasis "hari" (bukan Prologue/Epilogue).
 *
 * FLOW PER HARI:
 *   DAY_START (dialogue pagi) →
 *   MISSION_SELECT (pilih misi) →
 *   MISSION_PLAY (mini-game) →
 *   MISSION_RESULT (feedback) →
 *   [opsional: CANON_EVENT] →
 *   EVENING_REFLECTION →
 *   DAY_END (auto-save + increment day)
 *
 * INTEGRASI:
 * - Di-render oleh SceneManager saat scene === 'gameplay' && chapter === 'denial'/'anger'
 * - Atau di-render langsung oleh routing yang akan ditambahkan di Fase 7
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useDialogueStore } from '@stores/dialogueStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { EveningReflection } from '@components/scenes/EveningReflection'
import { DialogueBox } from '@components/ui/DialogueBox'
import { MiniGameHost } from '@components/minigames/MiniGameHost'
import { currentNode } from '@systems/dialogueEngine/runner'
import { getDialogueScript } from '@data/dialogues/index'

import { denialMissionPool } from '@data/missions/denial_missions'
import { angerMissionPool } from '@data/missions/anger_missions'
import { bargainingMissionPool } from '@data/missions/bargaining_missions'
import { depressionMissionPool } from '@data/missions/depression_missions'
import { acceptanceMissionPool } from '@data/missions/acceptance_missions'
import type { DailyMission } from '@data/missions/denial_missions'
import type { MiniGameResult } from '@/types/minigame'
import type { Chapter } from '@/types/game'

import styles from './ChapterScene.module.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

type DayPhase =
  | 'DAY_START'
  | 'MISSION_SELECT'
  | 'MISSION_PLAY'
  | 'MISSION_RESULT'
  | 'CANON_EVENT'
  | 'EVENING_REFLECTION'

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getMissionPool(chapter: Chapter): DailyMission[] {
  if (chapter === 'denial')     return denialMissionPool
  if (chapter === 'anger')      return angerMissionPool
  if (chapter === 'bargaining') return bargainingMissionPool
  if (chapter === 'depression') return depressionMissionPool
  if (chapter === 'acceptance') return acceptanceMissionPool
  return []
}

/** Pilih 2 misi acak dari pool, hindari misi yang sudah dimainkan hari ini */
function pickDailyMissions(pool: DailyMission[], played: Set<string>): DailyMission[] {
  const available = pool.filter((m) => !played.has(m.id))
  if (available.length === 0) return pool.slice(0, 2) // fallback: reset
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(2, shuffled.length))
}

/** Script dialogue pagi berdasarkan chapter + hari */
function getDayStartScriptId(chapter: Chapter, day: number): string {
  // Hari 3 = canon event → pakai script canon
  const canonDay = 3
  if (day >= canonDay) {
    return `${chapter}_day${canonDay}_canon`
  }
  return `${chapter}_day${Math.min(day, 2)}`
}

/** Canon event terjadi di hari ke-3 */
function isCanonEventDay(day: number): boolean {
  return day === 3
}

/** Label chapter yang ditampilkan di header Mission Select */
const CHAPTER_LABELS: Partial<Record<Chapter, string>> = {
  denial:     'Penyangkalan',
  anger:      'Kemarahan',
  bargaining: 'Tawar-menawar',
  depression: 'Depresi',
  acceptance: 'Penerimaan',
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function ChapterScene() {
  const chapter   = useGameStateStore((s) => s.currentChapter) as Chapter
  const day       = useGameStateStore((s) => s.currentDay)

  const startDialogue    = useDialogueStore((s) => s.startDialogue)
  const endDialogue      = useDialogueStore((s) => s.endDialogue)
  const isDialogueActive = useDialogueStore((s) => s.isActive)
  const runnerState      = useDialogueStore((s) => s.runnerState)
  const advance          = useDialogueStore((s) => s.advance)
  const choose           = useDialogueStore((s) => s.choose)

  const adjustDistress = useEmotionalStore((s) => s.adjustDistress)
  const adjustHope     = useEmotionalStore((s) => s.adjustHope)
  const adjustDenial   = useEmotionalStore((s) => s.adjustDenial)

  const [phase, setPhase]               = useState<DayPhase>('DAY_START')
  const [fading, setFading]             = useState(false)
  const [todayMissions, setTodayMissions] = useState<DailyMission[]>([])
  const [activeMission, setActiveMission] = useState<DailyMission | null>(null)
  const [playedToday, setPlayedToday]   = useState<Set<string>>(new Set())
  const [lastResult, setLastResult]     = useState<MiniGameResult | null>(null)
  const [missionsDone, setMissionsDone] = useState(0)

  const phaseRef         = useRef(phase)

  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── Transition helper ────────────────────────────────────────────────────────

  const transitionTo = useCallback((next: DayPhase, delay = 400) => {
    setFading(true)
    setTimeout(() => {
      setPhase(next)
      setFading(false)
    }, delay)
  }, [])

  // ── Init: DAY_START ──────────────────────────────────────────────────────────

  useEffect(() => {
    const scriptId = getDayStartScriptId(chapter, day)
    const script = getDialogueScript(scriptId)
    if (script) {
      startDialogue(script)
    } else {
      // Tidak ada script untuk hari ini → langsung ke mission select
      setPhase('MISSION_SELECT')
    }
    // Setup misi hari ini
    const pool = getMissionPool(chapter)
    setTodayMissions(pickDailyMissions(pool, new Set()))
    setPlayedToday(new Set())
    setMissionsDone(0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Deteksi dialogue selesai via runnerState.isFinished ─────────────────────
  // Lebih reliable dari wasActiveRef karena tidak bergantung pada timing isDialogueActive

  const prevIsFinishedRef = useRef(false)

  useEffect(() => {
    const isFinished = runnerState?.isFinished ?? false

    // Baru saja finish (false → true)
    if (isFinished && !prevIsFinishedRef.current) {
      prevIsFinishedRef.current = true
      const current = phaseRef.current

      if (current === 'DAY_START') {
        if (isCanonEventDay(day)) {
          transitionTo('CANON_EVENT')
        } else {
          transitionTo('MISSION_SELECT')
        }
      } else if (current === 'CANON_EVENT') {
        endDialogue()
        transitionTo('EVENING_REFLECTION')
      }
    }

    // Reset saat dialogue baru dimulai (isFinished kembali false)
    if (!isFinished) {
      prevIsFinishedRef.current = false
    }
  }, [runnerState, day, transitionTo, endDialogue])

  // ── Pilih misi ───────────────────────────────────────────────────────────────

  const handleMissionSelect = useCallback((mission: DailyMission) => {
    setActiveMission(mission)
    transitionTo('MISSION_PLAY')
  }, [transitionTo])

  // ── Mini-game selesai ────────────────────────────────────────────────────────

  const handleMissionComplete = useCallback((result: MiniGameResult) => {
    if (!activeMission) return
    setLastResult(result)

    // Apply emotional weights
    const weights = result.success
      ? activeMission.onCompleteWeights
      : activeMission.onAbandonWeights

    if (weights.distress) adjustDistress(weights.distress)
    if (weights.hope)     adjustHope(weights.hope)
    if (weights.denial)   adjustDenial(weights.denial)

    // Track played
    setPlayedToday((prev) => new Set([...prev, activeMission.id]))
    setMissionsDone((prev) => prev + 1)

    transitionTo('MISSION_RESULT')
  }, [activeMission, adjustDistress, adjustHope, adjustDenial, transitionTo])

  // ── Dari result → lanjut atau selesai ────────────────────────────────────────

  const handleResultContinue = useCallback(() => {
    if (missionsDone >= 1) {
      endDialogue() // clear store sebelum EveningReflection mount
      transitionTo('EVENING_REFLECTION')
    } else {
      transitionTo('MISSION_SELECT')
    }
  }, [missionsDone, endDialogue, transitionTo])

  // ── Evening reflection selesai ────────────────────────────────────────────────

  const handleEveningComplete = useCallback(() => {
    // EveningReflection sudah handle incrementDay + chapter transition via store
    // Kita hanya perlu reset phase dan misi untuk hari baru
    const pool = getMissionPool(chapter)
    const newDay = useGameStateStore.getState().currentDay
    setTodayMissions(pickDailyMissions(pool, new Set()))
    setPlayedToday(new Set())
    setMissionsDone(0)
    setActiveMission(null)
    setLastResult(null)

    // Mulai hari baru: load dialogue pagi untuk hari yang sudah di-increment
    const scriptId = getDayStartScriptId(chapter, newDay)
    const script = getDialogueScript(scriptId)
    if (script) {
      startDialogue(script)
    } else {
      setPhase('MISSION_SELECT')
      return
    }
    setPhase('DAY_START')
  }, [chapter, startDialogue])

  // ── Dialogue node ─────────────────────────────────────────────────────────────

  const dialogueNode = runnerState ? currentNode(runnerState) : null

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={`${styles.chapterScene} ${fading ? styles.fading : ''}`}
      data-chapter={chapter}
      data-phase={phase}
    >

      {/* ── Mission Select ── */}
      {phase === 'MISSION_SELECT' && (
        <MissionSelectView
          missions={todayMissions}
          playedToday={playedToday}
          day={day}
          chapter={chapter}
          onSelect={handleMissionSelect}
          onSkipToEvening={() => { endDialogue(); transitionTo('EVENING_REFLECTION') }}
        />
      )}

      {/* ── Mission Play ── */}
      {phase === 'MISSION_PLAY' && activeMission && (
        <div className={styles.minigameOverlay}>
          <MiniGameHost
            type={activeMission.minigameType as Parameters<typeof MiniGameHost>[0]['type']}
            config={activeMission.config}
            onComplete={handleMissionComplete}
            onAbandon={() => handleMissionComplete({ success: false })}
          />
        </div>
      )}

      {/* ── Mission Result ── */}
      {phase === 'MISSION_RESULT' && activeMission && lastResult && (
        <MissionResultView
          mission={activeMission}
          result={lastResult}
          canPlayMore={missionsDone < 2 && todayMissions.some(m => !playedToday.has(m.id))}
          onContinue={handleResultContinue}
          onPlayMore={() => transitionTo('MISSION_SELECT')}
        />
      )}

      {/* ── Evening Reflection ── */}
      {/* key={day} memastikan komponen di-unmount/remount setiap hari baru */}
      {phase === 'EVENING_REFLECTION' && (
        <EveningReflection
          key={day}
          onComplete={handleEveningComplete}
        />
      )}

      {/* ── Dialogue overlay (DAY_START + CANON_EVENT) ── */}
      {isDialogueActive && dialogueNode && (
        <div className={styles.dialogueOverlay}>
          <DialogueBox
            node={dialogueNode}
            onAdvance={advance}
            onChoose={choose}
          />
        </div>
      )}

    </div>
  )
}

// ─── Sub-views ──────────────────────────────────────────────────────────────────

interface MissionSelectProps {
  missions: DailyMission[]
  playedToday: Set<string>
  day: number
  chapter: Chapter
  onSelect: (m: DailyMission) => void
  onSkipToEvening: () => void
}

function MissionSelectView({
  missions, playedToday, day, chapter, onSelect, onSkipToEvening
}: MissionSelectProps) {
  const chapterLabel = CHAPTER_LABELS[chapter] ?? chapter

  return (
    <div className={styles.missionSelect}>
      <div className={styles.dayHeader}>
        <span className={styles.dayLabel}>Hari {day}</span>
        <span className={styles.chapterLabel}>{chapterLabel}</span>
      </div>
      <p className={styles.missionPrompt}>Apa yang ingin kamu lakukan hari ini?</p>
      <div className={styles.missionList}>
        {missions.map((m) => {
          const done = playedToday.has(m.id)
          return (
            <button
              key={m.id}
              className={`${styles.missionCard} ${done ? styles.missionCardDone : ''}`}
              onClick={() => !done && onSelect(m)}
              disabled={done}
            >
              <span className={styles.missionTitle}>{m.label}</span>
              <span className={styles.missionDesc}>{m.description}</span>
              {done && <span className={styles.missionDoneTag}>✓ Selesai</span>}
            </button>
          )
        })}
      </div>
      <button className={styles.skipBtn} onClick={onSkipToEvening}>
        Akhiri Hari →
      </button>
    </div>
  )
}

interface MissionResultProps {
  mission: DailyMission
  result: MiniGameResult
  canPlayMore: boolean
  onContinue: () => void
  onPlayMore: () => void
}

function MissionResultView({ mission, result, canPlayMore, onContinue, onPlayMore }: MissionResultProps) {
  return (
    <div className={styles.missionResult}>
      <div className={styles.resultIcon}>{result.success ? '✓' : '○'}</div>
      <h2 className={styles.resultTitle}>
        {result.success ? mission.label : 'Kamu tidak menyelesaikannya'}
      </h2>
      <p className={styles.resultDesc}>
        {result.success
          ? 'Kamu berhasil menyelesaikannya.'
          : 'Tidak apa-apa. Besok masih ada waktu.'}
      </p>
      <div className={styles.resultActions}>
        {canPlayMore && (
          <button className={styles.resultBtnSecondary} onClick={onPlayMore}>
            Lakukan hal lain
          </button>
        )}
        <button className={styles.resultBtnPrimary} onClick={onContinue}>
          Akhiri Hari →
        </button>
      </div>
    </div>
  )
}