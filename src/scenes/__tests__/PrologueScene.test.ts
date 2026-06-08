/**
 * scenes/Prologue/__tests__/PrologueScene.test.ts
 *
 * Vitest unit tests untuk Fase 6 — Prologue.
 * Coverage:
 *   - Inisialisasi variabel emosional (nilai sesuai DEVELOPMENT_PLAN)
 *   - Integritas script dialogue (semua 10 step ada entry points)
 *   - Konfigurasi mini-game (target count, time limits, step counts)
 *   - Evening reflection (semua pertanyaan punya 3 pilihan)
 *   - Prologue tidak memiliki fail state (game always continues)
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { PROLOGUE_EMOTIONAL_INIT } from '@/types/emotionalInit';
import {
  prologueMapPuzzleConfig,
  prologueCactusHuntConfig,
  prologueWaterCactusConfig,
} from '@/data/missions/prologue_minigames';

import prologueTamanScript       from '@/data/dialogues/prologue/prologue_step1_taman.json';
import prologuePasarScript       from '@/data/dialogues/prologue/prologue_step3_pasar.json';
import prologuePilihScript       from '@/data/dialogues/prologue/prologue_step5_pilih_kaktus.json';
import prologueKamarScript       from '@/data/dialogues/prologue/prologue_step6_kamar.json';
import prologueRooftopScript     from '@/data/dialogues/prologue/prologue_step9_rooftop.json';
import prologueEveningReflection from '@/data/dialogues/prologue/prologue_evening_reflection.json';
import prologueChats             from '@/data/chats/prologue/chats_prologue.json';
import prologueNotes             from '@/data/notes/prologue/notes_prologue.json';

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Emotional Variable Initialization', () => {
  it('distress dimulai pada 20 (awal ada kerinduan kecil)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.distress).toBe(20);
  });

  it('hope dimulai pada 80 (pemain masih optimis)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.hope).toBe(80);
  });

  it('denial dimulai pada 0 (belum ada yang diingkari)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.denial).toBe(0);
  });

  it('rumination dimulai sebagai "reflection" (bukan brooding)', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.rumination).toBe('reflection');
  });

  it('semua counter dimulai pada 0', () => {
    expect(PROLOGUE_EMOTIONAL_INIT.avoidance_count).toBe(0);
    expect(PROLOGUE_EMOTIONAL_INIT.internalized_anger_count).toBe(0);
    expect(PROLOGUE_EMOTIONAL_INIT.aggressive_choice_count).toBe(0);
    expect(PROLOGUE_EMOTIONAL_INIT.consecutive_hard_denial).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Dialogue Script Integrity', () => {
  it('step 1 (Taman): punya entries dan berakhir dengan MINIGAME trigger', () => {
    expect(prologueTamanScript.entries.length).toBeGreaterThan(0);
    const lastEntry = prologueTamanScript.entries.at(-1)!;
    expect(lastEntry.next).toMatch(/^MINIGAME:/);
  });

  it('step 3 (Pasar): berlokasi di pasar_bunga dan berakhir dengan MINIGAME trigger', () => {
    expect(prologuePasarScript.location).toBe('pasar_bunga');
    const lastEntry = prologuePasarScript.entries.at(-1)!;
    expect(lastEntry.next).toMatch(/^MINIGAME:/);
  });

  it('step 5 (Pilih Kaktus): berakhir dengan SCENE:kamar', () => {
    const lastEntry = prologuePilihScript.entries.at(-1)!;
    expect(lastEntry.next).toBe('SCENE:kamar');
  });

  it('step 6 (Kamar): ada entry dengan visualEffect timelapse_fade', () => {
    const timelapseEntry = prologueKamarScript.entries.find(
      e => e.visualEffect === 'timelapse_fade'
    );
    expect(timelapseEntry).toBeDefined();
  });

  it('step 6 (Kamar): ada chat bubble dari Dia mengajak ke rooftop', () => {
    const diaChatEntry = prologueKamarScript.entries.find(
      e => e.speaker === 'Dia' && e.displayMode === 'chat_bubble'
    );
    expect(diaChatEntry).toBeDefined();
    expect(diaChatEntry!.text).toContain('rooftop');
  });

  it('step 9 (Rooftop): ada line konfesi MC tentang kepercayaan kepada Dia', () => {
    const confessionEntry = prologueRooftopScript.entries.find(
      e => e.speaker === 'MC' && e.text.includes('percaya')
    );
    expect(confessionEntry).toBeDefined();
  });

  it('step 9 (Rooftop): ada line kaktus analogi dari MC (sesuai NDD)', () => {
    const kaktusLine = prologueRooftopScript.entries.find(
      e => e.speaker === 'MC' && e.text.includes('kaktus')
    );
    expect(kaktusLine).toBeDefined();
    expect(kaktusLine!.text).toContain('abadi');
  });

  it('step 9 (Rooftop): berakhir dengan TITLE_SCREEN trigger', () => {
    const titleEntry = prologueRooftopScript.entries.find(
      e => e.next === 'TITLE_SCREEN'
    );
    expect(titleEntry).toBeDefined();
  });

  it('semua script punya field id dan entries/questions yang valid', () => {
    const scripts = [
      prologueTamanScript,
      prologuePasarScript,
      prologuePilihScript,
      prologueKamarScript,
      prologueRooftopScript,
    ];
    for (const script of scripts) {
      expect(script.id).toBeTruthy();
      expect(Array.isArray(script.entries)).toBe(true);
      expect(script.entries.length).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Mini-Game Configurations', () => {
  describe('Slider Puzzle (Rute Peta)', () => {
    it('grid adalah 5×5 array', () => {
      expect(prologueMapPuzzleConfig.grid.length).toBe(5);
      expect(prologueMapPuzzleConfig.grid[0].length).toBe(5);
    });

    it('start dan goal di posisi sudut (pojok ke pojok)', () => {
      expect(prologueMapPuzzleConfig.startRow).toBe(0);
      expect(prologueMapPuzzleConfig.startCol).toBe(0);
      expect(prologueMapPuzzleConfig.goalRow).toBe(4);
      expect(prologueMapPuzzleConfig.goalCol).toBe(4);
    });

    it('time limit >= 60 detik (prologue santai)', () => {
      expect(prologueMapPuzzleConfig.timeLimit).toBeGreaterThanOrEqual(60);
    });

    it('ada label Start dan Goal', () => {
      expect(prologueMapPuzzleConfig.labelStart).toBeTruthy();
      expect(prologueMapPuzzleConfig.labelGoal).toBeTruthy();
    });
  });

  describe('Hidden Object (Cari Kaktus)', () => {
    it('ada tepat 10 target kaktus', () => {
      expect(prologueCactusHuntConfig.targets.length).toBe(10);
    });

    it('semua target punya koordinat dalam range 0–100%', () => {
      for (const target of prologueCactusHuntConfig.targets) {
        expect(target.x).toBeGreaterThanOrEqual(0);
        expect(target.x).toBeLessThanOrEqual(100);
        expect(target.y).toBeGreaterThanOrEqual(0);
        expect(target.y).toBeLessThanOrEqual(100);
      }
    });

    it('requiredCount sama dengan jumlah targets', () => {
      expect(prologueCactusHuntConfig.requiredCount).toBe(
        prologueCactusHuntConfig.targets.length
      );
    });

    it('failAction adalah "continue" (prolog tidak ada fail state)', () => {
      expect(prologueCactusHuntConfig.failAction).toBe('continue');
    });

    it('semua target id unik', () => {
      const ids = prologueCactusHuntConfig.targets.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Planting Game (Siram Kaktus)', () => {
    it('ada 3 langkah sequential', () => {
      expect(prologueWaterCactusConfig.steps.length).toBe(3);
    });

    it('setiap langkah punya id, instruction, dan targetId', () => {
      for (const step of prologueWaterCactusConfig.steps) {
        expect(step.id).toBeTruthy();
        expect(step.instruction).toBeTruthy();
        expect(step.targetId).toBeTruthy();
      }
    });

    it('semua step id unik', () => {
      const ids = prologueWaterCactusConfig.steps.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Evening Reflection', () => {
  it('ada 5 pertanyaan malam hari', () => {
    expect(prologueEveningReflection.questions.length).toBe(5);
  });

  it('setiap pertanyaan punya tepat 3 pilihan', () => {
    for (const q of prologueEveningReflection.questions) {
      expect(q.choices.length).toBe(3);
    }
  });

  it('setiap pilihan punya weights yang valid', () => {
    for (const q of prologueEveningReflection.questions) {
      for (const choice of q.choices) {
        expect(typeof choice.weights.distress).toBe('number');
        expect(typeof choice.weights.hope).toBe('number');
        expect(typeof choice.weights.denial).toBe('number');
        expect(['brooding', 'reflection']).toContain(choice.weights.rumination);
      }
    }
  });

  it('ada setidaknya satu pilihan hope positif per pertanyaan', () => {
    for (const q of prologueEveningReflection.questions) {
      const hasPositiveHope = q.choices.some(c => c.weights.hope > 0);
      expect(hasPositiveHope).toBe(true);
    }
  });

  it('ada setidaknya satu pilihan high distress per pertanyaan', () => {
    for (const q of prologueEveningReflection.questions) {
      const hasHighDistress = q.choices.some(c => c.weights.distress >= 10);
      expect(hasHighDistress).toBe(true);
    }
  });

  it('ada closing message untuk kondisi default, high distress, dan high hope', () => {
    expect(prologueEveningReflection.closing.default).toBeTruthy();
    expect(prologueEveningReflection.closing.ifHighDistress).toBeTruthy();
    expect(prologueEveningReflection.closing.ifHighHope).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Prologue — Chat & Notes Data', () => {
  it('ada 2 thread chat prologue', () => {
    expect(prologueChats.length).toBe(2);
  });

  it('thread pertama berisi percakapan janjian beli kaktus', () => {
    const firstThread = prologueChats[0];
    const hasKaktusChat = firstThread.messages.some(m =>
      m.text.toLowerCase().includes('kaktus')
    );
    expect(hasKaktusChat).toBe(true);
  });

  it('thread kedua berisi chat janjian rooftop', () => {
    const rooftopThread = prologueChats[1];
    const hasRooftopChat = rooftopThread.messages.some(m =>
      m.text.toLowerCase().includes('rooftop')
    );
    expect(hasRooftopChat).toBe(true);
  });

  it('ada 2 catatan journal prologue', () => {
    expect(prologueNotes.length).toBe(2);
  });

  it('setiap catatan punya id, title, dan content', () => {
    for (const note of prologueNotes) {
      expect(note.id).toBeTruthy();
      expect(note.title).toBeTruthy();
      expect(note.content.length).toBeGreaterThan(0);
    }
  });
});
