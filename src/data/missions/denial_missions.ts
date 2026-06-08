/**
 * src/data/missions/denial_missions.ts
 *
 * Pool 6 misi untuk Chapter Denial.
 * Setiap misi punya: id, label, location, minigame type + config, emotional weights.
 * DailyMissionPool dipilih secara acak 1–2 per hari oleh game loop.
 */

import type {
  SliderPuzzleConfig,
  HiddenObjectConfig,
  WordPuzzleConfig,
  StruggleButtonConfig,
  HoldToDeleteConfig,
  DragDropSchedulerConfig,
} from '@/types/minigame'

export interface DailyMission {
  id: string
  label: string
  description: string
  location: string
  minigameType: string
  config: unknown
  onCompleteWeights: {
    distress?: number
    hope?: number
    denial?: number
  }
  onAbandonWeights: {
    distress?: number
    hope?: number
    denial?: number
  }
}

// ── Misi 1: Ngobrol Baik-baik tentang Dia ──────────────────────────────────────
// Lokasi: Taman | Mini-game: Word Puzzle (susun kata-kata yang bijak)
const m_den_01_config: WordPuzzleConfig = {
  target: 'SABAR',
  letters: ['S', 'A', 'B', 'A', 'R', 'M', 'A', 'R', 'A', 'H'],
  timeLimit: 60,
}

// ── Misi 2: Main Boardgame Bareng Teman Hangout ────────────────────────────────
// Lokasi: Pusat Perbelanjaan | Mini-game: Slider Puzzle (navigasi papan boardgame)
const m_den_02_config: SliderPuzzleConfig = {
  rows: 5,
  cols: 5,
  grid: [
    [2, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 0, 3],
  ],
}

// ── Misi 3: Makan-makan Bareng ─────────────────────────────────────────────────
// Lokasi: Restoran | Mini-game: Hold to Delete (tahan untuk bersihkan pikiran)
const m_den_03_config: HoldToDeleteConfig = {
  elements: [
    { id: 'thought_1', label: '"Dia pasti kangen juga"', color: '#6b2fa0' },
    { id: 'thought_2', label: '"Mungkin besok dia chat"', color: '#6b2fa0' },
    { id: 'thought_3', label: '"Salah paham pasti"', color: '#6b2fa0' },
  ],
  holdDuration: 1800,
}

// ── Misi 4: Belajar di Lab ─────────────────────────────────────────────────────
// Lokasi: Lab | Mini-game: Drag Drop Scheduler (atur jadwal belajar)
const m_den_04_config: DragDropSchedulerConfig = {
  tasks: [
    { id: 'task_1', label: 'Baca materi kuliah', duration: 2, color: '#2a5c8a' },
    { id: 'task_2', label: 'Kerjakan latihan soal', duration: 2, color: '#2a5c8a' },
    { id: 'task_3', label: 'Review catatan', duration: 1, color: '#2a5c8a' },
    { id: 'task_4', label: 'Istirahat', duration: 1, color: '#3d7a3d' },
  ],
  slots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
  correctMapping: {
    task_1: '08:00',
    task_2: '10:00',
    task_3: '13:00',
    task_4: '11:00',
  },
}

// ── Misi 5: Cari Distraksi di Mall ────────────────────────────────────────────
// Lokasi: Pusat Perbelanjaan | Mini-game: Hidden Object (cari item di toko)
const m_den_05_config: HiddenObjectConfig = {
  timeLimit: 75,
  targets: [
    { id: 'item_1', x: 15, y: 45, radius: 5, label: 'Headphone' },
    { id: 'item_2', x: 32, y: 60, radius: 5, label: 'Buku novel' },
    { id: 'item_3', x: 55, y: 35, radius: 4, label: 'Minuman favorit' },
    { id: 'item_4', x: 72, y: 55, radius: 5, label: 'Snack' },
    { id: 'item_5', x: 88, y: 40, radius: 4, label: 'Poster band' },
  ],
}

// ── Misi 6: Scroll Sosmed (Avoidance) ─────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Struggle Button (susah berhenti scroll)
// Misi ini sengaja "trap" — pilih ini → avoidance count naik
const m_den_06_config: StruggleButtonConfig = {
  target: 30,
  label: 'Berhenti scroll',
  timeLimit: 20,
}

// ─── Export ────────────────────────────────────────────────────────────────────

export const denialMissionPool: DailyMission[] = [
  {
    id: 'den_m01',
    label: 'Ngobrol Baik-baik tentang Dia',
    description: 'Cerita ke teman hangoutmu. Pilih kata-kata yang tepat.',
    location: 'taman',
    minigameType: 'word-puzzle',
    config: m_den_01_config,
    onCompleteWeights: { distress: -3, hope: 4, denial: -2 },
    onAbandonWeights:  { distress: 2, denial: 3 },
  },
  {
    id: 'den_m02',
    label: 'Main Boardgame',
    description: 'Selesaikan permainan bersama teman. Fokus di sini, bukan di sana.',
    location: 'pusat-perbelanjaan',
    minigameType: 'slider-puzzle',
    config: m_den_02_config,
    onCompleteWeights: { distress: -4, hope: 5, denial: -1 },
    onAbandonWeights:  { distress: 3, denial: 2 },
  },
  {
    id: 'den_m03',
    label: 'Makan-makan Bareng',
    description: 'Makan enak sambil coba kosongkan pikiran.',
    location: 'restoran',
    minigameType: 'hold-to-delete',
    config: m_den_03_config,
    onCompleteWeights: { distress: -5, hope: 3, denial: -3 },
    onAbandonWeights:  { distress: 4, denial: 4 },
  },
  {
    id: 'den_m04',
    label: 'Belajar di Lab',
    description: 'Atur waktu belajarmu. Jadikan ini produktif.',
    location: 'lab',
    minigameType: 'drag-drop-scheduler',
    config: m_den_04_config,
    onCompleteWeights: { distress: -2, hope: 4, denial: -1 },
    onAbandonWeights:  { distress: 2 },
  },
  {
    id: 'den_m05',
    label: 'Jalan-jalan ke Mall',
    description: 'Cari sesuatu yang menarik perhatianmu.',
    location: 'pusat-perbelanjaan',
    minigameType: 'hidden-object',
    config: m_den_05_config,
    onCompleteWeights: { distress: -3, hope: 3 },
    onAbandonWeights:  { distress: 2, denial: 2 },
  },
  {
    id: 'den_m06',
    label: 'Scroll Sosmed',
    description: 'Kamu tahu ini tidak akan membantu. Tapi tanganmu sudah membuka aplikasinya.',
    location: 'kamar',
    minigameType: 'struggle-button',
    config: m_den_06_config,
    // Avoidance ditangani di MissionResult handler via incrementsAvoidance
    onCompleteWeights: { distress: 5, hope: -2, denial: 4 },
    onAbandonWeights:  { distress: 3, denial: 3 },
  },
]
