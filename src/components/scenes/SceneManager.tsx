import { useEffect, useRef, useState } from 'react'
import type { GameScene } from '@/types/game'
import { useGameStateStore } from '@stores/gameStateStore'
import { SceneBackground } from './SceneBackground'
import { CactusRenderer } from '@components/cactus/CactusRenderer'

function MainMenuView() {
  const chapter = useGameStateStore((s) => s.currentChapter)
  return (
    <div className="scene-content scene-content--centered">
      <h1 className="title-game">Memories of You</h1>
      <p className="scene-subtitle">Chapter: {chapter}</p>
      <div className="phase-checklist">
        <span>✓ Phase 0 — Core Architecture</span>
        <span>✓ Phase 1 — Systems &amp; Data</span>
        <span>✓ Phase 2 — Visual Engine</span>
      </div>
    </div>
  )
}

function GameplayView() {
  return (
    <div className="scene-content scene-content--gameplay">
      <p style={{ color: 'var(--color-text)', opacity: 0.6, fontSize: '0.875rem' }}>
        Gameplay — Phase 3
      </p>
    </div>
  )
}

function GenericView({ scene }: { scene: GameScene }) {
  return (
    <div className="scene-content scene-content--centered">
      <p style={{ color: 'var(--color-text)', opacity: 0.5, fontFamily: 'monospace' }}>
        Scene: {scene}
      </p>
    </div>
  )
}

function resolveView(scene: GameScene) {
  switch (scene) {
    case 'main-menu':
      return <MainMenuView />
    case 'gameplay':
      return <GameplayView />
    default:
      return <GenericView scene={scene} />
  }
}

// Fade-dissolve transition: when `scene` changes, fade out, swap content, fade in.
export function SceneManager() {
  const scene = useGameStateStore((s) => s.currentScene)
  const location = useGameStateStore((s) => s.currentLocation)
  const chapter = useGameStateStore((s) => s.currentChapter)

  const [visibleScene, setVisibleScene] = useState(scene)
  const [fading, setFading] = useState(false)
  const pendingScene = useRef(scene)

  useEffect(() => {
    if (scene === visibleScene) return
    pendingScene.current = scene

    // setState inside setTimeout avoids synchronous setState-in-effect lint rule
    const fadeInTimer = setTimeout(() => { setFading(true) }, 0)
    const swapTimer = setTimeout(() => {
      setVisibleScene(pendingScene.current)
      setFading(false)
    }, 320)

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(swapTimer)
    }
  }, [scene, visibleScene])

  return (
    <div className={`scene-manager ${fading ? 'scene-fading' : ''}`}>
      <SceneBackground location={location} chapter={chapter} />
      <CactusRenderer chapter={chapter} />
      <div className="scene-overlay">{resolveView(visibleScene)}</div>
    </div>
  )
}
