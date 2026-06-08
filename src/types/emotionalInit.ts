/**
 * stores/emotionalStore — initState patch (Fase 6)
 *
 * PrologueScene memanggil initState() untuk reset variabel emosional
 * ke nilai awal yang didefinisikan di DEVELOPMENT_PLAN Fase 6:
 *   distress: 20, hope: 80, denial: 0, rumination: "reflection"
 *
 * Jika emotionalStore dari Fase 1 belum punya action initState,
 * tambahkan slice berikut:
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Di dalam create<EmotionalStore>()(...) di emotionalStore.ts:
 *
 *   initState: (partial) => set({
 *     distress:                  partial.distress                 ?? 50,
 *     hope:                      partial.hope                     ?? 50,
 *     denial:                    partial.denial                   ?? 0,
 *     rumination:                partial.rumination               ?? 'reflection',
 *     avoidance_count:           partial.avoidance_count          ?? 0,
 *     internalized_anger_count:  partial.internalized_anger_count ?? 0,
 *     aggressive_choice_count:   partial.aggressive_choice_count  ?? 0,
 *     consecutive_hard_denial:   partial.consecutive_hard_denial  ?? 0,
 *   }),
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TypeScript interface tambahan di types/emotional.ts (jika belum ada):
 */

export interface EmotionalInitState {
  distress?:                  number;
  hope?:                      number;
  denial?:                    number;
  rumination?:                'brooding' | 'reflection';
  avoidance_count?:           number;
  internalized_anger_count?:  number;
  aggressive_choice_count?:   number;
  consecutive_hard_denial?:   number;
}

/**
 * Nilai inisialisasi resmi untuk Prologue sesuai DEVELOPMENT_PLAN Fase 6.
 * Diekspor untuk digunakan di PrologueScene dan unit tests.
 */
export const PROLOGUE_EMOTIONAL_INIT: Required<EmotionalInitState> = {
  distress:                  20,
  hope:                      80,
  denial:                    0,
  rumination:                'reflection',
  avoidance_count:           0,
  internalized_anger_count:  0,
  aggressive_choice_count:   0,
  consecutive_hard_denial:   0,
};
