import { describe, it, expect } from 'vitest'
import { hashString, verifyHash } from '../hash'

describe('hashString', () => {
  it('returns a 64-char hex string for SHA-256', async () => {
    const result = await hashString('hello')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })

  it('is deterministic — same input always yields same hash', async () => {
    const a = await hashString('memories-of-you')
    const b = await hashString('memories-of-you')
    expect(a).toBe(b)
  })

  it('produces different hashes for different inputs', async () => {
    const a = await hashString('input-a')
    const b = await hashString('input-b')
    expect(a).not.toBe(b)
  })

  it('handles empty string input', async () => {
    const result = await hashString('')
    expect(result).toHaveLength(64)
  })

  it('handles unicode and special characters', async () => {
    const result = await hashString('Kenangan yang hilang 💭 ✨')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })
})

describe('verifyHash', () => {
  it('returns true when input matches the expected hash', async () => {
    const input = 'save-data-payload'
    const hash = await hashString(input)
    const valid = await verifyHash(input, hash)
    expect(valid).toBe(true)
  })

  it('returns false when input does not match the hash', async () => {
    const hash = await hashString('original-data')
    const valid = await verifyHash('tampered-data', hash)
    expect(valid).toBe(false)
  })

  it('detects single-character tampering', async () => {
    const hash = await hashString('distress:50,hope:80')
    const valid = await verifyHash('distress:51,hope:80', hash)
    expect(valid).toBe(false)
  })
})
