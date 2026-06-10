/**
 * src/data/missions/prologue_minigames.ts
 *
 * Konfigurasi mini-game untuk Prologue.
 * Field names disesuaikan dengan types/minigame.ts yang ada di repo.
 */

import type { SliderPuzzleConfig, HiddenObjectConfig, PlantingGameConfig } from '@/types/minigame'

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

// Target positions are calculated for the pasar-bunga.svg background.
// The ho-stage uses aspect-ratio:4/3 with background-size:cover.
// At stage width ~354px: cover scale=0.407 (height-limited), offset_x=65.4px.
// Visible SVG x range: 12.5%–87.5%.  Formula:
//   x_c% = (svg_cx * 0.407 - 65.4) / 354 * 100
//   y_c%  = svg_cy / 720 * 100
export const prologueCactusHuntConfig: HiddenObjectConfig = {
  timeLimit: 90,
  targets: [
    { id: 'cactus_1', x: 18, y: 49, radius: 5, label: 'Kaktus Lapak Kiri' },
    { id: 'cactus_2', x: 23, y: 56, radius: 5, label: 'Kaktus Silinder' },
    { id: 'cactus_3', x: 30, y: 51, radius: 5, label: 'Kaktus Kipas' },
    { id: 'cactus_4', x: 36, y: 47, radius: 5, label: 'Kaktus Kolom' },
    { id: 'cactus_5', x: 41, y: 51, radius: 5, label: 'Kaktus Ungu' },
    { id: 'cactus_6', x: 53, y: 55, radius: 5, label: 'Kaktus Tengah' },
    { id: 'cactus_7', x: 59, y: 50, radius: 5, label: 'Kaktus Kandelabra' },
    { id: 'cactus_8', x: 71, y: 51, radius: 5, label: 'Kaktus Oranye' },
    { id: 'cactus_9', x: 77, y: 52, radius: 5, label: 'Kaktus Daun' },
    { id: 'cactus_10', x: 88, y: 53, radius: 5, label: 'Kaktus Lapak Kanan' },
  ],
}

// ─── Step 6: Planting Game (Siram Kaktus Pertama) ────────────────────────────
// PlantingGameConfig: { steps: PlantStep[], correctOrder: string[] }
// PlantStep: { id, label, icon }

export const prologueWaterCactusConfig: PlantingGameConfig = {
  steps: [
    { id: 'fill_glass', label: 'Ambil & isi gelas ukur', icon: '🥛' },
    { id: 'carry_to_pot', label: 'Bawa ke pot kaktus', icon: '🚶' },
    { id: 'water_cactus', label: 'Siram kaktus perlahan', icon: '💧' },
  ],
  correctOrder: ['fill_glass', 'carry_to_pot', 'water_cactus'],
}
