import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAvailableFlashbacks,
  unlockFlashback,
  isUnlocked,
  FLASHBACK_TRIGGERS,
} from '../flashbackManager'
import { useInventoryStore } from '@stores/inventoryStore'

beforeEach(() => {
  useInventoryStore.setState({ flashbackUnlocked: [], actionHistory: [], inventory: [] })
})

describe('FLASHBACK_TRIGGERS', () => {
  it('has exactly 7 trigger entries', () => {
    const ids = new Set(FLASHBACK_TRIGGERS.map((t) => t.flashbackId))
    expect(ids.size).toBe(7)
  })

  it('every trigger has a location and objectLabel', () => {
    for (const t of FLASHBACK_TRIGGERS) {
      expect(t.location).toBeTruthy()
      expect(t.objectLabel).toBeTruthy()
    }
  })
})

describe('getAvailableFlashbacks', () => {
  it('returns triggers for kamar', () => {
    const result = getAvailableFlashbacks('kamar')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.every((t) => t.location === 'kamar')).toBe(true)
  })

  it('returns empty array for location with no triggers', () => {
    const result = getAvailableFlashbacks('kamar-mandi')
    expect(result).toHaveLength(0)
  })

  it('returns chapter-restricted trigger only for matching chapter', () => {
    const curhat = FLASHBACK_TRIGGERS.find((t) => t.flashbackId === 'fb_curhat')
    if (!curhat?.chapter) return // skip if not chapter-restricted

    const inChapter = getAvailableFlashbacks(curhat.location, curhat.chapter)
    const wrongChapter = getAvailableFlashbacks(curhat.location, 'acceptance')

    expect(inChapter.some((t) => t.flashbackId === 'fb_curhat')).toBe(true)
    expect(wrongChapter.some((t) => t.flashbackId === 'fb_curhat')).toBe(false)
  })

  it('returns all triggers for location when chapter is undefined', () => {
    const rooftopAll = getAvailableFlashbacks('rooftop')
    // fb_snack has no chapter restriction, fb_curhat has chapter: 'denial'
    const snack = rooftopAll.find((t) => t.flashbackId === 'fb_snack')
    expect(snack).toBeDefined()
  })
})

describe('unlockFlashback / isUnlocked', () => {
  it('starts locked', () => {
    expect(isUnlocked('fb_telponan')).toBe(false)
  })

  it('unlocks a flashback', () => {
    unlockFlashback('fb_telponan')
    expect(isUnlocked('fb_telponan')).toBe(true)
  })

  it('does not unlock other flashbacks', () => {
    unlockFlashback('fb_telponan')
    expect(isUnlocked('fb_makan')).toBe(false)
  })

  it('unlocking twice does not duplicate', () => {
    unlockFlashback('fb_bola')
    unlockFlashback('fb_bola')
    expect(useInventoryStore.getState().flashbackUnlocked.filter((f) => f === 'fb_bola')).toHaveLength(1)
  })

  it('can unlock all 7 flashbacks', () => {
    const all = ['fb_telponan','fb_makan','fb_ngeprank','fb_bola','fb_main','fb_snack','fb_curhat'] as const
    for (const id of all) unlockFlashback(id)
    for (const id of all) expect(isUnlocked(id)).toBe(true)
  })
})
