import { describe, it, expect, beforeEach } from 'vitest'
import { getTriggersForLocation, consumeTrigger, getTriggerById } from '../triggerManager'
import { ALL_TRIGGERS } from '../triggerData'
import { useInventoryStore } from '@stores/inventoryStore'

beforeEach(() => {
  useInventoryStore.setState({ flashbackUnlocked: [], actionHistory: [], inventory: [] })
})

describe('ALL_TRIGGERS data integrity', () => {
  it('all triggers have an id, location, label, position, and action', () => {
    for (const t of ALL_TRIGGERS) {
      expect(t.id).toBeTruthy()
      expect(t.location).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.position.x).toBeGreaterThanOrEqual(0)
      expect(t.position.y).toBeGreaterThanOrEqual(0)
      expect(t.action.type).toMatch(/^(flashback|dialogue|mission)$/)
    }
  })

  it('trigger IDs are unique', () => {
    const ids = ALL_TRIGGERS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getTriggersForLocation', () => {
  it('returns only triggers for the requested location', () => {
    const result = getTriggersForLocation('kamar', 'prologue')
    expect(result.every((t) => t.location === 'kamar')).toBe(true)
  })

  it('returns empty array for location with no triggers', () => {
    const result = getTriggersForLocation('kelas', 'prologue')
    expect(result).toHaveLength(0)
  })

  it('filters out one-time triggers that have been used', () => {
    const onetime = ALL_TRIGGERS.find((t) => t.oneTime)
    if (!onetime) return // no one-time triggers defined

    useInventoryStore.getState().addToHistory(onetime.id)
    const result = getTriggersForLocation(onetime.location, 'prologue')
    expect(result.find((t) => t.id === onetime.id)).toBeUndefined()
  })

  it('keeps repeatable triggers even after use', () => {
    const repeatable = ALL_TRIGGERS.find((t) => !t.oneTime)
    if (!repeatable) return

    useInventoryStore.getState().addToHistory(repeatable.id)
    const result = getTriggersForLocation(repeatable.location, 'prologue')
    expect(result.find((t) => t.id === repeatable.id)).toBeDefined()
  })
})

describe('consumeTrigger', () => {
  it('marks a one-time trigger as used', () => {
    const onetime = ALL_TRIGGERS.find((t) => t.oneTime)
    if (!onetime) return

    consumeTrigger(onetime.id)
    expect(useInventoryStore.getState().actionHistory).toContain(onetime.id)
  })

  it('does not mark repeatable triggers as used', () => {
    const repeatable = ALL_TRIGGERS.find((t) => !t.oneTime)
    if (!repeatable) return

    consumeTrigger(repeatable.id)
    expect(useInventoryStore.getState().actionHistory).not.toContain(repeatable.id)
  })

  it('is idempotent', () => {
    const onetime = ALL_TRIGGERS.find((t) => t.oneTime)
    if (!onetime) return

    consumeTrigger(onetime.id)
    consumeTrigger(onetime.id)
    const history = useInventoryStore.getState().actionHistory
    expect(history.filter((id) => id === onetime.id)).toHaveLength(1)
  })
})

describe('getTriggerById', () => {
  it('returns trigger by ID', () => {
    const first = ALL_TRIGGERS[0]
    expect(getTriggerById(first!.id)).toStrictEqual(first)
  })

  it('returns undefined for unknown ID', () => {
    expect(getTriggerById('not_real')).toBeUndefined()
  })
})

describe('flashback action triggers', () => {
  it('rooftop trigger has a flashback action', () => {
    const rooftop = getTriggersForLocation('rooftop', 'prologue')
    expect(rooftop.some((t) => t.action.type === 'flashback')).toBe(true)
  })

  it('flashback trigger references a valid FlashbackId', () => {
    const VALID_IDS = [
      'fb_telponan',
      'fb_makan',
      'fb_ngeprank',
      'fb_bola',
      'fb_main',
      'fb_snack',
      'fb_curhat',
    ]
    const flashbackTriggers = ALL_TRIGGERS.filter((t) => t.action.type === 'flashback')
    for (const t of flashbackTriggers) {
      if (t.action.type === 'flashback') {
        expect(VALID_IDS).toContain(t.action.flashbackId)
      }
    }
  })
})
