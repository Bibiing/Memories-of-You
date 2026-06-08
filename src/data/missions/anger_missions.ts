/**
 * src/data/missions/anger_missions.ts
 *
 * Pool 5 misi untuk Chapter Anger.
 * Anger memiliki lebih banyak misi fisik/ekspresif untuk mencerminkan emosi chapter.
 */

import type {
  WordPuzzleConfig,
  StruggleButtonConfig,
  HoldToDeleteConfig,
  QuickTimeEventConfig,
  BreathingRhythmConfig,
} from '@/types/minigame'

import type { DailyMission } from './denial_missions'

// ── Misi 1: Tulis Surat untuk Dia ──────────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Word Puzzle (pilih kata yang tepat untuk surat)
const m_ang_01_config: WordPuzzleConfig = {
  target: 'JUJUR',
  letters: ['J', 'U', 'J', 'U', 'R', 'M', 'A', 'R', 'A', 'H', 'S', 'A', 'K', 'I', 'T'],
  timeLimit: 90,
}

// ── Misi 2: Olahraga untuk Melampiaskan Emosi ──────────────────────────────────
// Lokasi: Lapangan | Mini-game: Quick Time Event (tendang bola, lari)
const m_ang_02_config: QuickTimeEventConfig = {
  duration: 30,
  spawnInterval: 2.5,
  targets: [
    { id: 'target_1', x: 20, y: 40, label: 'Tendang!' },
    { id: 'target_2', x: 60, y: 30, label: 'Sprint!' },
    { id: 'target_3', x: 80, y: 60, label: 'Lompat!' },
    { id: 'target_4', x: 35, y: 70, label: 'Putar!' },
    { id: 'target_5', x: 50, y: 20, label: 'Tendang!' },
    { id: 'target_6', x: 15, y: 55, label: 'Sprint!' },
    { id: 'target_7', x: 75, y: 45, label: 'Lompat!' },
    { id: 'target_8', x: 45, y: 65, label: 'Tendang!' },
  ],
}

// ── Misi 3: Beres-beres Kamar (Lampiaskan ke Benda) ───────────────────────────
// Lokasi: Kamar | Mini-game: Hold to Delete (buang barang-barang kenangan)
const m_ang_03_config: HoldToDeleteConfig = {
  elements: [
    { id: 'item_1', label: 'Foto bersama Dia', color: '#8B2500' },
    { id: 'item_2', label: 'Souvenir dari Dia', color: '#8B2500' },
    { id: 'item_3', label: 'Chat history screenshot', color: '#8B2500' },
  ],
  holdDuration: 2500,
}

// ── Misi 4: Curhat ke Teman Curhat ─────────────────────────────────────────────
// Lokasi: Koridor Lab | Mini-game: Struggle Button (tahan untuk tidak berteriak)
const m_ang_04_config: StruggleButtonConfig = {
  target: 15,
  label: 'Tarik napas',
  timeLimit: 25,
}

// ── Misi 5: Latihan Pernapasan (Coping Skill) ──────────────────────────────────
// Lokasi: Kamar | Mini-game: Breathing Rhythm
// Misi terbaik untuk anger — reduces distress signifikan
const m_ang_05_config: BreathingRhythmConfig = {
  inhaleSeconds: 4,
  holdSeconds: 4,
  exhaleSeconds: 6,
  cycles: 3,
}

// ─── Export ────────────────────────────────────────────────────────────────────

export const angerMissionPool: DailyMission[] = [
  {
    id: 'ang_m01',
    label: 'Tulis Surat untuk Dia',
    description: 'Semua yang tidak bisa kamu katakan langsung — tulis di sini.',
    location: 'kamar',
    minigameType: 'word-puzzle',
    config: m_ang_01_config,
    onCompleteWeights: { distress: -2, hope: 3, denial: -3 },
    onAbandonWeights:  { distress: 4, denial: 2 },
  },
  {
    id: 'ang_m02',
    label: 'Olahraga di Lapangan',
    description: 'Tubuhmu butuh digerakkan. Energi ini perlu dikeluarkan.',
    location: 'lapangan',
    minigameType: 'quick-time-event',
    config: m_ang_02_config,
    onCompleteWeights: { distress: -6, hope: 4 },
    onAbandonWeights:  { distress: 3 },
  },
  {
    id: 'ang_m03',
    label: 'Beres-beres Kamar',
    description: 'Rapikan ruang fisikmu. Mungkin sedikit membantu.',
    location: 'kamar',
    minigameType: 'hold-to-delete',
    config: m_ang_03_config,
    onCompleteWeights: { distress: -4, hope: 2, denial: -4 },
    onAbandonWeights:  { distress: 5, denial: 3 },
  },
  {
    id: 'ang_m04',
    label: 'Curhat ke Teman',
    description: 'Temanmu mendengarkan. Coba ceritakan tanpa meledak.',
    location: 'koridor-lab',
    minigameType: 'struggle-button',
    config: m_ang_04_config,
    onCompleteWeights: { distress: -3, hope: 5 },
    onAbandonWeights:  { distress: 6 },
  },
  {
    id: 'ang_m05',
    label: 'Latihan Pernapasan',
    description: 'Sederhana. Tapi mungkin ini yang paling kamu butuhkan malam ini.',
    location: 'kamar',
    minigameType: 'breathing-rhythm',
    config: m_ang_05_config,
    onCompleteWeights: { distress: -8, hope: 6 },
    onAbandonWeights:  { distress: 2 },
  },
]
