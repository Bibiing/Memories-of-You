import type { Chapter, CactusState } from '@/types/game'
import { CHAPTER_CACTUS_STATE } from '@/types/game'

import healthyUrl from '@assets/cactus/healthy.svg?url'
import sickUrl from '@assets/cactus/sick.svg?url'
import verySickUrl from '@assets/cactus/very-sick.svg?url'
import deadTryingUrl from '@assets/cactus/dead-trying.svg?url'
import deadUrl from '@assets/cactus/dead.svg?url'
import emptyPotUrl from '@assets/cactus/empty-pot.svg?url'
import sproutingUrl from '@assets/cactus/sprouting.svg?url'

const CACTUS_URLS: Record<CactusState, string> = {
  healthy: healthyUrl,
  sick: sickUrl,
  'very-sick': verySickUrl,
  'dead-trying': deadTryingUrl,
  dead: deadUrl,
  'empty-pot': emptyPotUrl,
  sprouting: sproutingUrl,
}

const CACTUS_ANIM: Record<CactusState, string> = {
  healthy: 'cactus-anim-sway',
  sick: 'cactus-anim-wilt',
  'very-sick': 'cactus-anim-wilt',
  'dead-trying': 'cactus-anim-wilt',
  dead: '',
  'empty-pot': '',
  sprouting: 'cactus-anim-sway',
}

interface Props {
  chapter: Chapter
}

export function CactusRenderer({ chapter }: Props) {
  const state = CHAPTER_CACTUS_STATE[chapter]
  const url = CACTUS_URLS[state]
  const animClass = CACTUS_ANIM[state]

  return (
    <div className={`cactus-container ${animClass}`}>
      <img
        key={state}
        src={url}
        alt={`Kaktus: ${state}`}
        className="cactus-img"
        draggable={false}
      />
    </div>
  )
}
