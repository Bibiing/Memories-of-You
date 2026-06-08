/**
 * src/data/missions/bargaining_missions.ts
 *
 * Pool 6 misi untuk Chapter Bargaining.
 * Tema: mencari pengalih, "menukar" rasa sakit dengan kesibukan/kesenangan sesaat,
 * dan langkah pertama melepaskan jejak Dia (mempersiapkan transisi ke Depression).
 */

import type {
  HiddenObjectConfig,
  SliderPuzzleConfig,
  WordPuzzleConfig,
  FindTheDifferenceConfig,
  HoldToDeleteConfig,
  DragDropSchedulerConfig,
} from '@/types/minigame'

import type { DailyMission } from './denial_missions'

// ── Misi 1: Belanja Self-Reward ────────────────────────────────────────────────
// Lokasi: Pusat Perbelanjaan | Mini-game: Hidden Object (cari barang self-reward)
const m_bar_01_config: HiddenObjectConfig = {
  timeLimit: 70,
  targets: [
    { id: 'item_1', x: 18, y: 50, radius: 5, label: 'Jaket yang kamu suka' },
    { id: 'item_2', x: 40, y: 35, radius: 5, label: 'Sepatu baru' },
    { id: 'item_3', x: 60, y: 60, radius: 4, label: 'Parfum favorit' },
    { id: 'item_4', x: 78, y: 40, radius: 5, label: 'Aksesoris lucu' },
  ],
}

// ── Misi 2: Main Boardgame Bareng Teman ────────────────────────────────────────
// Lokasi: Tempat Main | Mini-game: Slider Puzzle (puzzle logika kompetitif)
const m_bar_02_config: SliderPuzzleConfig = {
  rows: 5,
  cols: 5,
  grid: [
    [2, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 1, 3],
  ],
}

// ── Misi 3: Makan-makan Bersama Teman ──────────────────────────────────────────
// Lokasi: Taman | Mini-game: Word Puzzle (pilih kata yang tepat saat mengobrol)
const m_bar_03_config: WordPuzzleConfig = {
  target: 'DENGAR',
  letters: ['D', 'E', 'N', 'G', 'A', 'R', 'T', 'A', 'N', 'Y', 'A'],
  timeLimit: 75,
}

// ── Misi 4: Nonton di Bioskop ───────────────────────────────────────────────────
// Lokasi: Bioskop | Mini-game: Find the Difference (amati adegan demi adegan)
const m_bar_04_config: FindTheDifferenceConfig = {
  timeLimit: 80,
  differences: [
    { id: 'diff_1', x: 22, y: 40, radius: 5 },
    { id: 'diff_2', x: 48, y: 65, radius: 5 },
    { id: 'diff_3', x: 70, y: 30, radius: 4 },
  ],
}

// ── Misi 5: Menghapus Dia dari Ingatan ─────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Hold to Delete (hapus jejak digital di smartphone)
const m_bar_05_config: HoldToDeleteConfig = {
  elements: [
    { id: 'photo_1', label: 'Semua foto bersama Dia', color: '#4a3b6b' },
    { id: 'chat_1', label: 'Riwayat chat dengan Dia', color: '#4a3b6b' },
    { id: 'contact_1', label: 'Kontak nomor Dia', color: '#4a3b6b' },
    { id: 'social_1', label: 'Akun media sosial Dia', color: '#4a3b6b' },
  ],
  holdDuration: 3000,
}

// ── Misi 6: Puzzle Manajemen Proyek ─────────────────────────────────────────────
// Lokasi: Lab | Mini-game: Drag Drop Scheduler (susun jadwal tugas tanpa tekanan)
const m_bar_06_config: DragDropSchedulerConfig = {
  tasks: [
    { id: 'task_1', label: 'Revisi proposal skripsi', duration: 2, color: '#2a5c8a' },
    { id: 'task_2', label: 'Eksperimen lab', duration: 2, color: '#2a5c8a' },
    { id: 'task_3', label: 'Diskusi kelompok', duration: 1, color: '#3d7a3d' },
    { id: 'task_4', label: 'Menulis laporan', duration: 1, color: '#2a5c8a' },
  ],
  slots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
  correctMapping: {
    task_1: '08:00',
    task_2: '10:00',
    task_3: '13:00',
    task_4: '14:00',
  },
}

// ─── Export ────────────────────────────────────────────────────────────────────

export const bargainingMissionPool: DailyMission[] = [
  {
    id: 'bar_m01',
    label: 'Belanja Self-Reward',
    description: 'Mungkin sesuatu yang baru bisa mengisi kekosongan ini. Sebentar saja.',
    location: 'pusat-perbelanjaan',
    minigameType: 'hidden-object',
    config: m_bar_01_config,
    onCompleteWeights: { distress: -2, hope: 4 },
    onAbandonWeights:  { distress: 2, denial: 2 },
  },
  {
    id: 'bar_m02',
    label: 'Main Boardgame Bareng Teman',
    description: 'Fokus pada papan ini. Bukan pada hal lain.',
    location: 'tempat-main',
    minigameType: 'slider-puzzle',
    config: m_bar_02_config,
    onCompleteWeights: { distress: -4, hope: 3, denial: -2 },
    onAbandonWeights:  { distress: 3, denial: 1 },
  },
  {
    id: 'bar_m03',
    label: 'Makan-makan Bersama Teman',
    description: 'Obrolan ringan, makanan enak. Coba jangan bawa nama Dia ke meja ini.',
    location: 'taman',
    minigameType: 'word-puzzle',
    config: m_bar_03_config,
    onCompleteWeights: { distress: -3, hope: 4 },
    onAbandonWeights:  { distress: 5, denial: 2 },
  },
  {
    id: 'bar_m04',
    label: 'Nonton di Bioskop',
    description: 'Pilih filmnya baik-baik. Beberapa cerita terasa terlalu dekat.',
    location: 'bioskop',
    minigameType: 'find-the-difference',
    config: m_bar_04_config,
    onCompleteWeights: { distress: -4, hope: 2, denial: -1 },
    onAbandonWeights:  { distress: 4, denial: 3 },
  },
  {
    id: 'bar_m05',
    label: 'Menghapus Dia dari Ingatan',
    description: 'Tahan tombolnya. Lihat semuanya menghilang, satu per satu.',
    location: 'kamar',
    minigameType: 'hold-to-delete',
    config: m_bar_05_config,
    // Berat tapi nyata: denial turun signifikan, meski distress sempat naik sedikit
    onCompleteWeights: { distress: 1, hope: 3, denial: -6 },
    onAbandonWeights:  { distress: 5, denial: 3 },
  },
  {
    id: 'bar_m06',
    label: 'Puzzle Manajemen Proyek',
    description: 'Atur rencana. Buat sesuatu yang bisa kamu kendalikan sepenuhnya.',
    location: 'lab',
    minigameType: 'drag-drop-scheduler',
    config: m_bar_06_config,
    onCompleteWeights: { distress: -3, hope: 5, denial: -1 },
    onAbandonWeights:  { distress: 2 },
  },
]
