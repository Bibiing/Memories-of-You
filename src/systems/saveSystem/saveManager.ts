import { db, type SaveData, type EncryptedSave, MAX_SAVE_SLOTS } from './saveSchema'
import { encryptData, decryptData } from '@utils/crypto'
import { hashString, verifyHash } from '@utils/hash'

export async function saveGame(data: SaveData): Promise<void> {
  const plaintext = JSON.stringify({
    emotional: data.emotional,
    inventory: data.inventory,
    day: data.day,
  })

  const integrityHash = await hashString(plaintext)
  const blob = await encryptData(plaintext)

  const encryptedSave: EncryptedSave = {
    id: data.id,
    timestamp: data.timestamp,
    playerName: data.playerName,
    chapter: data.chapter,
    day: data.day,
    iv: blob.iv,
    encryptedData: blob.data,
    integrityHash,
  }

  await db.saves.put(encryptedSave)
}

export async function loadGame(slotId: string): Promise<SaveData | null> {
  const record = await db.saves.get(slotId)
  if (!record) return null

  const plaintext = await decryptData({ iv: record.iv, data: record.encryptedData })

  const isValid = await verifyHash(plaintext, record.integrityHash)
  if (!isValid) {
    throw new Error('Save data integrity check failed. File may be corrupted or tampered.')
  }

  const parsed = JSON.parse(plaintext) as Pick<SaveData, 'emotional' | 'inventory' | 'day'>

  return {
    id: record.id,
    timestamp: record.timestamp,
    playerName: record.playerName,
    chapter: record.chapter,
    day: parsed.day,
    emotional: parsed.emotional,
    inventory: parsed.inventory,
  }
}

export async function listSaves(): Promise<EncryptedSave[]> {
  return db.saves.orderBy('timestamp').reverse().toArray()
}

export async function deleteSave(slotId: string): Promise<void> {
  await db.saves.delete(slotId)
}

export async function getSaveCount(): Promise<number> {
  return db.saves.count()
}

export function generateSlotId(): string {
  return `slot_${String(Date.now())}`
}

export { MAX_SAVE_SLOTS }
