/**
 * src/data/missions/acceptance_missions.ts
 *
 * Pool 6 misi untuk Chapter Acceptance.
 * Tema: membangun kembali agency dan harapan — menyusun rencana, mencoba hal baru,
 * dan menata ulang ruang hidup. Misi terakhir ("Menanam Bibit Baru") adalah
 * pemicu transisi menuju Epilogue.
 */

import type {
  DragDropSchedulerConfig,
  QuickTimeEventConfig,
  WordPuzzleConfig,
  BreathingRhythmConfig,
  RoomDecorationConfig,
  PlantingGameConfig,
} from '@/types/minigame'

import type { DailyMission } from './denial_missions'

// ── Misi 1: Menyusun Rencana Masa Depan ────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Drag Drop Scheduler (susun vision board jangka panjang)
const m_acc_01_config: DragDropSchedulerConfig = {
  tasks: [
    { id: 'plan_1', label: 'Lulus tepat waktu', duration: 2, color: '#3d7a3d' },
    { id: 'plan_2', label: 'Magang di tempat impian', duration: 2, color: '#3d7a3d' },
    { id: 'plan_3', label: 'Belajar bahasa baru', duration: 1, color: '#2a5c8a' },
    { id: 'plan_4', label: 'Liburan bersama keluarga', duration: 1, color: '#c98a3e' },
  ],
  slots: ['Bulan ke-1', 'Bulan ke-3', 'Bulan ke-6', 'Bulan ke-9', 'Bulan ke-12', 'Tahun depan'],
  correctMapping: {
    plan_1: 'Bulan ke-6',
    plan_2: 'Bulan ke-9',
    plan_3: 'Bulan ke-1',
    plan_4: 'Tahun depan',
  },
}

// ── Misi 2: Ikut Lomba ──────────────────────────────────────────────────────────
// Lokasi: Lab | Mini-game: Quick Time Event (selesaikan proyek kompetisi)
const m_acc_02_config: QuickTimeEventConfig = {
  duration: 35,
  spawnInterval: 2,
  targets: [
    { id: 'target_1', x: 25, y: 35, label: 'Presentasikan!' },
    { id: 'target_2', x: 55, y: 50, label: 'Jawab cepat!' },
    { id: 'target_3', x: 70, y: 25, label: 'Selesaikan!' },
    { id: 'target_4', x: 40, y: 65, label: 'Tunjukkan hasil!' },
    { id: 'target_5', x: 60, y: 40, label: 'Presentasikan!' },
  ],
}

// ── Misi 3: Berkenalan dengan Orang-Orang Baru ─────────────────────────────────
// Lokasi: Taman | Mini-game: Word Puzzle (pilih kata pembuka obrolan)
const m_acc_03_config: WordPuzzleConfig = {
  target: 'TERBUKA',
  letters: ['T', 'E', 'R', 'B', 'U', 'K', 'A', 'M', 'A', 'J', 'U'],
  timeLimit: 70,
}

// ── Misi 4: Belajar Skill Baru ──────────────────────────────────────────────────
// Lokasi: Kelas | Mini-game: Breathing Rhythm (ikuti ritme — belajar hobi/musik baru)
const m_acc_04_config: BreathingRhythmConfig = {
  inhaleSeconds: 4,
  holdSeconds: 2,
  exhaleSeconds: 4,
  cycles: 5,
}

// ── Misi 5: Menata Ulang Kamar ──────────────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Room Decoration (geser dekorasi ke tempatnya)
const m_acc_05_config: RoomDecorationConfig = {
  items: [
    { id: 'deco_1', label: 'Tirai warna pastel', color: '#e3b8d6' },
    { id: 'deco_2', label: 'Lampu hangat', color: '#f4d58d' },
    { id: 'deco_3', label: 'Rak buku baru', color: '#a9c5a0' },
    { id: 'deco_4', label: 'Foto-foto baru di dinding', color: '#9fc9e8' },
  ],
  slots: [
    { id: 'slot_window', label: 'Jendela',       x: 20, y: 25, accepts: 'deco_1' },
    { id: 'slot_desk',   label: 'Meja Belajar',  x: 65, y: 30, accepts: 'deco_2' },
    { id: 'slot_corner', label: 'Sudut Ruangan', x: 30, y: 65, accepts: 'deco_3' },
    { id: 'slot_wall',   label: 'Dinding',       x: 70, y: 60, accepts: 'deco_4' },
  ],
}

