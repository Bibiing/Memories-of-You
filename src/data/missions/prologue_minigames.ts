/**
 * src/data/missions/prologue_minigames.ts
 *
 * Konfigurasi mini-game untuk Prologue.
 * Field names disesuaikan dengan types/minigame.ts yang ada di repo.
 */

import type {
  SliderPuzzleConfig,
  HiddenObjectConfig,
  PlantingGameConfig,
} from '@/types/minigame'

// ─── Step 2: Slider Puzzle (Rute ke Pasar Bunga) ──────────────────────────────
// SliderPuzzleConfig: { rows, cols, grid }
// grid encoding: 0 = jalan, 1 = wall, 2 = player start, 3 = goal

export const prologueMapPuzzleConfig: SliderPuzzleConfig = {
  rows: 5,
  cols: 5,
  grid: [
    [2, 0, 1, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 1, 0, 3],
  ],
  // 2 = start (pojok kiri atas), 3 = goal (pojok kanan bawah)
  // Satu jalur optimal: turun kolom 1, lalu kanan ke kolom 3, lalu turun ke goal
}

// ─── Step 4: Hidden Object (Cari 10 Kaktus di Pasar) ─────────────────────────
// HiddenObjectConfig: { timeLimit, targets: HiddenTarget[] }
// HiddenTarget: { id, x, y, radius, label }

export const prologueCactusHuntConfig: HiddenObjectConfig = {
  timeLimit: 90,
  targets: [
    { id: 'cactus_1',  x: 12, y: 55, radius: 4, label: 'Kaktus Bintang' },
    { id: 'cactus_2',  x: 24, y: 70, radius: 4, label: 'Kaktus Silinder' },
    { id: 'cactus_3',  x: 33, y: 40, radius: 3, label: 'Kaktus Ular Kecil' },
    { id: 'cactus_4',  x: 41, y: 62, radius: 4, label: 'Kaktus Bakung' },
    { id: 'cactus_5',  x: 51, y: 30, radius: 3, label: 'Kaktus Kipas' },
    { id: 'cactus_6',  x: 58, y: 75, radius: 4, label: 'Kaktus Koral' },
    { id: 'cactus_7',  x: 65, y: 48, radius: 3, label: 'Kaktus Kandelabra' },
    { id: 'cactus_8',  x: 73, y: 35, radius: 3, label: 'Kaktus Landak' },
    { id: 'cactus_9',  x: 81, y: 60, radius: 4, label: 'Kaktus Bola' },
    { id: 'cactus_10', x: 90, y: 25, radius: 3, label: 'Kaktus Kolom' },
  ],
}

// ─── Step 6: Planting Game (Siram Kaktus Pertama) ────────────────────────────
// PlantingGameConfig: { steps: PlantStep[], correctOrder: string[] }
// PlantStep: { id, label, icon }

export const prologueWaterCactusConfig: PlantingGameConfig = {
  steps: [
    { id: 'fill_glass',   label: 'Ambil & isi gelas ukur',      icon: '🥛' },
    { id: 'carry_to_pot', label: 'Bawa ke pot kaktus',          icon: '🚶' },
    { id: 'water_cactus', label: 'Siram kaktus perlahan',       icon: '💧' },
  ],
  correctOrder: ['fill_glass', 'carry_to_pot', 'water_cactus'],
}