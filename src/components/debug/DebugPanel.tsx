import { useState } from 'react'
import type { Chapter, GameScene, Location } from '@/types/game'
import { useGameStateStore } from '@stores/gameStateStore'
import { useEmotionalStore } from '@stores/emotionalStore'

const CHAPTERS: Chapter[] = [
  'prologue', 'denial', 'anger', 'bargaining', 'depression', 'acceptance', 'epilogue',
]
const SCENES: GameScene[] = [
  'main-menu', 'name-input', 'load-screen', 'gameplay',
  'evening-reflection', 'flashback', 'chapter-transition', 'credits',
]
const LOCATIONS: Location[] = [
  'kamar', 'rooftop', 'kelas', 'lab', 'koridor-lab', 'taman',
  'pusat-perbelanjaan', 'jalanan-kota', 'venue-pameran',
  'lapangan', 'restoran', 'tempat-main', 'bioskop', 'kamar-mandi',
]

// Only rendered in development mode
export function DebugPanel() {
  if (!import.meta.env.DEV) return null

  return <DebugPanelInner />
}

function DebugPanelInner() {
  const [open, setOpen] = useState(false)

  const chapter = useGameStateStore((s) => s.currentChapter)
  const scene = useGameStateStore((s) => s.currentScene)
  const location = useGameStateStore((s) => s.currentLocation)
  const setChapter = useGameStateStore((s) => s.setChapter)
  const setScene = useGameStateStore((s) => s.setScene)
  const setLocation = useGameStateStore((s) => s.setLocation)

  const distress = useEmotionalStore((s) => s.distress)
  const hope = useEmotionalStore((s) => s.hope)
  const setDistress = useEmotionalStore((s) => s.setDistress)
  const setHope = useEmotionalStore((s) => s.setHope)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: 11,
      }}
    >
      <button
        onClick={() => { setOpen((v) => !v) }}
        style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#0f0',
          border: '1px solid #0f0',
          borderRadius: 4,
          padding: '2px 8px',
          cursor: 'pointer',
        }}
      >
        {open ? '✕ Debug' : '⚙ Debug'}
      </button>

      {open && (
        <div
          style={{
            background: 'rgba(0,0,0,0.88)',
            border: '1px solid #333',
            borderRadius: 6,
            padding: 12,
            marginTop: 4,
            color: '#eee',
            minWidth: 220,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Chapter</span>
            <select
              value={chapter}
              onChange={(e) => { setChapter(e.target.value as Chapter) }}
              style={{ background: '#111', color: '#eee', border: '1px solid #444', borderRadius: 3, padding: 2 }}
            >
              {CHAPTERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Scene</span>
            <select
              value={scene}
              onChange={(e) => { setScene(e.target.value as GameScene) }}
              style={{ background: '#111', color: '#eee', border: '1px solid #444', borderRadius: 3, padding: 2 }}
            >
              {SCENES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Location</span>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value as Location) }}
              style={{ background: '#111', color: '#eee', border: '1px solid #444', borderRadius: 3, padding: 2 }}
            >
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Distress: {distress}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={distress}
              onChange={(e) => { setDistress(Number(e.target.value)) }}
              style={{ accentColor: '#e53935' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#aaa' }}>Hope: {hope}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={hope}
              onChange={(e) => { setHope(Number(e.target.value)) }}
              style={{ accentColor: '#43a047' }}
            />
          </label>

          <div style={{ borderTop: '1px solid #333', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#aaa', fontSize: 10 }}>Quick Actions</span>
            <button
              onClick={() => { setScene('evening-reflection') }}
              style={{ background: '#1a1a00', color: '#FFD54F', border: '1px solid #555', borderRadius: 3, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}
            >
              ▶ Evening Reflection
            </button>
            <button
              onClick={() => { setScene('gameplay') }}
              style={{ background: '#001a00', color: '#69F0AE', border: '1px solid #555', borderRadius: 3, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}
            >
              ▶ Gameplay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
