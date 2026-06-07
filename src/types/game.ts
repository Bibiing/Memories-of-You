// Core game types shared across all systems

export type Chapter =
  | 'prologue'
  | 'denial'
  | 'anger'
  | 'bargaining'
  | 'depression'
  | 'acceptance'
  | 'epilogue'

export type RuminationMode = 'brooding' | 'reflection' | 'neutral'

export type GameScene =
  | 'main-menu'
  | 'name-input'
  | 'load-screen'
  | 'gameplay'
  | 'evening-reflection'
  | 'flashback'
  | 'chapter-transition'
  | 'credits'

export type Location =
  | 'kamar'
  | 'rooftop'
  | 'kelas'
  | 'lab'
  | 'koridor-lab'
  | 'taman'
  | 'pusat-perbelanjaan'
  | 'jalanan-kota'
  | 'venue-pameran'
  | 'lapangan'
  | 'restoran'
  | 'tempat-main'
  | 'bioskop'
  | 'kamar-mandi'

export type FlashbackId =
  | 'fb_telponan'
  | 'fb_makan'
  | 'fb_ngeprank'
  | 'fb_bola'
  | 'fb_main'
  | 'fb_snack'
  | 'fb_curhat'

export type CactusState =
  | 'healthy' // Prologue
  | 'sick' // Denial
  | 'very-sick' // Anger
  | 'dead-trying' // Bargaining
  | 'dead' // Depression
  | 'empty-pot' // Acceptance
  | 'sprouting' // Epilogue

// Map chapter to cactus state
export const CHAPTER_CACTUS_STATE: Record<Chapter, CactusState> = {
  prologue: 'healthy',
  denial: 'sick',
  anger: 'very-sick',
  bargaining: 'dead-trying',
  depression: 'dead',
  acceptance: 'empty-pot',
  epilogue: 'sprouting',
}

export interface SaveSlotInfo {
  id: string
  playerName: string
  chapter: Chapter
  day: number
  timestamp: Date
}
