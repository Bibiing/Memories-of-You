import Dexie, { type Table } from 'dexie'
import type { EmotionalState } from '@stores/emotionalStore'
import type { InventoryState } from '@stores/inventoryStore'
import type { Chapter } from '@/types/game'

export interface SaveData {
  id: string // save slot ID (e.g. "slot_1")
  timestamp: Date
  playerName: string
  chapter: Chapter
  day: number
  emotional: EmotionalState
  inventory: InventoryState
  // encrypted blob stored separately
}

export interface EncryptedSave {
  id: string
  timestamp: Date
  playerName: string // stored plain for display in load screen
  chapter: Chapter // stored plain for display
  day: number
  iv: string // AES-GCM IV (base64)
  encryptedData: string // encrypted JSON (base64)
  integrityHash: string // SHA-256 of plaintext JSON
}

export interface AppSettings {
  key: string
  value: string | number | boolean
}

export class MemoDatabase extends Dexie {
  saves!: Table<EncryptedSave, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('MemoriesOfYouDB')
    this.version(1).stores({
      saves: 'id, timestamp, playerName, chapter',
      settings: 'key',
    })
  }
}

export const db = new MemoDatabase()
export const MAX_SAVE_SLOTS = 5
