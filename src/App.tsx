import { useEffect } from 'react'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'
import { CHAPTER_THEMES, applyTheme } from '@utils/color'
import '@/styles/global.css'

function MainMenuPlaceholder() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '1.5rem',
      }}
    >
      <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--color-primary)', fontSize: '3rem' }}>
        Memories of You
      </h1>
      <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>Phase 0 — Architecture Setup ✓</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          color: 'var(--color-accent)',
          fontSize: '0.875rem',
        }}
      >
        <span>✓ Zustand stores (emotional / game state / inventory)</span>
        <span>✓ Adaptive theme system (CSS variables)</span>
        <span>✓ Save system (Dexie + AES-GCM + SHA-256)</span>
        <span>✓ Expert System engine + rule base skeleton</span>
        <span>✓ Folder structure per TDD</span>
        <span>✓ Path aliases configured</span>
        <span>✓ PWA manifest configured</span>
      </div>
    </div>
  )
}

export default function App() {
  const chapter = useGameStateStore((s) => s.currentChapter)
  const distress = useEmotionalStore((s) => s.distress)

  useEffect(() => {
    const theme = CHAPTER_THEMES[chapter]
    applyTheme(theme, distress)
  }, [chapter, distress])

  return (
    <div className="game-viewport distress-filter">
      <MainMenuPlaceholder />
    </div>
  )
}
