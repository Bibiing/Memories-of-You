import { useEffect } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { CHAPTER_THEMES, applyTheme } from '@utils/color'

export function useAdaptiveTheme(): void {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const distress = useEmotionalStore((s) => s.distress)

  useEffect(() => {
    applyTheme(CHAPTER_THEMES[chapter], distress)
  }, [chapter, distress])
}
