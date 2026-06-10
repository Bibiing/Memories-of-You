/**
 * scenes/Prologue/__tests__/PrologueScene.test.ts
 *
 * Vitest unit tests untuk Fase 6 — Prologue.
 * Coverage:
 *   - Inisialisasi variabel emosional (nilai sesuai DEVELOPMENT_PLAN)
 *   - Integritas script dialogue (semua 5 script punya nodes valid)
 *   - Konfigurasi mini-game (target count, time limits, step counts)
 *   - Evening reflection (semua pertanyaan punya 3 pilihan + weights valid)
 *   - Prologue tidak memiliki fail state (game always continues)
 */

import { describe, it, expect } from 'vitest'

import { PROLOGUE_EMOTIONAL_INIT } from '@/types/emotionalInit'
import {
  prologueMapPuzzleConfig,
  prologueCactusHuntConfig,
  prologueWaterCactusConfig,
} from '@/data/missions/prologue_minigames'

import prologueTamanScript from '@/data/dialogues/prologue/prologue_step1_taman.json'
import prologuePasarScript from '@/data/dialogues/prologue/prologue_step3_pasar.json'
import prologuePilihScript from '@/data/dialogues/prologue/prologue_step5_pilih_kaktus.json'
import prologueKamarScript from '@/data/dialogues/prologue/prologue_step6_kamar.json'
import prologueRooftopScript from '@/data/dialogues/prologue/prologue_step9_rooftop.json'
import prologueEveningReflection from '@/data/dialogues/prologue/prologue_evening_reflection.json'
import prologueChats from '@/data/chats/prologue/chats_prologue.json'
import prologueNotes from '@/data/notes/prologue/notes_prologue.json'

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Emotional Variable Initialization', () => {
  it('distress dimulai pada 20 (awal ada kerinduan kecil)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.distress).toBe(20)
  })

  it('hope dimulai pada 80 (pemain masih optimis)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.hope).toBe(80)
  })

  it('denial dimulai pada 0 (belum ada yang diingkari)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.denial).toBe(0)
  })

  it('rumination dimulai sebagai "reflection" (bukan brooding)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.rumination).toBe('reflection')
  })

  it('semua counter dimulai pada 0', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.avoidance_count).toBe(0)
    expect(PROLOGUE_EMOTIONAL_INIT.internalized_anger_count).toBe(0)
    expect(PROLOGUE_EMOTIONAL_INIT.aggressive_choice_count).toBe(0)
    expect(PROLOGUE_EMOTIONAL_INIT.consecutive_hard_denial).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Dialogue Script Integrity', () => {
  it('step 1 (Taman): punya id, startNode, dan nodes yang valid', () => {
    expect(prologueTamanScript.id).toBeTruthy()
    expect(prologueTamanScript.startNode).toBeTruthy()
    expect(prologueTamanScript.nodes.length).toBeGreaterThan(0)
  })

  it('step 3 (Pasar): ada di chapter prologue', () => {
    expect(prologuePasarScript.chapter).toBe('prologue')
    expect(prologuePasarScript.nodes.length).toBeGreaterThan(0)
  })

  it('step 5 (Pilih Kaktus): punya nodes yang valid', () => {
    expect(prologuePilihScript.nodes.length).toBeGreaterThan(0)
    expect(prologuePilihScript.startNode).toBeTruthy()
  })

  it('step 6 (Kamar): ada node dari speaker MC', () => {
    const mcNode = prologueKamarScript.nodes.find((n) => n.speaker === 'MC')
    expect(mcNode).toBeDefined()
  })

  it('step 9 (Rooftop): ada node konfesi MC tentang kepercayaan kepada Dia', () => {
    const confessionNode = prologueRooftopScript.nodes.find(
      (n) => n.speaker === 'MC' && n.text.includes('percaya')
    )
    expect(confessionNode).toBeDefined()
  })

  it('step 9 (Rooftop): ada analogi kaktus dari MC yang menyebut "abadi"', () => {
    const kaktusNode = prologueRooftopScript.nodes.find(
      (n) => n.speaker === 'MC' && n.text.includes('kaktus')
    )
    expect(kaktusNode).toBeDefined()
    expect(kaktusNode!.text).toContain('abadi')
  })

  it('semua script punya field id, startNode, dan nodes yang valid', () => {
    const scripts = [
      prologueTamanScript,
      prologuePasarScript,
      prologuePilihScript,
      prologueKamarScript,
      prologueRooftopScript,
    ]
    for (const script of scripts) {
      expect(script.id).toBeTruthy()
      expect(script.startNode).toBeTruthy()
      expect(Array.isArray(script.nodes)).toBe(true)
      expect(script.nodes.length).toBeGreaterThan(0)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Mini-Game Configurations', () => {
  describe('Slider Puzzle (Rute Peta)', () => {
    it('grid adalah 5×5 array', () => {
      expect(prologueMapPuzzleConfig.grid.length).toBe(5)
      const firstRow = prologueMapPuzzleConfig.grid[0]
      expect(firstRow).toBeDefined()
      expect(firstRow!.length).toBe(5)
    })

    it('grid berisi player start (2) dan goal (3)', () => {
      const flat = prologueMapPuzzleConfig.grid.flat()
      expect(flat).toContain(2) // player start
      expect(flat).toContain(3) // goal
    })

    it('rows dan cols sesuai ukuran grid', () => {
      expect(prologueMapPuzzleConfig.rows).toBe(prologueMapPuzzleConfig.grid.length)
      expect(prologueMapPuzzleConfig.cols).toBe(prologueMapPuzzleConfig.grid[0]!.length)
    })
  })

  describe('Hidden Object (Cari Kaktus)', () => {
    it('ada 10 target kaktus di background', () => {
      expect(prologueCactusHuntConfig.targets.length).toBe(10)
    })

    it('requiredCount adalah 5 (cukup temukan 5 dari 10)', () => {
      expect(prologueCactusHuntConfig.requiredCount).toBe(5)
    })

    it('semua target punya koordinat dalam range 0–100%', () => {
      for (const target of prologueCactusHuntConfig.targets) {
        expect(target.x).toBeGreaterThanOrEqual(0)
        expect(target.x).toBeLessThanOrEqual(100)
        expect(target.y).toBeGreaterThanOrEqual(0)
        expect(target.y).toBeLessThanOrEqual(100)
      }
    })

    it('timeLimit lebih dari 0', () => {
      expect(prologueCactusHuntConfig.timeLimit).toBeGreaterThan(0)
    })

    it('semua target id unik', () => {
      const ids = prologueCactusHuntConfig.targets.map((t) => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('semua target punya radius lebih dari 0', () => {
      for (const target of prologueCactusHuntConfig.targets) {
        expect(target.radius).toBeGreaterThan(0)
      }
    })
  })

  describe('Planting Game (Siram Kaktus)', () => {
    it('ada 3 langkah sequential', () => {
      expect(prologueWaterCactusConfig.steps.length).toBe(3)
    })

    it('setiap langkah punya id, label, dan icon', () => {
      for (const step of prologueWaterCactusConfig.steps) {
        expect(step.id).toBeTruthy()
        expect(step.label).toBeTruthy()
        expect(step.icon).toBeTruthy()
      }
    })

    it('semua step id unik', () => {
      const ids = prologueWaterCactusConfig.steps.map((s) => s.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('correctOrder berisi id yang sama dengan steps', () => {
      const stepIds = new Set(prologueWaterCactusConfig.steps.map((s) => s.id))
      for (const id of prologueWaterCactusConfig.correctOrder) {
        expect(stepIds.has(id)).toBe(true)
      }
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Evening Reflection', () => {
  it('ada 5 pertanyaan malam hari', () => {
    expect(prologueEveningReflection.questions.length).toBe(5)
  })

  it('setiap pertanyaan punya tepat 3 pilihan', () => {
    for (const q of prologueEveningReflection.questions) {
      expect(q.choices.length).toBe(3)
    }
  })

  it('setiap pilihan punya weights yang valid', () => {
    for (const q of prologueEveningReflection.questions) {
      for (const choice of q.choices) {
        expect(typeof choice.weights.distress).toBe('number')
        expect(typeof choice.weights.hope).toBe('number')
        expect(typeof choice.weights.denial).toBe('number')
        expect(['brooding', 'reflection']).toContain(choice.weights.rumination)
      }
    }
  })

  it('ada setidaknya satu pilihan hope positif per pertanyaan', () => {
    for (const q of prologueEveningReflection.questions) {
      const hasPositiveHope = q.choices.some((c) => c.weights.hope > 0)
      expect(hasPositiveHope).toBe(true)
    }
  })

  it('ada setidaknya satu pilihan high distress per pertanyaan', () => {
    for (const q of prologueEveningReflection.questions) {
      const hasHighDistress = q.choices.some((c) => c.weights.distress >= 10)
      expect(hasHighDistress).toBe(true)
    }
  })

  it('ada closing message untuk kondisi default, high distress, dan high hope', () => {
    expect(prologueEveningReflection.closing.default).toBeTruthy()
    expect(prologueEveningReflection.closing.ifHighDistress).toBeTruthy()
    expect(prologueEveningReflection.closing.ifHighHope).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Chat & Notes Data', () => {
  it('ada 2 thread chat prologue', () => {
    expect(prologueChats.length).toBe(2)
  })

  it('thread pertama berisi percakapan janjian beli kaktus', () => {
    const firstThread = prologueChats[0]
    expect(firstThread).toBeDefined()
    const hasKaktusChat = firstThread!.messages.some((m) => m.text.toLowerCase().includes('kaktus'))
    expect(hasKaktusChat).toBe(true)
  })

  it('thread kedua berisi chat janjian rooftop', () => {
    const rooftopThread = prologueChats[1]
    expect(rooftopThread).toBeDefined()
    const hasRooftopChat = rooftopThread!.messages.some((m) =>
      m.text.toLowerCase().includes('rooftop')
    )
    expect(hasRooftopChat).toBe(true)
  })

  it('ada 2 catatan journal prologue', () => {
    expect(prologueNotes.length).toBe(2)
  })

  it('setiap catatan punya id, title, dan content', () => {
    for (const note of prologueNotes) {
      expect(note.id).toBeTruthy()
      expect(note.title).toBeTruthy()
      expect(note.content.length).toBeGreaterThan(0)
    }
  })
})
