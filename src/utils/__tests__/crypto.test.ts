import { describe, it, expect } from 'vitest'
import { encryptData, decryptData } from '../crypto'

describe('encryptData / decryptData', () => {
  it('round-trips plaintext correctly', async () => {
    const plaintext = 'Hello, Memories of You!'
    const blob = await encryptData(plaintext)
    const result = await decryptData(blob)
    expect(result).toBe(plaintext)
  })

  it('round-trips a JSON save payload correctly', async () => {
    const payload = JSON.stringify({
      distress: 45,
      hope: 72,
      denial: 30,
      rumination: 'brooding',
      flashbackUnlocked: ['fb_telponan', 'fb_makan'],
    })
    const blob = await encryptData(payload)
    const result = await decryptData(blob)
    expect(JSON.parse(result)).toEqual(JSON.parse(payload))
  })

  it('produces unique IVs for each encryption of the same plaintext', async () => {
    const text = 'same-content'
    const blob1 = await encryptData(text)
    const blob2 = await encryptData(text)
    // IVs must differ (AES-GCM requires fresh IV per encryption)
    expect(blob1.iv).not.toBe(blob2.iv)
  })

  it('produces different ciphertext for the same plaintext due to random IV', async () => {
    const text = 'same-content'
    const blob1 = await encryptData(text)
    const blob2 = await encryptData(text)
    expect(blob1.data).not.toBe(blob2.data)
  })

  it('returns base64-encoded iv and data strings', async () => {
    const blob = await encryptData('test')
    const base64Pattern = /^[A-Za-z0-9+/]+=*$/
    expect(base64Pattern.test(blob.iv)).toBe(true)
    expect(base64Pattern.test(blob.data)).toBe(true)
  })

  it('throws on tampered ciphertext', async () => {
    const blob = await encryptData('secure-data')
    const tampered = { ...blob, data: blob.data.slice(0, -4) + 'XXXX' }
    await expect(decryptData(tampered)).rejects.toThrow()
  })

  it('throws on tampered IV', async () => {
    const blob = await encryptData('secure-data')
    // Flip first char of base64 IV
    const alteredIv = blob.iv.startsWith('A') ? 'B' + blob.iv.slice(1) : 'A' + blob.iv.slice(1)
    await expect(decryptData({ ...blob, iv: alteredIv })).rejects.toThrow()
  })

  it('handles empty string input', async () => {
    const blob = await encryptData('')
    const result = await decryptData(blob)
    expect(result).toBe('')
  })

  it('handles unicode and emoji content', async () => {
    const text = 'aku rindu 💔 dan kenangan itu 🌵'
    const blob = await encryptData(text)
    const result = await decryptData(blob)
    expect(result).toBe(text)
  })
})
