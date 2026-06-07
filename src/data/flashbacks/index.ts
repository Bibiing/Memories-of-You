import type { DialogueScript } from '@/types/dialogue'
import type { FlashbackId } from '@/types/game'

import fbTelponanData from './fb_telponan.json'
import fbMakanData from './fb_makan.json'
import fbNgeprankData from './fb_ngeprank.json'
import fbBolaData from './fb_bola.json'
import fbMainData from './fb_main.json'
import fbSnackData from './fb_snack.json'
import fbCurhatData from './fb_curhat.json'

export interface FlashbackScriptMeta {
  id: FlashbackId
  title: string
  script: DialogueScript
}

export const FLASHBACK_SCRIPTS: Record<FlashbackId, FlashbackScriptMeta> = {
  fb_telponan: { id: 'fb_telponan', title: 'Pukul Satu Dini Hari', script: fbTelponanData as DialogueScript },
  fb_makan: { id: 'fb_makan', title: 'Satu Porsi Berdua', script: fbMakanData as DialogueScript },
  fb_ngeprank: { id: 'fb_ngeprank', title: 'Operasi Lembar Jawaban', script: fbNgeprankData as DialogueScript },
  fb_bola: { id: 'fb_bola', title: 'Gol Bunuh Diri', script: fbBolaData as DialogueScript },
  fb_main: { id: 'fb_main', title: 'Boneka dari Claw Machine', script: fbMainData as DialogueScript },
  fb_snack: { id: 'fb_snack', title: 'Langit Malam dan Chiki', script: fbSnackData as DialogueScript },
  fb_curhat: { id: 'fb_curhat', title: 'Tentang Ketakutan Kita', script: fbCurhatData as DialogueScript },
}

export function getFlashbackMeta(id: FlashbackId): FlashbackScriptMeta {
  return FLASHBACK_SCRIPTS[id]
}
