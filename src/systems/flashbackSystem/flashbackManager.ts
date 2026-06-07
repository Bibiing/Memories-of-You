import type { FlashbackId, Chapter, Location } from '@/types/game'
import { useInventoryStore } from '@stores/inventoryStore'

// Which flashbacks are tied to which location (all chapters unless overridden)
export interface FlashbackTrigger {
  flashbackId: FlashbackId
  location: Location
  objectLabel: string
  chapter?: Chapter
}

export const FLASHBACK_TRIGGERS: FlashbackTrigger[] = [
  { flashbackId: 'fb_telponan', location: 'kamar', objectLabel: 'Handphone di meja' },
  { flashbackId: 'fb_makan', location: 'restoran', objectLabel: 'Meja favorit' },
  { flashbackId: 'fb_ngeprank', location: 'koridor-lab', objectLabel: 'Sudut koridor' },
  { flashbackId: 'fb_bola', location: 'lapangan', objectLabel: 'Tengah lapangan' },
  { flashbackId: 'fb_main', location: 'tempat-main', objectLabel: 'Mesin claw machine' },
  { flashbackId: 'fb_snack', location: 'rooftop', objectLabel: 'Spot favorit' },
  { flashbackId: 'fb_curhat', location: 'rooftop', objectLabel: 'Sudut rooftop', chapter: 'denial' },
]

export function getAvailableFlashbacks(location: Location, chapter?: Chapter): FlashbackTrigger[] {
  return FLASHBACK_TRIGGERS.filter(
    (t) =>
      t.location === location &&
      (t.chapter === undefined || t.chapter === chapter)
  )
}

export function unlockFlashback(id: FlashbackId): void {
  useInventoryStore.getState().unlockFlashback(id)
}

export function isUnlocked(id: FlashbackId): boolean {
  return useInventoryStore.getState().isFlashbackUnlocked(id)
}
