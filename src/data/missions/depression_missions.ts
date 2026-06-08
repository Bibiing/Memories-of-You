/**
 * src/data/missions/depression_missions.ts
 *
 * Pool 5 misi untuk Chapter Depression.
 * Tema: penarikan diri, krisis identitas, dan langkah pertama melepaskan —
 * tanpa bergantung pada benda fisik peninggalan Dia (yang sudah dibuang
 * saat misi "Beres-beres Kamar" di Anger). Kenangan yang tersisa di sini
 * bersifat digital/intangible — sesuatu yang tidak ikut terbuang saat itu.
 */

import type {
  BreathingRhythmConfig,
  StruggleButtonConfig,
  FindTheDifferenceConfig,
  RoomDecorationConfig,
} from '@/types/minigame'

import type { DailyMission } from './denial_missions'

// ── Misi 1: Menangis ───────────────────────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Breathing Rhythm (ikuti ritme napas yang tak teratur)
const m_dep_01_config: BreathingRhythmConfig = {
  inhaleSeconds: 3,
  holdSeconds: 2,
  exhaleSeconds: 7,
  cycles: 4,
}

// ── Misi 2: Menjauh dari Keramaian ─────────────────────────────────────────────
// Lokasi: Taman | Mini-game: Struggle Button (tahan diri dari interaksi sosial)
const m_dep_02_config: StruggleButtonConfig = {
  target: 12,
  label: 'Cari sudut yang sepi',
  timeLimit: 30,
}

// ── Misi 3: Bercermin ──────────────────────────────────────────────────────────
// Lokasi: Kamar Mandi | Mini-game: Find the Difference (amati perubahan tatapan)
const m_dep_03_config: FindTheDifferenceConfig = {
  timeLimit: 60,
  differences: [
    { id: 'diff_1', x: 30, y: 25, radius: 4 },
    { id: 'diff_2', x: 55, y: 45, radius: 4 },
    { id: 'diff_3', x: 68, y: 60, radius: 5 },
  ],
}

// ── Misi 4: Menahan Diri untuk Tidak Menghubungi Dia ───────────────────────────
// Lokasi: Kamar | Mini-game: Struggle Button ("kunci" niat membuka chat Dia)
// Catatan: kegagalan di sini terhubung ke Rule Dep-02 (regresi sementara ke Bargaining)
const m_dep_04_config: StruggleButtonConfig = {
  target: 18,
  label: 'Tahan, jangan buka chat',
  timeLimit: 25,
}

// ── Misi 5: Mengarsipkan Kenangan ──────────────────────────────────────────────
// Lokasi: Kamar | Mini-game: Room Decoration (drag kenangan digital ke kotak arsip)
// Reframing: bukan benda fisik (sudah hancur di Anger), melainkan jejak digital/
// intangible — voice note, playlist, catatan, foto di cloud — yang baru sekarang
// disadari masih ada dan perlu "diselesaikan" sebelum melangkah ke Acceptance.
const m_dep_05_config: RoomDecorationConfig = {
  items: [
    { id: 'memory_1', label: 'Voice note lama dari Dia', color: '#3a3a5c' },
    { id: 'memory_2', label: 'Playlist lagu favorit kalian', color: '#3a3a5c' },
    { id: 'memory_3', label: 'Catatan kecil di buku harian', color: '#3a3a5c' },
    { id: 'memory_4', label: 'Folder foto tersembunyi di galeri', color: '#3a3a5c' },
  ],
  slots: [
    { id: 'box_voice',    label: 'Kotak Arsip', x: 25, y: 35, accepts: 'memory_1' },
    { id: 'box_playlist', label: 'Kotak Arsip', x: 60, y: 30, accepts: 'memory_2' },
    { id: 'box_diary',    label: 'Kotak Arsip', x: 35, y: 65, accepts: 'memory_3' },
    { id: 'box_photos',   label: 'Kotak Arsip', x: 70, y: 60, accepts: 'memory_4' },
  ],
}

// ─── Export ────────────────────────────────────────────────────────────────────

export const depressionMissionPool: DailyMission[] = [
  {
    id: 'dep_m01',
    label: 'Menangis',
    description: 'Tidak apa-apa untuk merasa berat hari ini. Biarkan saja keluar.',
    location: 'kamar',
    minigameType: 'breathing-rhythm',
    config: m_dep_01_config,
    onCompleteWeights: { distress: -7, hope: 1 },
    onAbandonWeights:  { distress: 3 },
  },
  {
    id: 'dep_m02',
    label: 'Menjauh dari Keramaian',
    description: 'Terlalu banyak orang. Terlalu banyak suara. Cari sudut yang sepi.',
    location: 'taman',
    minigameType: 'struggle-button',
    config: m_dep_02_config,
    onCompleteWeights: { distress: -3 },
    onAbandonWeights:  { distress: 4 },
  },
  {
    id: 'dep_m03',
    label: 'Bercermin',
    description: 'Lihat baik-baik. Ada yang berbeda dari tatapanmu, bukan?',
    location: 'kamar-mandi',
    minigameType: 'find-the-difference',
    config: m_dep_03_config,
    onCompleteWeights: { distress: -2, hope: 2 },
    onAbandonWeights:  { distress: 4, hope: -2 },
  },
  {
    id: 'dep_m04',
    label: 'Menahan Diri untuk Tidak Menghubungi Dia',
    description: 'Jarimu sudah di atas layar. Tahan. Jangan buka chat itu.',
    location: 'kamar',
    minigameType: 'struggle-button',
    config: m_dep_04_config,
    onCompleteWeights: { distress: -4, hope: 3, denial: -2 },
    onAbandonWeights:  { distress: 6, denial: 4 },
  },
  {
    id: 'dep_m05',
    label: 'Mengarsipkan Kenangan',
    description: 'Satu per satu, masukkan semuanya ke dalam kotak. Bukan untuk dilupakan — hanya disimpan.',
    location: 'kamar',
    minigameType: 'room-decoration',
    config: m_dep_05_config,
    onCompleteWeights: { distress: -5, hope: 4, denial: -3 },
    onAbandonWeights:  { distress: 5, denial: 2 },
  },
]
