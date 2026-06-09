import { useAdaptiveTheme } from '@/hooks/useAdaptiveTheme'
import { useChapterBGM } from '@/hooks/useChapterBGM'
import { SceneManager } from '@components/scenes/SceneManager'
import { DebugPanel } from '@components/debug/DebugPanel'
import { GrayscaleFilter } from '@components/effects/GrayscaleFilter'
import '@/styles/global.css'

export default function App() {
  useAdaptiveTheme()
  useChapterBGM()

  return (
    <div className="game-viewport">
      <GrayscaleFilter>
        <SceneManager />
      </GrayscaleFilter>
      <DebugPanel />
    </div>
  )
}
