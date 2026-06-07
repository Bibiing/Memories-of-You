import type { InteractionTrigger } from '@/types/dialogue'

// All interaction triggers in the game, keyed by location.
// Positions are % of scene width (x) and height (y).
export const ALL_TRIGGERS: InteractionTrigger[] = [
  // ── Kamar ──────────────────────────────────────────────
  {
    id: 'kamar_hp',
    location: 'kamar',
    label: 'Handphone',
    position: { x: 66, y: 57 },
    action: { type: 'flashback', flashbackId: 'fb_telponan' },
    oneTime: false,
  },
  {
    id: 'kamar_foto',
    location: 'kamar',
    label: 'Foto di rak',
    position: { x: 78, y: 28 },
    action: { type: 'flashback', flashbackId: 'fb_curhat' },
    oneTime: false,
  },

  // ── Rooftop ────────────────────────────────────────────
  {
    id: 'rooftop_spot',
    location: 'rooftop',
    label: 'Spot favorit',
    position: { x: 40, y: 68 },
    action: { type: 'flashback', flashbackId: 'fb_snack' },
    oneTime: false,
  },

  // ── Koridor Lab ────────────────────────────────────────
  {
    id: 'koridor_sudut',
    location: 'koridor-lab',
    label: 'Sudut koridor',
    position: { x: 28, y: 60 },
    action: { type: 'flashback', flashbackId: 'fb_ngeprank' },
    oneTime: false,
  },

  // ── Taman ──────────────────────────────────────────────
  {
    id: 'taman_bangku',
    location: 'taman',
    label: 'Bangku taman',
    position: { x: 35, y: 74 },
    action: { type: 'flashback', flashbackId: 'fb_bola' },
    oneTime: false,
  },

  // ── Lapangan ───────────────────────────────────────────
  {
    id: 'lapangan_tengah',
    location: 'lapangan',
    label: 'Tengah lapangan',
    position: { x: 50, y: 68 },
    action: { type: 'flashback', flashbackId: 'fb_bola' },
    oneTime: false,
  },

  // ── Restoran ───────────────────────────────────────────
  {
    id: 'restoran_meja',
    location: 'restoran',
    label: 'Meja favorit',
    position: { x: 50, y: 55 },
    action: { type: 'flashback', flashbackId: 'fb_makan' },
    oneTime: false,
  },

  // ── Tempat Main ────────────────────────────────────────
  {
    id: 'main_claw',
    location: 'tempat-main',
    label: 'Claw machine',
    position: { x: 24, y: 65 },
    action: { type: 'flashback', flashbackId: 'fb_main' },
    oneTime: false,
  },
]
