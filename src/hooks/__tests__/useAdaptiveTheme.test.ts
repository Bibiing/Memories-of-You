import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useAdaptiveTheme } from '../useAdaptiveTheme'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { applyTheme, CHAPTER_THEMES } from '@utils/color'

import type * as ColorModule from '@utils/color'

vi.mock('@utils/color', async () => {
  const actual = await vi.importActual<typeof ColorModule>('@utils/color')
  return {
    ...actual,
    applyTheme: vi.fn(),
  }
})

const mockApplyTheme = applyTheme as ReturnType<typeof vi.fn>

describe('useAdaptiveTheme', () => {
  beforeEach(() => {
    mockApplyTheme.mockClear()
    useGameStateStore.setState({ currentChapter: 'prologue' })
    useEmotionalStore.setState({ distress: 20 })
  })

  it('calls applyTheme on mount with initial chapter and distress', () => {
    renderHook(() => { useAdaptiveTheme() })
    expect(mockApplyTheme).toHaveBeenCalledOnce()
    expect(mockApplyTheme).toHaveBeenCalledWith(CHAPTER_THEMES.prologue, 20)
  })

  it('re-applies theme when chapter changes', () => {
    renderHook(() => { useAdaptiveTheme() })
    act(() => {
      useGameStateStore.getState().setChapter('anger')
    })
    expect(mockApplyTheme).toHaveBeenCalledWith(CHAPTER_THEMES.anger, expect.any(Number))
  })

  it('re-applies theme when distress changes', () => {
    renderHook(() => { useAdaptiveTheme() })
    act(() => {
      useEmotionalStore.getState().setDistress(80)
    })
    expect(mockApplyTheme).toHaveBeenCalledWith(expect.any(Object), 80)
  })

  it('applies all 7 chapter themes without throwing', () => {
    const chapters = [
      'prologue', 'denial', 'anger', 'bargaining', 'depression', 'acceptance', 'epilogue',
    ] as const
    renderHook(() => { useAdaptiveTheme() })
    for (const chapter of chapters) {
      act(() => { useGameStateStore.getState().setChapter(chapter) })
    }
    expect(mockApplyTheme).not.toThrow()
  })
})
