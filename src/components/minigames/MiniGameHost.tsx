import { BreathingRhythm } from './BreathingRhythm'
import { DragDropScheduler } from './DragDropScheduler'
import { FindTheDifference } from './FindTheDifference'
import { HiddenObject } from './HiddenObject'
import { HoldToDelete } from './HoldToDelete'
import { PlantingGame } from './PlantingGame'
import { QuickTimeEvent } from './QuickTimeEvent'
import { RoomDecoration } from './RoomDecoration'
import { SliderPuzzle } from './SliderPuzzle'
import { StruggleButton } from './StruggleButton'
import { WordPuzzle } from './WordPuzzle'
import type { MiniGameResult, MiniGameType } from '@/types/minigame'

interface MiniGameHostProps {
  type: MiniGameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
  onComplete: (result: MiniGameResult) => void
  onAbandon: () => void
}

export function MiniGameHost({ type, config, onComplete, onAbandon }: MiniGameHostProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const shared = { config, onComplete, onAbandon }
  switch (type) {
    case 'breathing-rhythm':     return <BreathingRhythm {...shared} />
    case 'drag-drop-scheduler':  return <DragDropScheduler {...shared} />
    case 'find-the-difference':  return <FindTheDifference {...shared} />
    case 'hidden-object':        return <HiddenObject {...shared} />
    case 'hold-to-delete':       return <HoldToDelete {...shared} />
    case 'planting-game':        return <PlantingGame {...shared} />
    case 'quick-time-event':     return <QuickTimeEvent {...shared} />
    case 'room-decoration':      return <RoomDecoration {...shared} />
    case 'slider-puzzle':        return <SliderPuzzle {...shared} />
    case 'struggle-button':      return <StruggleButton {...shared} />
    case 'word-puzzle':          return <WordPuzzle {...shared} />
  }
}