// ── Misi 6: Menanam Bibit Baru di Pot Lain ─────────────────────────────────────
// Lokasi: Kamar | Mini-game: Planting Game (urutkan langkah menanam — pemicu Epilogue)
const m_acc_06_config: PlantingGameConfig = {
  steps: [
    { id: 'step_1', label: 'Siapkan pot dan tanah baru', icon: '🪴' },
    { id: 'step_2', label: 'Tanam bibitnya', icon: '🌱' },
    { id: 'step_3', label: 'Siram secukupnya', icon: '💧' },
    { id: 'step_4', label: 'Letakkan di tempat yang cukup cahaya', icon: '☀️' },
  ],
  correctOrder: ['step_1', 'step_2', 'step_3', 'step_4'],
}

// ─── Export ────────────────────────────────────────────────────────────────────

export const acceptanceMissionPool: DailyMission[] = [
  {
    id: 'acc_m01',
    label: 'Menyusun Rencana Masa Depan',
    description: 'Bukan untuk melupakan — tapi untuk mulai melangkah ke arah yang baru.',
    location: 'kamar',
    minigameType: 'drag-drop-scheduler',
    config: m_acc_01_config,
    onCompleteWeights: { distress: -2, hope: 6 },
    onAbandonWeights:  { hope: -1 },
  },
  {
    id: 'acc_m02',
    label: 'Ikut Lomba',
    description: 'Buktikan ke dirimu sendiri — kamu masih bisa berdiri tanpa bergantung pada siapa pun.',
    location: 'lab',
    minigameType: 'quick-time-event',
    config: m_acc_02_config,
    onCompleteWeights: { distress: -3, hope: 8 },
    onAbandonWeights:  { distress: 2 },
  },
  {
    id: 'acc_m03',
    label: 'Berkenalan dengan Orang-Orang Baru',
    description: 'Wajah baru, cerita baru. Coba lihat mereka apa adanya — bukan sebagai pembanding.',
    location: 'taman',
    minigameType: 'word-puzzle',
    config: m_acc_03_config,
    onCompleteWeights: { distress: -2, hope: 5, denial: -2 },
    onAbandonWeights:  { distress: 2, denial: 1 },
  },
  {
    id: 'acc_m04',
    label: 'Belajar Skill Baru',
    description: 'Sesuatu yang benar-benar milikmu sendiri. Tanpa kaitan dengan masa lalu.',
    location: 'kelas',
    minigameType: 'breathing-rhythm',
    config: m_acc_04_config,
    onCompleteWeights: { distress: -2, hope: 5 },
    onAbandonWeights:  { distress: 1 },
  },
  {
    id: 'acc_m05',
    label: 'Menata Ulang Kamar',
    description: 'Warna baru, susunan baru. Ruang ini akhirnya terasa seperti milikmu lagi.',
    location: 'kamar',
    minigameType: 'room-decoration',
    config: m_acc_05_config,
    onCompleteWeights: { distress: -3, hope: 6 },
    onAbandonWeights:  { distress: 1 },
  },
  {
    id: 'acc_m06',
    label: 'Menanam Bibit Baru di Pot Lain',
    description: 'Pot yang berbeda. Bibit yang berbeda. Awal yang sepenuhnya baru.',
    location: 'kamar',
    minigameType: 'planting-game',
    config: m_acc_06_config,
    onCompleteWeights: { distress: -4, hope: 9, denial: -2 },
    onAbandonWeights:  { distress: 2 },
  },
]
